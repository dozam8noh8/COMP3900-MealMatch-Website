import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  allMealTypes: string[];
  
  constructor(private http: HttpClient) { 
    this.http.get("http://localhost:5000/api/get_all_mealtypes")
    .subscribe( (data: any[]) => {
      this.allMealTypes = data.map(elem => {
        return elem.name;
      })
    })
  }



  getRecipeDetails(recipeId: number) {
    return this.http.get("http://localhost:5000/api/recipe/"+recipeId);
    // should do some error handling here, or maybe wherever this is called?
  }

  getAllMealTypes() {
    return this.allMealTypes;
  }

}
