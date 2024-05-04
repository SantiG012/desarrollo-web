import { PlayRoomStatus } from "../Enums/play-room-status.enum";
import { StatusCodes } from "../Enums/status-codes.enum";
import { ApiError } from "../Errors";
import { AppDataSource } from "../data-source";
import { PlayRooms, Word, WordsByCategory } from "../entities";
import { Player } from "../interfaces";
import { GenericRepository } from "../repositories/common";

export class SocketUseCases {
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
            category: {}
        }
    };
    

    constructor(){
        this.playRoomRepository = new GenericRepository<PlayRooms>(AppDataSource.getRepository(PlayRooms));
        this.wordsByCategoryRepository = new GenericRepository<WordsByCategory>(AppDataSource.getRepository(WordsByCategory));
    }

    public async joinPlayRoom(player:Player,playRoomId:number):Promise<void>{
        const playRoomDb = await this.playRoomRepository.getOneBy({id:playRoomId})

        if(!playRoomDb){throw new ApiError(`La sala de juegos con id=${playRoomId} no existe`,StatusCodes.BadRequest)}
        
        if(player.playRoomId != playRoomId){throw new ApiError(`El id de la sala de juegos id=${playRoomId} con coincide con el id=${player.playRoomId}`,StatusCodes.BadRequest)}

        const roomPlayers:Player[] = this.roomsInfo[playRoomId]["roomPlayers"];
    
        if(!roomPlayers.includes(player)){roomPlayers.push(player);}
    }

    public async send(message:any,ws:any,playRoomId:number):Promise<void>{
        const playRoomDb = await this.playRoomRepository.getOneBy({id:playRoomId})

        if(!playRoomDb){throw new ApiError(`La sala de juegos con id=${playRoomId} no existe`,StatusCodes.BadRequest)}

        const roomPlayers:Player[] = this.roomsInfo[playRoomId]["roomPlayers"]

        if(!roomPlayers) {return;}
        
        roomPlayers.forEach((player:Player)=>{
            if (player.ws !== ws && player.ws.readyState === 1) {
                player.ws.send(message);
            }
        })
    }

    public async initializeEmptyRoomsInfo(roomId:number,player:Player):Promise<void>{
        const playRoomsDb:PlayRooms[] = await this.playRoomRepository.get({where:{id:roomId}, relations:{category:true}})
        const playRoomDb = playRoomsDb[0]


        if(!playRoomDb){throw new ApiError(`La sala de juegos con id=${roomId} no existe`,StatusCodes.BadRequest)}

        if(player.playRoomId != roomId){throw new ApiError(`El id de la sala de juegos id=${roomId} con coincide con el id=${player.playRoomId}`,StatusCodes.BadRequest)}

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
            category: playRoomDb.category
        }
    }

    public startGame(roomId:number):void{
        const randomIndex = Math.floor(Math.random() * this.roomsInfo[roomId]["roomPlayers"].length);
        this.roomsInfo[roomId]["player"] = this.roomsInfo[roomId]["roomPlayers"][randomIndex];
        this.roomsInfo[roomId]["initialTime"] = Date.now();
    }

    
}