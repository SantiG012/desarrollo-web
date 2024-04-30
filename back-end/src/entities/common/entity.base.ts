import { PrimaryGeneratedColumn } from "typeorm";

export class EntityBase{
    @PrimaryGeneratedColumn()
    id:number;
}