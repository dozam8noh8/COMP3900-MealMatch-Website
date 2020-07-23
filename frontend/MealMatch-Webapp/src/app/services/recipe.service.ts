import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Recipe } from '../models/recipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private BASE_URL = 'http://localhost:5000/api'; // Our api calls will go to this URL //Move to service
  allMealTypes: string[];

  constructor(private http: HttpClient) {
  }

  // Any data population methods go here. Currently none.
  restart() {

  }
  getRecipeDetails(recipeId: number) {
    return this.http.get<Recipe>(`${this.BASE_URL}/recipe/${recipeId}`);
  }
  getRecipesByUserId(userId: number) {

  }
  deleteRecipe(recipeId: number): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/recipe_delete/${recipeId}`, {observe: 'response'}).pipe(map(x =>// Observe reponse gives access to status.
      {
        console.log(x)
        return x
      })) // Type casting to get headers from response aswell.
  }

  getAllMealTypes() {
    // return this.allMealTypes;
    return this.http.get(`${this.BASE_URL}/get_all_mealtypes`);
  }

  createRecipe(data: any) {
    return this.http.post(`${this.BASE_URL}/add_recipe`, data);
  }

  editRecipe(recipeDetails){
    return this.http.post(`${this.BASE_URL}/edit_recipe`, recipeDetails);
  }
}
