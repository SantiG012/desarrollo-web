import { StatusCodes } from "../Enums/status-codes.enum";
import { ApiError } from "../Errors";
import { AppDataSource } from "../data-source";
import { Category, Word, WordsByCategory } from "../entities";
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

    public async associateWordWithCategory(wordsByCategory:WordsByCategory):Promise<WordsByCategory>{
        const wordId = wordsByCategory.word.id;
        const categoryId = wordsByCategory.category.id;

        const wordDb = await this.wordRepository.getOneBy({id:wordId});

        if(!wordDb) { throw new ApiError(`La palabra con id=${wordId} no existe`, StatusCodes.BadRequest)}

        const categoryDb =  await this.categoryRepository.getOneBy({id:categoryId});

        if(!categoryDb) { throw new ApiError(`La categoría con id=${categoryId} no existe`, StatusCodes.BadRequest)}

        return await this.wordsByCategoryRepository.create(wordsByCategory);
    }

    public async disassociateWordWithCategory(wordsByCategory:WordsByCategory):Promise<void>{
        
        const wordsByCategoryDb = await this.wordsByCategoryRepository.getOneBy({category:wordsByCategory.category, word:wordsByCategory.word});

        if (!wordsByCategoryDb){throw new ApiError(`La palabra ${wordsByCategory.word.text} no está asociada con la categoría ${wordsByCategory.category.name}`, StatusCodes.BadRequest)}

        return await this.wordsByCategoryRepository.delete(wordsByCategory.id);
    }
}