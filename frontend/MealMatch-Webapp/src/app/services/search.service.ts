import { Injectable } from '@angular/core';
import { Ingredient } from '../models/ingredient';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../models/recipe';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  allMealTypes = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Miscellaneous'];
  
  searchComplete = false;
  inputIngredients: Ingredient[];
  allResults: Recipe[];

  constructor(private http: HttpClient) { }

  searchForRecipes(ingredients: Ingredient[]) {
    this.inputIngredients = ingredients;
    this.http.post("http://localhost:5000/api/recipe_search", {
      "ingredients": ingredients
    })
    .subscribe( (data: Recipe[]) => {
      this.allResults = data;
      this.searchComplete = true;
    });
  }

  getAllResults() {
    return this.allResults;
  }

}
