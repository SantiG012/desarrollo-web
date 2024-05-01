import { StatusCodes } from "../Enums/status-codes.enum";
import { ApiError } from "../Errors";
import { AppDataSource } from "../data-source";
import { Category, PlayRooms } from "../entities";
import { GenericRepository } from "../repositories/common";

export class PlayRoomUseCases {
    private playRoomRepository:GenericRepository<PlayRooms>;
    private categoryRepository:GenericRepository<Category>;

    constructor(){
        this.playRoomRepository = new GenericRepository<PlayRooms>(AppDataSource.getRepository(PlayRooms));
        this.categoryRepository = new GenericRepository<Category>(AppDataSource.getRepository(Category));
    }

    public async createPlayRoom(playRoom:PlayRooms):Promise<PlayRooms>{
        const name = playRoom.name;
        const categoryId = playRoom.category.id;
        const playRoomDb = await this.playRoomRepository.getOneBy({name});
        const categoryDb = await this.categoryRepository.getOneBy({id:categoryId})

        if(playRoomDb){throw new ApiError(`La sala de juegos con el nombre ${name} ya existe`,StatusCodes.BadRequest)}
        if(!categoryDb){throw new ApiError(`La categoría con id=${categoryId} no existe`, StatusCodes.BadRequest)}

        return await this.playRoomRepository.create(playRoom);
    }

    public async deletePlayRoom(id:number):Promise<void>{
        const playRoomDb = await this.playRoomRepository.getOneBy({id});

        if(!playRoomDb){throw new ApiError(`La sala de juegos con id=${id} no existe`,StatusCodes.BadRequest)}

        return await this.playRoomRepository.delete(id);
    }


}