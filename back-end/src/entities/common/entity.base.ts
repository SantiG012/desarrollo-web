import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class EntityBase{
    @PrimaryGeneratedColumn()
    id:number;
}