import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../models/ingredient';
import { FormGroup, FormControl } from '@angular/forms';

interface IngredientSlot {
  ingredient: Ingredient;
  quantity: String;
}

@Component({
  selector: 'app-create-recipe',
  styleUrls: ['./create-recipe.component.scss'],
  template: `
              <form [formGroup]="recipeFormGroup" (ngSubmit)="saveRecipeDetails()">
                <h2> 
                  Name of recipe: <input type="text" formControlName="recipeName"> </h2>
                <h2> Upload an image ... </h2>
                <h2> Mealtype </h2>
                <h2> Ingredients </h2>
                <div *ngFor="let slot of allSlots; let index=index; trackBy:trackIngredient">
                  <app-add-ingredient
                  [position]="index"
                  (updateIngredient)="updateSlotIngredient($event)"
                  (updateQuantity)="updateSlotQuantity($event)"
                  [addedIngredients]="slotsToIngredients()"> </app-add-ingredient>     
                </div>
                <button type="button" (click)="addSlot()">Add an ingredient</button>

                <h2> Instructions </h2>
                <textarea formControlName="instructions"></textarea>

                <br/> <button type="submit">Save</button>              
              </form>

              <br/> All ingredients used:
              <div *ngFor="let ing of allSlots">
                {{ing.ingredient?.name}}    
              </div>
            `
})
export class CreateRecipeComponent implements OnInit {

  recipeFormGroup: FormGroup;

  recipeName: string;
  //image
  mealtype: string;
  instructions: string;

  allSlots: IngredientSlot[] = [];
  addedIngredients: Ingredient[] = [];

  constructor() { 
    this.recipeFormGroup = new FormGroup({
      recipeName: new FormControl(),
      mealtype: new FormControl(),
      instructions: new FormControl()
    });
  }

  ngOnInit(): void {
  }

  saveRecipeDetails() {
    // Only keep slots with valid ingredients
    this.allSlots = this.allSlots.filter(item => (item.ingredient));
    // Format into JSON object
    const new_recipe = {
      name: this.recipeFormGroup.get('recipeName').value,
      instruction: this.recipeFormGroup.get('instructions').value,
      mealtype: this.recipeFormGroup.get('mealtype').value,
      // Convert slots to appropriate ingredient format
      ingredients: this.allSlots.map(slot => {
        return {name: slot.ingredient.name, quantity: slot.quantity}
      })
    }
    // Send to endpoint to create new recipe
  }

  addSlot() {
    this.allSlots.push( { ingredient: null, quantity: "" } )
  }

  updateSlotIngredient($event) {
    this.allSlots[$event.index] = {
      ingredient: $event.newIngredient,
      quantity: this.allSlots[$event.index].quantity
    }
  }

  updateSlotQuantity($event) {
    this.allSlots[$event.index] = {
      ingredient: this.allSlots[$event.index].ingredient,
      quantity: $event.newQuantity
    }
  }

  trackIngredient(index: any, item: any) {
    return index;
  }

  slotsToIngredients() {
    return this.allSlots.map(elem => elem.ingredient);
  }

}
