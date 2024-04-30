import { Column, Entity, OneToMany } from "typeorm";
import { EntityBase } from "./common";
import { WordsByCategory } from "./words-by-category.entity";
import { PlayRooms } from "./play-rooms.entity";

@Entity({name:'categoria'})
export class Category extends EntityBase{
    @Column({name:'nombre',length:100})
    name:string;

    @OneToMany(()=> WordsByCategory, (wordsByCategory)=>wordsByCategory.category)
    wordsByCategory:WordsByCategory;

    @OneToMany(()=>PlayRooms, (playRoom)=>playRoom.category)
    playRoom: PlayRooms;

}