import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../models/recipe';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
/* The recipe service handles data and api interactions associated with recipes,
it can fetch, edit, and delete recipes. It also takes care of mealtypes associated
with recipes */
export class RecipeService {
  // Our api calls will go to this URL
  private BASE_URL = 'http://localhost:5000/api';
  // All the mealtype options to filter by.
  allMealTypes: string[];

  constructor(private http: HttpClient) {
  }

  // Get a paginated response of all recipes based on pagination input
  getAllRecipes(pageNum?: number, pageSize?: number) {
    return this.http.get(`${this.BASE_URL}/all_recipes`,
    {params: {
      page_num: pageNum?.toString() || "1",
      page_size: pageSize?.toString() || "12",
    }});
  }
  getRecipeDetails(recipeId: number) {
    return this.http.get<Recipe>(`${this.BASE_URL}/recipe/${recipeId}`);
  }

  deleteRecipe(recipeId: number): Observable<any> {
     // Type casting to observe to get headers from response aswell.
    return this.http.delete<any>(`${this.BASE_URL}/recipe_delete/${recipeId}`, {observe: 'response'});
  }
  // Get all mealtypes except "All" which is a feature of the frontend.
  getAllMealTypes() {
    return this.http.get(`${this.BASE_URL}/get_all_mealtypes`);
  }

  createRecipe(data: any) {
    return this.http.post(`${this.BASE_URL}/add_recipe`, data);
  }

  editRecipe(recipeDetails){
    return this.http.post(`${this.BASE_URL}/edit_recipe`, recipeDetails);
  }
  // Return the top rated recipes and recipe contributors
  getTopRated(){
    return this.http.get(`${this.BASE_URL}/top_rated`);
  }
}
