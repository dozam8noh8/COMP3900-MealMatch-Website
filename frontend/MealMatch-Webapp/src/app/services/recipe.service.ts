import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private BASE_URL = 'http://localhost:5000/api'; // Our api calls will go to this URL //Move to service
  constructor(private http: HttpClient) { }

  getRecipeDetails(recipeId: number) {
    return this.http.get(`${this.BASE_URL}/recipe/${recipeId}`);
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
}