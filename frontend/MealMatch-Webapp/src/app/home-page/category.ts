
import {Ingredient} from './ingredient';

export interface Category {
    id: number;
    name: String;
    ingredients: Ingredient[];
}