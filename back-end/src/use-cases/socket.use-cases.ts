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
    private players:Player[];
    private activePlayRooms:PlayRooms[];
    private playRoomRepository:GenericRepository<PlayRooms>;

    constructor(){
        this.playRoomRepository = new GenericRepository<PlayRooms>(AppDataSource.getRepository(PlayRooms));
    }

    public async joinPlayRoom(player:Player,playRoomId:number,ws:any):Promise<void>{
        const playRoomDb = await this.playRoomRepository.getOneBy({id:playRoomId})

        if(player.playRoomId !== playRoomId){throw new ApiError(`El id de la sala de juegos id=${playRoomId} con coincide con el id id=${player.playRoomId}`,StatusCodes.BadRequest)}

        if(!playRoomDb){throw new ApiError(`La sala de juegos con id=${playRoomId} no existe`,StatusCodes.BadRequest)}

        if(playRoomDb.state === PlayRoomStatus.Waiting){playRoomDb.state = PlayRoomStatus.Active; await this.playRoomRepository.update(playRoomDb)}

        //TODO: Generar el UUID
        this.players.push(player)

        this.notifyNewPlayer()
    }

    private notifyNewPlayer():void{
        this.players.forEach((player:Player,ws:any)=>{
            if (player.ws !== ws && player.ws.readyState === ws.OPEN) {
                player.ws.send(`${player.name} has joined`);
            }
        })
    }

    
}