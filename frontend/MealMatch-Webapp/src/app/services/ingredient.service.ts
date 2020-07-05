import { Injectable } from '@angular/core';

import {Ingredient} from '../models/ingredient';
import { Category } from '../home-page/category';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {

  requestComplete = false;
  requestSuccessful = false;
  error = null;
  allIngredients: Ingredient[] = [];
  allCategories: Category[];
  addedIngredients: Ingredient[] = [];

  constructor(private http: HttpClient) { 
    this.http.get("http://localhost:5000/api/get_ingredients_in_categories")
    .subscribe( 
      (data: Category[]) => {
        this.requestComplete = true;
        this.requestSuccessful = true;
        this.allCategories = data;
        this.allCategories.forEach( category => {
          category.ingredients = category.ingredients.map( item => {
            item = { ...item, onList: false };
            this.allIngredients.push(item);
            return item;
          });
        });
      },
      (err: HttpErrorResponse) => {
        this.requestComplete = true;
        this.requestSuccessful = false;
        this.error = err;
      }
    )
  }
  
  ngOnInit() { }

  getAllIngredients() {
    return this.allIngredients;
  }

  getAddedIngredients(): Ingredient[] {
    return this.addedIngredients;
  }

  addOrRemove(ingredient: Ingredient) {
    ingredient.onList ? this.removeFromList(ingredient) : this.addToList(ingredient);
  }

  addToList(newIngredient: Ingredient) {
    newIngredient.onList = true;
    this.addedIngredients.push(newIngredient);
  }

  removeFromList(ingredient: Ingredient) {
    ingredient.onList = false;
    this.addedIngredients = this.addedIngredients.filter(item => item!=ingredient);
  }

  getAllCategories(): Category[] {
    return this.allCategories;
  }
  
  removeAllFromList() {
    this.addedIngredients.map(ingredient => this.removeFromList(ingredient));
  }

}
