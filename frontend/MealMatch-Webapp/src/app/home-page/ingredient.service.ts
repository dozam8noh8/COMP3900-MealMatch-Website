import { Injectable } from '@angular/core';

import {Ingredient} from './ingredient';
import { Category } from './category';
import { HttpClient } from '@angular/common/http';

var ALL_INGREDIENTS: Ingredient[] = [
  { id: 1, name: 'beef', onList: true},
  { id: 2, name: 'milk', onList: false },
  { id: 3, name: 'flour', onList: false },
  { id: 4, name: 'butter', onList: false },
  { id: 5, name: 'sugar', onList: false },
  { id: 6, name: 'cream', onList: false },
  { id: 7, name: 'egg', onList: false },
  { id: 8, name: 'apple', onList: false },
  { id: 9, name: 'pear', onList: false },
  { id: 10, name: 'banana', onList: false },   
];

@Injectable({
  providedIn: 'root'
})
export class IngredientService {

  allIngredients: Ingredient[] = [];
  allCategories: Category[];
  // addedIngredients: Ingredient[] = [];

  constructor(private http: HttpClient) { 
    this.http.get("http://localhost:5000/api/get_category")
    .subscribe( (data: Category[]) => {
        this.allCategories = data;
        this.allCategories.forEach( catergory => {
          catergory.ingredients = catergory.ingredients.map( item => {
            item = { ...item, onList: false };
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
    return this.allIngredients.filter(item => item.onList===true);
  }

  addToList(newIngredient: Ingredient) {
    newIngredient.onList = true;
  }

  removeFromList(ingredient: Ingredient) {
    ingredient.onList = false;
  }

  getAllCategories(): Category[] {
    return this.allCategories;
  }

}
