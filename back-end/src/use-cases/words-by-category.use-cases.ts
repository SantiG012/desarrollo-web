import { StatusCodes } from "../Enums/status-codes.enum";
import { ApiError } from "../Errors";
import { AppDataSource } from "../data-source";
import { Category, Word, WordsByCategory } from "../entities";
import { WordsByCategoryDto } from "../interfaces";
import { GenericRepository } from "../repositories/common";

export class WordsByCategoryUseCases {
    private wordsByCategoryRepository:GenericRepository<WordsByCategory>;
    private wordRepository:GenericRepository<Word>;
    private categoryRepository:GenericRepository<Category>;

    constructor(){
        this.wordsByCategoryRepository = new GenericRepository<WordsByCategory>(AppDataSource.getRepository(WordsByCategory));
        this.wordRepository =  new GenericRepository<Word>(AppDataSource.getRepository(Word));
        this.categoryRepository = new GenericRepository<Category>(AppDataSource.getRepository(Category));
    }

    public async associateWordWithCategory(wordsByCategoryDto:WordsByCategoryDto):Promise<WordsByCategory>{
        const wordId = wordsByCategoryDto.wordId;
        const categoryId = wordsByCategoryDto.categoryId;

        const wordDb = await this.wordRepository.getOneBy({id:wordId});

        if(!wordDb) { throw new ApiError(`La palabra con id=${wordId} no existe`, StatusCodes.BadRequest)}

        const categoryDb =  await this.categoryRepository.getOneBy({id:categoryId});

        if(!categoryDb) { throw new ApiError(`La categoría con id=${categoryId} no existe`, StatusCodes.BadRequest)}

        const wordsByCategory:WordsByCategory = {id:0,
            word:wordDb,
            category:categoryDb
        }

        return await this.wordsByCategoryRepository.create(wordsByCategory);
    }

    public async disassociateWordWithCategory(id:number):Promise<void>{
        
        const wordsByCategoryDb = await this.wordsByCategoryRepository.getOneBy({id});

        if (!wordsByCategoryDb){throw new ApiError(`La asociación con id=${id} no existe`, StatusCodes.BadRequest)}

        return await this.wordsByCategoryRepository.delete(wordsByCategoryDb.id);
    }
}