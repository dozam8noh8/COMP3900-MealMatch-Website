import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../models/ingredient';

@Component({
  selector: 'app-create-recipe',
  styleUrls: ['./create-recipe.component.scss'],
  template: `
              <div *ngFor="let slot of allSlots">
                <app-add-ingredient
                [addedIngredients]="addedIngredients"
                (removeFromList)="removeValidIngredient($event)"
                > </app-add-ingredient>        
              </div>
              <button
              (click)="addSlot()"

              >Add an ingredient</button>
              <div *ngFor="let ing of addedIngredients">
                {{ing.name}}       
              </div>
            `
})
export class CreateRecipeComponent implements OnInit {

  allSlots = [];
  addedIngredients: Ingredient[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  addSlot() {
    this.allSlots.push("dfs")
  }

  removeValidIngredient(ingredient: Ingredient) {
    this.addedIngredients = this.addedIngredients.filter( elem => (elem.id!==ingredient.id));
  }

}
