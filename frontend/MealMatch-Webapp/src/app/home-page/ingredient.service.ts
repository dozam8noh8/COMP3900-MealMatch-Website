import { Injectable } from '@angular/core';

import {Ingredient} from './ingredient';
import { Category } from './category';

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

const ALL_CATEGORIES: Category[] = [
  { id: 1, name: 'baking', items: [ALL_INGREDIENTS[2]] },
  { id: 2, name: 'produce', items: [ALL_INGREDIENTS[7], ALL_INGREDIENTS[8], ALL_INGREDIENTS[9]] },
  { id: 3, name: 'dairy', items: [ALL_INGREDIENTS[1], ALL_INGREDIENTS[3], ALL_INGREDIENTS[5], ALL_INGREDIENTS[6]] },
  { id: 4, name: 'meat', items: [ALL_INGREDIENTS[0]] },
];

@Injectable({
  providedIn: 'root'
})
export class IngredientService {

  ngOnInit() { }

  constructor() { }

  getAllIngredients(): Ingredient[] {
    return ALL_INGREDIENTS;
  }

  getAddedIngredients(): Ingredient[] {
    return ALL_INGREDIENTS.filter(item => item.onList===true);
  }

  addToList(newIngredient: Ingredient) {
    newIngredient.onList = true;
  }

  removeFromList(ingredient: Ingredient) {
    ingredient.onList = false;
  }

  getAllCategories(): Category[] {
    return ALL_CATEGORIES;
  }

}
