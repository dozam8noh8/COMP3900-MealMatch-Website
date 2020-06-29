import { Ingredient, RegularIngredient } from './home-page/ingredient';



export interface Recipe {
    id: number;
    name: string;
    // owner: User;
    ingredients: RegularIngredient[];
    instructions: string;
    image: string;

    // Spoonacular attributes
    title: string;
    extendedIngredients: Ingredient[];
}