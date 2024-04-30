import { Entity, ManyToOne } from "typeorm";
import { EntityBase } from "./common";
import { Category } from "./category.entity";
import { Word } from "./word.entity";

@Entity({name:'palabras_por_categoria'})
export class WordsByCategory extends EntityBase {
    @ManyToOne(()=> Category, (category)=>category.wordsByCategory)
    category:Category;

    @ManyToOne(()=> Word, (word)=>word.wordsByCategory)
    word:Word;
}