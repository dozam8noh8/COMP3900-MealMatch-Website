import { Component, OnInit } from '@angular/core';

import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

interface Ingredient {
  id: number;
  name: String;
}

@Component({
  selector: 'app-ingredient-search',
  templateUrl: './ingredient-search.component.html',
  styleUrls: ['./ingredient-search.component.scss']
})

export class IngredientSearchComponent implements OnInit {

  ingredientControl = new FormControl();

  all_ingredients: Ingredient[] = [
    { id: 1, name: 'beef' },
    { id: 2, name: 'milk' },
    { id: 3, name: 'flour' },
    { id: 4, name: 'butter' },
    { id: 5, name: 'sugar' },
    { id: 6, name: 'cream' },
  ];
  added_ingredients: Ingredient[] = [
    { id: 1, name: 'beef' },
  ];

  filteredOptions: Observable<Ingredient[]>;

  constructor() { }

  private _filter(value: string): Ingredient[] {
    const filterValue = value.toString().toLowerCase();
    return filterValue==='' ? [] : this.all_ingredients.filter(item => item.name.startsWith(filterValue) && !this.added_ingredients.some(elem => elem.id==item.id));
  }

  ngOnInit(): void {
    this.filteredOptions = this.ingredientControl.valueChanges
      .pipe(
        map(value => this._filter(value)),
      );    
  }

  displayIngredient(ingredient: Ingredient): String {
    return ingredient.name;
  } 

  addToList(newIngredient: Ingredient): void {
    this.added_ingredients.push(newIngredient);
    this.ingredientControl.setValue('');
  }

}
