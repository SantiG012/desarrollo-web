import { FindManyOptions, FindOptionsWhere } from "typeorm";
import { EntityBase } from "../../entities/common";

export interface IRepository<T extends EntityBase>{
    getOneBy(options: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T | null>;
    getBy(options: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T[]>;
    get(options?: FindManyOptions<T> | undefined):Promise<T[]>;
    create(entity:T):Promise<T>;
    update(entity:T):Promise<T>;
    delete(id:number):Promise<void>;   
}