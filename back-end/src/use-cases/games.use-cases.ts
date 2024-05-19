import { PlayRoomStatus } from "../Enums/play-room-status.enum";
import { StatusCodes } from "../Enums/status-codes.enum";
import { ApiError } from "../Errors";
import { AppDataSource } from "../data-source";
import { PlayRooms, WordsByCategory } from "../entities";
import { Player, ResultsPayload } from "../interfaces";
import { GenericRepository } from "../repositories/common";

export class GameUseCases {
    private playRoomRepository:GenericRepository<PlayRooms>;
    private wordsByCategoryRepository:GenericRepository<WordsByCategory>;

    public roomsInfo: { [key: string]: any } = {
        roomId: {
            roomPlayers: [],
            roomWords: [],
            guessOrdering: [],
            wordIndex: 0,
            player: {},
            initialTime: Date.now(),
            category: {},
            state: ""
        }
    };
    

    constructor(){
        this.playRoomRepository = new GenericRepository<PlayRooms>(AppDataSource.getRepository(PlayRooms));
        this.wordsByCategoryRepository = new GenericRepository<WordsByCategory>(AppDataSource.getRepository(WordsByCategory));
    }


    public async handleNewPlayer(player:Player,playRoomId:number):Promise<void>{
        if(!this.roomExists(playRoomId) || this.isRoomWaitingPlayers(playRoomId)){await this.initializeEmptyRoomWithOnePlayer(playRoomId,player);}

        await this.joinPlayRoom(player,playRoomId);
    }

    private roomExists(roomId:number):boolean{
        return this.roomsInfo[roomId] !== undefined;
    }

    private isRoomWaitingPlayers(roomId:number):boolean{
        return this.roomsInfo[roomId]["state"] === PlayRoomStatus.Waiting;
    }

    private async joinPlayRoom(player:Player,playRoomId:number):Promise<void>{
        const playRoomDb = await this.playRoomRepository.getOneBy({id:playRoomId})

        if(!playRoomDb){throw new ApiError(`La sala de juegos con id=${playRoomId} no existe`,StatusCodes.BadRequest)}
        
        if(player.playRoomId != playRoomId){throw new ApiError(`El id de la sala de juegos id=${playRoomId} con coincide con el id=${player.playRoomId}`,StatusCodes.BadRequest)}

        const roomPlayers:Player[] = this.roomsInfo[playRoomId]["roomPlayers"];
        const roomPlayerById:Player | undefined = roomPlayers.find((roomPlayer:Player)=>roomPlayer.id === player.id );
        const roomPlayerByName:Player | undefined = roomPlayers.find((roomPlayer:Player)=>roomPlayer.name === player.name );
        const roomPlayerByAvatar:Player | undefined = roomPlayers.find((roomPlayer:Player)=>roomPlayer.avatar === player.avatar );

        if(roomPlayerById){throw new ApiError(`El jugador con id=${roomPlayerById.id} ya está en la sala de juego`,StatusCodes.BadRequest)}
        if(roomPlayerByName){throw new ApiError(`El jugador con nombre=${roomPlayerByName.name} ya está en la sala de juego`,StatusCodes.BadRequest)}
        if(roomPlayerByAvatar){throw new ApiError(`El jugador con avatar=${roomPlayerByAvatar.avatar} ya está en la sala de juego`,StatusCodes.BadRequest)}

        roomPlayers.push(player);
    }

    private async initializeEmptyRoomWithOnePlayer(roomId:number,player:Player):Promise<void>{
        const playRoomsDb:PlayRooms[] = await this.playRoomRepository.get({where:{id:roomId}, relations:{category:true}})
        const playRoomDb = playRoomsDb[0]


        if(!playRoomDb){throw new ApiError(`La sala de juegos con id=${roomId} no existe`,StatusCodes.BadRequest)}

        if(player.playRoomId != roomId){throw new ApiError(`El id de la sala de juegos id=${roomId} con coincide con el id=${player.playRoomId}`,StatusCodes.BadRequest)}

        const wordsByCategoryDb = await this.wordsByCategoryRepository.get({where:{category:playRoomDb.category}});
        
        if(wordsByCategoryDb.length === 0){throw new ApiError(`No hay palabras para la categoría ${playRoomDb.category.name}`,StatusCodes.BadRequest)}

        if(playRoomDb.state === PlayRoomStatus.Waiting){playRoomDb.state = PlayRoomStatus.Active; await this.playRoomRepository.update(playRoomDb)}

        const wordsByCategory = await this.wordsByCategoryRepository.get({where:{category:playRoomDb.category}, relations:{word:true}})

        const words = wordsByCategory.map((wordsByCategory:WordsByCategory)=>wordsByCategory.word.text);

        const randomIndex = Math.floor(Math.random() * words.length);

        const roomPlayers = [player];


        this.roomsInfo[roomId] = {
            roomPlayers: roomPlayers,
            roomWords: words,
            guessOrdering: [],
            wordIndex: randomIndex,
            player: undefined,
            initialTime: undefined,
            category: playRoomDb.category,
            state: playRoomDb.state
        }
    }

    public gameCanStart(roomId:number):boolean{
        if(this.hasEnoughPlayers(roomId) && !this.hasSelectedPlayer(roomId)){return true;}
        return false;
    }

    public startGame(roomId:number):void{
        const randomIndex = Math.floor(Math.random() * this.roomsInfo[roomId]["roomPlayers"].length);
        const player = this.roomsInfo[roomId]["roomPlayers"][randomIndex];
        this.roomsInfo[roomId]["player"] = player;
        this.roomsInfo[roomId]["initialTime"] = Date.now();
        const word = this.roomsInfo[roomId]["roomWords"][this.roomsInfo[roomId]["wordIndex"]];
    }

    private hasEnoughPlayers(roomId:number):boolean{
        return this.roomsInfo[roomId]["roomPlayers"].length > 1;
    }

    private hasSelectedPlayer(roomId:number):boolean{
        return this.roomsInfo[roomId]["player"] !== undefined;
    }


    public canSendMessages(player:Player, roomId:number):boolean{
        if (this.isDrawing(player, roomId)) { return false; }
        if (this.alreadyWon(player, roomId)) { return false; }
        return true;
    }

    public getPlayers(roomId:number):Player[]{
        return this.roomsInfo[roomId]["roomPlayers"];
    }

    public getResults(roomId:number):ResultsPayload[]{
        const results:ResultsPayload[] = this.roomsInfo[roomId]["roomPlayers"].map((player: Player) => ({
            name: player.name,
            score: player.score
        }));

        return results;
    }

    public handleGameOver(roomId:number):void{
        this.deleteGuessedWord(roomId);
        this.resetGame(roomId);
    }


    private resetGame(roomId:number):void{
        this.roomsInfo[roomId]["guessOrdering"] = [];
        const wordsLength =  this.roomsInfo[roomId]["roomWords"].length
        this.roomsInfo[roomId]["wordIndex"] = Math.floor(Math.random() * wordsLength);
        this.startGame(roomId);
    }

    private deleteGuessedWord(roomId:number):void{
        this.roomsInfo[roomId]["roomWords"].splice(this.roomsInfo[roomId]["wordIndex"],1);
    }

    public wordGuessed(roomId:number, userAttempt:string):boolean{
        const word = this.roomsInfo[roomId]["roomWords"][this.roomsInfo[roomId]["wordIndex"]];
        return word.toUpperCase() === userAttempt.toUpperCase();
    }

    public isGameOver(roomId:number):boolean{
        const wordsLength =  this.roomsInfo[roomId]["roomWords"].length;
        if(!this.allWon(roomId)){return false;}
        return wordsLength === 1;
    }

    public updateScore(roomId:number,player:Player):void{
        const elapsedTime = Date.now() - this.roomsInfo[roomId]["initialTime"];
        const score = elapsedTime;
        this.roomsInfo[roomId]["guessOrdering"].push(player);
        const playerPosition = this.roomsInfo[roomId]["guessOrdering"].indexOf(player);
        player.score += (score* Math.abs(playerPosition-5));
    }

    private isDrawing(player:Player,roomId:number):boolean{
        return this.roomsInfo[roomId]["player"]===player;
    }

    private alreadyWon(player:Player, roomId:number):boolean{
        return this.roomsInfo[roomId]["guessOrdering"].includes(player);
    }

    public allWon(roomId:number):boolean{
        const winners = this.roomsInfo[roomId]["guessOrdering"].length;
        const roomPlayers = this.roomsInfo[roomId]["roomPlayers"].length;

        return winners === (roomPlayers-1);
    }


    public async changeRoomStatus(roomId:number):Promise<void>{
        this.roomsInfo[roomId]["roomPlayers"] = [];
        this.roomsInfo[roomId]["roomWords"] = [];
        this.roomsInfo[roomId]["guessOrdering"] = [];
        this.roomsInfo[roomId]["wordIndex"] = 0;
        this.roomsInfo[roomId]["player"] = undefined;
        this.roomsInfo[roomId]["initialTime"] = undefined;
        this.roomsInfo[roomId]["category"] = {};
        this.roomsInfo[roomId]["state"] = PlayRoomStatus.Waiting;

        const playRoomDb = await this.playRoomRepository.getOneBy({id:roomId})

        if(playRoomDb){playRoomDb.state = PlayRoomStatus.Waiting; await this.playRoomRepository.update(playRoomDb)}

        return;
    }

    public generateNewPlayer(userId:string,name:string, avatar:string,playRoomId:number):Player{
        if(!userId || !name || !avatar){throw new ApiError("El jugador debe tener un id, nombre y avatar",StatusCodes.BadRequest);}

        const score:number = 1;
        const ws = undefined;

        return{
            id:userId,
            playRoomId,
            name,
            avatar,
            ws,
            score
        }
    }
    
}