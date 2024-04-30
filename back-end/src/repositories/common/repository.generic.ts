import { EntityBase } from "../../entities/common";
import { IRepository } from "./repository.interface";
import { Repository }  from "typeorm";

export class GenericRepository<T extends EntityBase> implements IRepository<T>{
    private _repository:Repository;

    constructor(repository:Repository){
        this._repository = repository;
    }

    getOneBy(options: Object): Promise<T | null> {
       return this._repository.findOneBy(options);
    }
    getBy(options: Object): Promise<T[]> {
        return this._repository.findBy(options);
    }
    getAll(): Promise<T[]> {
        return this._repository.find();
    }
    create(entity: T): Promise<T> {
        return this._repository.save(entity);
    }
    update(entity: T): Promise<T> {
        return this._repository.save(entity);
    }
    delete(entity: T): Promise<void> {
        return this._repository.delete(entity);
    }

}