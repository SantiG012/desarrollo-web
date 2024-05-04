import { PlayRoomStatus } from "../Enums/play-room-status.enum";
import { StatusCodes } from "../Enums/status-codes.enum";
import { WebScoketEventTypes } from "../Enums/ws-events-types.enum";
import { WebScoketMessageTypes } from "../Enums/ws-messages-types.enum";
import { ApiError } from "../Errors";
import { AppDataSource } from "../data-source";
import { PlayRooms } from "../entities";
import { Player } from "../interfaces";
import { GenericRepository } from "../repositories/common";

export class SocketUseCases {
    private players:Player[] = [];
    private activePlayRooms:PlayRooms[];
    private playRoomRepository:GenericRepository<PlayRooms>;

    constructor(){
        this.playRoomRepository = new GenericRepository<PlayRooms>(AppDataSource.getRepository(PlayRooms));
    }

    public async joinPlayRoom(player:Player,playRoomId:number,ws:any):Promise<void>{
        const playRoomDb = await this.playRoomRepository.getOneBy({id:playRoomId})

        if(!playRoomDb){throw new ApiError(`La sala de juegos con id=${playRoomId} no existe`,StatusCodes.BadRequest)}
        
        if(player.playRoomId != playRoomId){throw new ApiError(`El id de la sala de juegos id=${playRoomId} con coincide con el id=${player.playRoomId}`,StatusCodes.BadRequest)}

        if(playRoomDb.state === PlayRoomStatus.Waiting){playRoomDb.state = PlayRoomStatus.Active; await this.playRoomRepository.update(playRoomDb)}

        //TODO: Generar el UUID
        this.players.push(player);

        const joinMessage=`${player.name} has joined`;

        this.send(joinMessage,ws,playRoomId);
    }

    public send(message:any,ws:any,playRoomId:number):void{
        const roomPlayers = this.players.filter((player: Player) => player.playRoomId == playRoomId);
        
        roomPlayers.forEach((player:Player)=>{
            if (player.ws !== ws && player.ws.readyState === 1) {
                player.ws.send(message);
            }
        })
    }

    
}