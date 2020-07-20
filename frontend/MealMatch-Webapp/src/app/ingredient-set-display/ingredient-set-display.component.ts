import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Ingredient } from '../models/ingredient';
import { LovelessSet } from '../loveless-sets/loveless-sets.component';
import { Router } from '@angular/router';
import { query } from '@angular/animations';
import { Recipe } from '../models/recipe';

@Component({
  selector: 'app-ingredient-set-display',
  styleUrls: ['./ingredient-set-display.component.scss'],
  template: `
      <mat-card>
        <mat-card-title> Ingredients </mat-card-title>
        <mat-card-content>
          <ol>
            <li *ngFor="let ingredient of set.ingredients"> {{ ingredient }} </li>
          </ol>
        </mat-card-content>
        <button mat-raised-button color="primary" (click)=emitCreateRecipe()> Create Recipe </button>
      </mat-card>

  `
})
export class IngredientSetDisplayComponent implements OnInit {
  @Input() set: LovelessSet;
  @Output() createEmitter: EventEmitter<LovelessSet> = new EventEmitter();
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  emitCreateRecipe() {
    this.createEmitter.emit(this.set);
    let recipe: Recipe = {
      id: -1, // negative id in database means the recipe is being created.
      name: `Loveless Set ${this.set.setId}`,
      ingredients: this.set.ingredients,
      instruction: ""
    }
    let paramObject = JSON.stringify(recipe); // Contains stringified object
    this.router.navigate(['/create'], {queryParams: {contents: paramObject}});
  }

}