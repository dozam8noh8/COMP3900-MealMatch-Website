import { Injectable } from '@angular/core';
import { Ingredient } from '../models/ingredient';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../models/recipe';
import { MealType } from '../models/mealtype';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
/* The search service provides the data and api calls to make searches.
the most common use case is searching for recipes that can be made with an input
set of ingredients. */
export class SearchService {
  // Whether the api call has completed
  searchComplete = false;
  // The ingredients that are used in the search to find recipes
  inputIngredients: Ingredient[];
  // The mealtype we are filtering for
  currentMealType: string;
  // The list of all recipes that satisfy the search criteria.
  allResults: Recipe[];

  // Pagination variables.
  pageNum: number;
  pageSize: number;

  constructor(private http: HttpClient) {

  }
  // Perform api call to search in the backend. Returns a list of all recipes satisfying criteria fitting into
  // the paginated page.
  searchForRecipes(ingredients: Ingredient[], mealtype: string, displayedPage?: number, itemsPerPage?:number) {
    this.searchComplete = false;
    this.inputIngredients = ingredients;
    this.setMealType(mealtype);
    this.http.post("http://localhost:5000/api/recipe_search", {
      "ingredients": ingredients,
    },
    {params: {
      page_num: displayedPage?.toString() || "1",
      page_size: itemsPerPage?.toString() || "10",
    }})
    .subscribe( (data: any) => {
      this.allResults = data.recipes;
      this.searchComplete = true;
      this.pageNum = data.page_num;
      this.pageSize = data.page_size;
    });
  }
  // Get the recipes and pagination details
  getAllResults() {
    return {
      recipes: this.allResults,
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      totalResults: this.allResults.length,
    }
  }
  // Get all the mealtypes from the backend, then add "All" as a mealtype that
  // encompasses all mealtypes in one heading.
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
