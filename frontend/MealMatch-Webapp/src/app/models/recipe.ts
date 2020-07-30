import { Ingredient } from './ingredient';



export interface Recipe {
    id: number;
    name: string;
    user_id: number;
    ingredients: Ingredient[];
    instruction: string[];
    image?: string;
    mealtypes?: any[];
    rating: number;
    rating_count: number;
}