import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../models/ingredient';

interface IngredientSlot {
  ingredient: Ingredient;
  quantity: String;
}

@Component({
  selector: 'app-create-recipe',
  styleUrls: ['./create-recipe.component.scss'],
  template: `
              <div *ngFor="let slot of allSlots; let index=index; trackBy:trackIngredient">
                {{slot.ingredient}}
                {{slot.quantity}}
                <div *ngIf="allSlots[index].ingredient">
                  you ingredient is {{allSlots[index].ingredient.name}}
                </div>
                <app-add-ingredient
                [position]="index"
                (updateIngredient)="updateSlotIngredient($event)"
                (updateQuantity)="updateSlotQuantity($event)"
                (removeFromList)="removeValidIngredient($event)"
                [addedIngredients]="addedIngredients"> </app-add-ingredient>        
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

  allSlots: IngredientSlot[] = [];
  addedIngredients: Ingredient[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  addSlot() {
    this.allSlots.push( { ingredient: null, quantity: "" } )
  }

  updateSlotIngredient($event) {
    console.log($event)
    this.allSlots[$event.index] = {
      ingredient: $event.newIngredient,
      quantity: this.allSlots[$event.index].quantity
    }
    console.log(this.allSlots)
  }

  updateSlotQuantity($event) {
    this.allSlots[$event.index] = {
      ingredient: this.allSlots[$event.index].ingredient,
      quantity: $event.newQuantity
    }
    console.log(this.allSlots)
  }

  trackIngredient(index: any, item: any) {
    return index;
  }

  removeValidIngredient(ingredient: Ingredient) {
    this.addedIngredients = this.addedIngredients.filter( elem => (elem.id!==ingredient.id));
  }

}
