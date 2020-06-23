import { Ingredient } from './home-page/ingredient';



export interface Recipe {
    id: number;
    title: string;
    // owner: User;
    extendedIngredients: Ingredient[];
    instructions: string;
}