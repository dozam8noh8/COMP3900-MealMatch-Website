import { Component, OnInit } from '@angular/core';
import { Recipe } from '../models/recipe';
import { RecipeService } from '../services/recipe.service';
import { IngredientService } from '../services/ingredient.service';
import { Ingredient } from '../models/ingredient';

@Component({
  selector: 'app-loveless-sets',
  styleUrls: ['./loveless-sets.component.scss'],
  template: `
    <h1  class="greeting-text"> These ingredients need some love! </h1>
    <div class="ingredient-set" *ngFor="let set of sets">
        <app-ingredient-set-display [set]="set"> </app-ingredient-set-display>
    </div>

  `,
})
export class LovelessSetsComponent implements OnInit {
  sets: LovelessSet[];
  constructor(private ingredientService: IngredientService) { }

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
    this.sets = arr;
    console.log(this.sets)
    });



  }

}

export interface LovelessSet {
  setId: number; // The id of the set in the database for when we create the recipe with this set.
  ingredients: Ingredient[];
  count: number; // The number of times the set has been searched.
}
// Lets have an array of