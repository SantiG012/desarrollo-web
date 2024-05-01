import { EntityBase } from "../../entities/common";
import { IRepository } from "./repository.interface";
import { FindOptionsWhere, Repository }  from "typeorm";

export class GenericRepository<T extends EntityBase> implements IRepository<T>{
    private _repository:Repository<T>;

    constructor(repository:Repository<T>){
        this._repository = repository;
    }

    async getOneBy(options: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T | null> {
       return this._repository.findOneBy(options);
    }
    async getBy(options: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T[]> {
        return this._repository.findBy(options);
    }
    async getAll(): Promise<T[]> {
        return this._repository.find();
    }
    async create(entity: T): Promise<T> {
        return this._repository.save(entity);
    }
    async update(entity: T): Promise<T> {
        return this._repository.save(entity);
    }
    async delete(entity: T): Promise<void> {
        return this._repository.delete(entity);
    }

}