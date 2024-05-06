import { StatusCodes } from "../Enums/status-codes.enum";
import { ApiError } from "../Errors";
import { AppDataSource } from "../data-source";
import { Category, PlayRooms, WordsByCategory } from "../entities";
import { GenericRepository } from "../repositories/common";

export class PlayRoomUseCases {
    private playRoomRepository:GenericRepository<PlayRooms>;
    private categoryRepository:GenericRepository<Category>;
    private wordsByCategoryRepository:GenericRepository<WordsByCategory>;
    

    constructor(){
        this.playRoomRepository = new GenericRepository<PlayRooms>(AppDataSource.getRepository(PlayRooms));
        this.categoryRepository = new GenericRepository<Category>(AppDataSource.getRepository(Category));
        this.wordsByCategoryRepository = new GenericRepository<WordsByCategory>(AppDataSource.getRepository(WordsByCategory));
    }

    public async getPlayRoomsWords(id:number):Promise<string[]>{
        const playRoomDb = await this.playRoomRepository.get({where:{id}, relations:{category:true}});
        if(!playRoomDb[0]){throw new ApiError(`La sala de juegos con id=${id} no existe`,StatusCodes.BadRequest)}

        const categoryId = playRoomDb[0].category.id;

        const wordsByCategory = await this.wordsByCategoryRepository.get({where:{category:{id:categoryId}}, relations:{word:true}});

        return wordsByCategory.map(w=>w.word.text);
    }

    public async getPlayRooms(state:string, categoryId:number):Promise<PlayRooms[]>{
        const playRooms = await this.playRoomRepository.get({where:{state, category:{id:categoryId}}});
        return playRooms;
    }

    public async createPlayRoom(playRoom:any):Promise<PlayRooms>{
        const name = playRoom.name;
        const categoryId = playRoom.categoryId;
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