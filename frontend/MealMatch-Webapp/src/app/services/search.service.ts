import { Injectable } from '@angular/core';
import { Ingredient } from '../models/ingredient';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../models/recipe';
import { MealType } from '../models/mealtype';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchComplete = false;
  inputIngredients: Ingredient[];
  currentMealType: string;
  allResults: Recipe[];
  pageNum: number;
  pageSize: number;

  constructor(private http: HttpClient) {

  }

  searchForRecipes(ingredients: Ingredient[], mealtype: string) {
    this.searchComplete = false;
    this.inputIngredients = ingredients;
    this.setMealType(mealtype);
    this.http.post("http://localhost:5000/api/recipe_search", {
      "ingredients": ingredients
    })
    .subscribe( (data: any) => {
      this.allResults = data.recipes;
      this.searchComplete = true;
      this.pageNum = data.pageSize;
    });
  }

  getAllResults() {
    return {
      results: this.allResults,
      pageNum: this.pageNum,
      pageSize: this.pageSize,
    }
  }

  getAllMealTypes() {
    return this.http.get<MealType[]>("http://localhost:5000/api/get_all_mealtypes")
    .pipe(
      map( data => {
        // Push 'All' as a Meal Type
        data.splice(0,0,{id:0,name:"All"});
        return data;
      })
    )
  }

  setMealType(mealtype: string) {
    this.currentMealType = mealtype;
  }

  getMealType(): string {
    return this.currentMealType;
  }

}
