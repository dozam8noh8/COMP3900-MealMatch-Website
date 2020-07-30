import { Component, OnInit } from '@angular/core';
import { Recipe } from '../models/recipe';
import { RecipeService } from '../services/recipe.service';
import { IngredientService } from '../services/ingredient.service';
import { Ingredient } from '../models/ingredient';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loveless-sets',
  styleUrls: ['./loveless-sets.component.scss'],
  template: `
    <h1 *ngIf="!loading && sets.length > 1" class="greeting-text"> These ingredients need some love! </h1>
    <div *ngIf="!loading && sets.length < 1">
      <h1  class="greeting-text">No commonly searched ingredients without recipes! </h1>
      <button mat-raised-button (click)="handleDashboardButton()" color="primary" class="copperplate submitButton"> Back to dashboard </button>
    </div>
    <mat-spinner *ngIf="loading"> </mat-spinner>
    <div class="ingredient-set" *ngFor="let set of sets">
        <app-ingredient-set-display [set]="set"> </app-ingredient-set-display>
    </div>

  `,
})
export class LovelessSetsComponent implements OnInit {
  loading = true;
  sets: LovelessSet[];
  constructor(private ingredientService: IngredientService, private router: Router) { }

  ngOnInit(): void {
    // POPULATE SETS
    this.ingredientService.getLovelessSets().subscribe( res => {
      let arr = []
      // Turn each json key into an array.
      var keys = Object.keys(res); // TODO make this a function?
      keys.forEach(function(key){
        let set = res[key]
        let obj: LovelessSet = {
            setId: set.id,
            count: set.count,
            ingredients: set.ingredients,
          }
        arr.push(obj)
      });
    this.loading = false;
    this.sets = arr;
    });

  }
  handleDashboardButton() {
    this.router.navigate(['/dashboard'])
  }
}

export interface LovelessSet {
  setId: number; // The id of the set in the database for when we create the recipe with this set.
  ingredients: Ingredient[];
  count: number; // The number of times the set has been searched.
}
// Lets have an array of