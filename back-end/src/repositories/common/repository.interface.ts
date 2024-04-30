import { EntityBase } from "../../entities/common";

export interface IRepository<T extends EntityBase>{
    getOneBy(options:Object): Promise<T | null>;
    getBy(options:Object): Promise<T[]>;
    getAll():Promise<T[]>;
    create(entity:T):Promise<T>;
    update(entity:T):Promise<T>;
    delete(entity:T):Promise<void>;   
}