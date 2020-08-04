import { Ingredient } from './ingredient';
import { UserDetails } from './user';



export interface Recipe {
    id: number;
    name: string;
    ingredients: Ingredient[];
    instruction: string[];
    image?: string;
    mealtypes?: any[];
    rating: number;
    rating_count: number;
    user?: UserDetails;
}