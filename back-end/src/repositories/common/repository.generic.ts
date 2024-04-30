import { EntityBase } from "../../entities/common";
import { IRepository } from "./repository.interface";
import { Repository }  from "typeorm";

export class GenericRepository<T extends EntityBase> implements IRepository<T>{
    private _repository:Repository;

    constructor(repository:Repository){
        this._repository = repository;
    }

    async getOneBy(options: Object): Promise<T | null> {
       return this._repository.findOneBy(options);
    }
    async getBy(options: Object): Promise<T[]> {
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