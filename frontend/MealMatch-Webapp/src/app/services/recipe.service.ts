import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../models/recipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  // Our api calls will go to this URL
  private BASE_URL = 'http://localhost:5000/api';
  // All the mealtype options to filter by.
  allMealTypes: string[];

  constructor(private http: HttpClient) {
  }

  getRecipeDetails(recipeId: number) {
    return this.http.get<Recipe>(`${this.BASE_URL}/recipe/${recipeId}`);
  }

  deleteRecipe(recipeId: number): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/recipe_delete/${recipeId}`, {observe: 'response'}); // Type casting to get headers from response aswell.
  }

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
