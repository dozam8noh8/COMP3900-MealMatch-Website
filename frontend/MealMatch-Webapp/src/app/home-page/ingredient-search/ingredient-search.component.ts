import { Component, OnInit, ɵConsole } from '@angular/core';

import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {Ingredient} from '../../models/ingredient';
import { IngredientService } from '../../services/ingredient.service';

@Component({
  selector: 'app-ingredient-search',
  templateUrl: './ingredient-search.component.html',
  styleUrls: ['./ingredient-search.component.scss']
})

export class IngredientSearchComponent implements OnInit {

  ingredientService: IngredientService;
  ingredientControl = new FormControl();
  filteredOptions: Observable<Ingredient[]>;

  constructor(ingService: IngredientService) {
    this.ingredientService = ingService;
  }

  ngOnInit(): void {
    this.filteredOptions = this.ingredientControl.valueChanges
      .pipe(
        map(value => this._filter(value)),
      );
  }

  // Investigate this, was just a temporary fix for the demo.
  displayIngredient(ingredient: Ingredient): String {
    return ingredient?.name;
  }

  addToList(newIngredient: Ingredient) {
    this.ingredientService.addToList(newIngredient);
    this.ingredientControl.setValue('');
  }

  private _filter(value: string): Ingredient[] {
    const filterValue = value.toString().toLowerCase();
    return filterValue==='' ? [] : this.ingredientService.getAllIngredients().filter(item => {
          return item.name.toLowerCase().startsWith(filterValue) && !item.onList
      });
  }

}