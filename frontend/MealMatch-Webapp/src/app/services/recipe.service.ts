import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private http: HttpClient) { }

  getRecipeDetails(recipeId: number) {
    return this.http.get("http://localhost:5000/api/recipe/"+recipeId);
  }

}
