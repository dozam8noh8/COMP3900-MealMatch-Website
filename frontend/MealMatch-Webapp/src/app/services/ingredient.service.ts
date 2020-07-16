import { Injectable } from '@angular/core';

import {Ingredient} from '../models/ingredient';
import { Category } from '../home-page/category';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {

  private ingredientsListStorage: string = "StoredIngredients";

  allIngredients: Ingredient[] = [];
  allCategories: Category[];
  addedIngredients: Ingredient[] = [];

  constructor(private http: HttpClient) { 
    // If there is ingredientList from previous session, restore it
    let storedData = localStorage.getItem(this.ingredientsListStorage);
    if(storedData) {
      this.addedIngredients = JSON.parse(storedData);
    }
    
    this.http.get("http://localhost:5000/api/get_ingredients_in_categories")
    .subscribe( (data: Category[]) => {
        this.allCategories = data;
        this.allCategories.forEach( category => {
          category.ingredients = category.ingredients.map( item => {
            item = { ...item, 
                              // Make sure ingredients (if on localStorage ingredient list) is checked off
                      onList: this.addedIngredients.some(elem => (elem.id===item.id)) ? true : false
                    };
            this.allIngredients.push(item);
            return item;
          });
        });
    });
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
    this.saveIngredients();
  }

  removeFromList(ingredient: Ingredient) {
    ingredient.onList = false;
    this.addedIngredients = this.addedIngredients.filter(item => item!=ingredient);
    this.saveIngredients();
  }

  getAllCategories(): Category[] {
    return this.allCategories;
  }
  
  removeAllFromList() {
    this.addedIngredients.map(ingredient => this.removeFromList(ingredient));
  }

  saveIngredients() {
    localStorage.setItem(this.ingredientsListStorage, JSON.stringify(this.addedIngredients));
  }

}
