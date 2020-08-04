import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Ingredient } from '../models/ingredient';
import { LovelessSet } from '../loveless-sets/loveless-sets.component';
import { Router } from '@angular/router';
import { Recipe } from '../models/recipe';

@Component({
  selector: 'app-ingredient-set-display',
  styleUrls: ['./ingredient-set-display.component.scss'],
  template: `
      <mat-card>
        <mat-card-title> Loveless Set {{set.setId}} </mat-card-title>
        <mat-card-content>
          <div class="text-flex">
          <ol>
            <li *ngFor="let ingredient of set.ingredients"> {{ ingredient.name }} </li>
          </ol>
          <h1 class="copperplate"> {{set.count}} Recipe searcher(s) searched for this set of ingredients </h1>
          <button mat-raised-button color="primary" (click)=emitCreateRecipe()> Create Recipe </button>
        </div>
        </mat-card-content>
      </mat-card>

  `
})
/* The ingredient set display component shows sets of ingredients which
are commonly searched but have no recipes. It also tells users how many times
the ingredients were searched. */
export class IngredientSetDisplayComponent implements OnInit {
  // The set of ingredients that have been searched.
  @Input() set: LovelessSet;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  emitCreateRecipe() {
    let recipe: Recipe = {
      id: -1, // negative id represents the set doesn't have a real id.
      name: `Loveless Set ${this.set.setId}`,
      ingredients: this.set.ingredients,
      instruction: [],
      rating: 0,
      rating_count: 0,
    }
    let paramObject = JSON.stringify(recipe); // Contains stringified object
    this.router.navigate(['/create'], {queryParams: {contents: paramObject}});
  }

}
