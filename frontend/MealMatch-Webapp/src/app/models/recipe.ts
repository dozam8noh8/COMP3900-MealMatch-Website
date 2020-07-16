import { Ingredient, RegularIngredient } from './ingredient';



export interface Recipe {
    id: number;
    name: string;
    // owner: User;
    ingredients: Ingredient[];
    instruction: string;
    image: string;
    mealtypes: any[];
}