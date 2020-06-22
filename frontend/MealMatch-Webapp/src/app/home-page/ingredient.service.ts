import { Injectable } from '@angular/core';

import {Ingredient} from './ingredient';

const ALL_INGREDIENTS: Ingredient[] = [
  { id: 1, name: 'beef' },
  { id: 2, name: 'milk' },
  { id: 3, name: 'flour' },
  { id: 4, name: 'butter' },
  { id: 5, name: 'sugar' },
  { id: 6, name: 'cream' },
  { id: 7, name: 'egg'},
  { id: 8, name: 'apple'},
  { id: 9, name: 'pear'},
  { id: 10, name: 'banana'},   
];


@Injectable({
  providedIn: 'root'
})
export class IngredientService {

  added_ingredients: Ingredient[] = [
    { id: 1, name: 'beef' },
  ];

  ngOnInit() {
  
  }

  constructor() { }

  getAllIngredients(): Ingredient[] {
    return ALL_INGREDIENTS;
  }

  getAddedIngredients(): Ingredient[] {
    return this.added_ingredients;
  }

  addToList(newIngredient: Ingredient) {
    this.added_ingredients.push(newIngredient);
  }

  removeFromList(ingredient: Ingredient) {
    this.added_ingredients = this.added_ingredients.filter(item => item.id!=ingredient.id);
  }

}
