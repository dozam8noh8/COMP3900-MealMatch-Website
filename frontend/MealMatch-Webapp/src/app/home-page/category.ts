
import {Ingredient} from '../models/ingredient';

export interface Category {
    id: number;
    name: String;
    ingredients: Ingredient[];
}