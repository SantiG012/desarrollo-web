import { Column, OneToMany, Entity } from "typeorm";
import { EntityBase } from "./common";
import { WordsByCategory } from "./words-by-category.entity";

@Entity({name:'palabra'})
export class Word extends EntityBase{
    @Column({ name:"texto", length:255})
    text:string;

    @OneToMany(()=> WordsByCategory, (wordsByCategory)=>wordsByCategory.word)
    wordsByCategory:WordsByCategory;
}