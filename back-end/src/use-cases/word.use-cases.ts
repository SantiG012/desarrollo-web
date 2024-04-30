import { StatusCodes } from "../Enums/status-codes.enum";
import { ApiError } from "../Errors";
import { AppDataSource } from "../data-source";
import { Word } from "../entities";
import { GenericRepository } from "../repositories/common";

export class WordUseCases {
    private wordRepository:GenericRepository<Word>;

    constructor(){
        this.wordRepository =  new GenericRepository<Word>(AppDataSource.getRepository(Word));
    }

    public async addWord(word:Word):Promise<Word>{
        const wordText = word.text.toUpperCase()

        const wordDb = await this.wordRepository.getOneBy({ wordText });

        if (wordDb){ throw new ApiError(`La palabra ${word.text} ya existe`, StatusCodes.BadRequest)}

        word.text = wordText;

        return await this.wordRepository.create(word);
    }

    public async editWord(word:Word):Promise<Word>{
        const id = word.id;

        let wordDb = await this.wordRepository.getOneBy({id});


        if (!wordDb){ throw new ApiError(`La palabra con ${id} no existe`, StatusCodes.BadRequest)}

        const wordText = word.text.toUpperCase()

        wordDb = await this.wordRepository.getOneBy({ wordText });

        if (wordDb){ throw new ApiError(`La palabra ${word.text} ya existe`, StatusCodes.BadRequest)}

        word.text = wordText;

        return await this.wordRepository.update(word);
    }

    public async deleteWord(id:number){
        const wordDb = await this.wordRepository.getOneBy({id});

        if (!wordDb){ throw new ApiError(`La palabra con ${id} no existe`, StatusCodes.BadRequest)}

        return await this.wordRepository.delete()
    }
}