import { Column, ManyToOne, Entity } from "typeorm";
import { EntityBase } from "./common";
import { Category } from "./category.entity";

@Entity({name:'sala_de_juego'})
export class PlayRooms extends EntityBase {
    @Column({name:'nombre', length:100})
    name:string;

    @Column({name:"estado", length:20})
    state:string;

    @ManyToOne(()=>Category, (category)=>category.playRoom)
    category:Category;
}