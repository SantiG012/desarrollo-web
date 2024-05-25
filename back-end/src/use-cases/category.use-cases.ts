import { StatusCodes } from "../Enums/status-codes.enum";
import { ApiError } from "../Errors";
import { AppDataSource } from "../data-source";
import { Category } from "../entities";
import { GenericRepository } from "../repositories/common";

export class CategoryUseCases {
    private categoryRepository:GenericRepository<Category>;

    constructor(){
        this.categoryRepository = new GenericRepository<Category>(AppDataSource.getRepository(Category));
    }

    public async getCategories():Promise<Category[]>{
        return await this.categoryRepository.get();
    }

    public async addCategory(category:Category):Promise<Category>{
        const name = category.name.toUpperCase();

        const categoryDb = await this.categoryRepository.getOneBy({name});

        if(categoryDb){throw new ApiError(`La categoría ${name} ya existe`, StatusCodes.BadRequest)}

        category.name = name;

        return await this.categoryRepository.create(category);
    }

    public async editCategory(category:Category):Promise<Category>{
        const id = category.id;
        const name = category.name.toUpperCase();
        let categoryDb;

        categoryDb = await this.categoryRepository.getOneBy({id});

        if (!categoryDb){throw new ApiError(`La categoría con id=${id} no existe`, StatusCodes.BadRequest)}

        categoryDb = await this.categoryRepository.getOneBy({name})

        if (categoryDb){throw new ApiError(`La categoría ${name} ya existe`, StatusCodes.BadRequest)}

        category.name = name;

        return await this.categoryRepository.update(category);
    }

    public async deleteCategory (id:number):Promise<void>{
        const categoryDb = await this.categoryRepository.getOneBy({id});

        if(!categoryDb){throw new ApiError(`La categoría con id=${id} no existe`, StatusCodes.BadRequest)}

        return await this.categoryRepository.delete(id);
    }


}