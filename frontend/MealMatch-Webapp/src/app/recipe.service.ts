import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private http: HttpClient) { }

  getRecipeDetails(recipeId: number) {
    return this.http.get("https://api.spoonacular.com/recipes/"+recipeId+"/information?includeNutrition=false&apiKey=aae2fc76795c46a4b64ff5d2f361a583");
  }

}
