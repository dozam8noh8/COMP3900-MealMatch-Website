import { Ingredient } from './home-page/ingredient';



export interface Recipe {
    id: number;
    name: string;
    // owner: User;
    ingredients: Ingredient[];
    instruction: string;
    image: string;
}