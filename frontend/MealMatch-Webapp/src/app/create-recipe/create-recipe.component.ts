import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../models/ingredient';
import { FormGroup, FormControl } from '@angular/forms';
import { RecipeService } from '../services/recipe.service';
import { HttpClient } from '@angular/common/http';
import { ImageService } from '../image.service';

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
                  <app-photo-upload (uploadEmitter)="maintainRecipeImage($event)"></app-photo-upload>
                <h2> Mealtype </h2>
                  <select formControlName="mealType">
                    <option *ngFor="let mealtype of allMealTypes" [value]="mealtype">
                      {{mealtype}}
                    </option>
                  </select>
                <h2> Ingredients </h2>
                  <div *ngFor="let slot of allSlots; let index=index; trackBy:trackIngredient">
                    <app-ingredient-slot
                    [position]="index"
                    (updateIngredient)="updateSlotIngredient($event)"
                    (updateQuantity)="updateSlotQuantity($event)"
                    (removeIngredient)="removeSlot($event)"
                    [addedIngredients]="slotsToIngredients()"> </app-ingredient-slot>  
                  </div>
                <button type="button" (click)="addSlot()">Add an ingredient</button>

                <h2> Instructions </h2>
                  <textarea formControlName="instructions"></textarea>

                <br/> 

                <div *ngIf="creatingRecipe"> Creating recipe... </div>

                <div *ngIf="!creatingRecipe">
                  <div *ngIf="!creationSuccessful"> 
                    <button type="submit">Save</button>
                    <div *ngIf="API_message"> 
                      {{API_message}} 
                    </div> 
                  </div>
                  
                  <div *ngIf="creationSuccessful"> 
                    Your recipe has been created <br/>
                    <a routerLink="/dashboard">Back to Dashboard</a>
                  </div>
                </div>

              </form>

              <br/> All ingredients used:
              <div *ngFor="let ing of allSlots">
                {{ing.ingredient?.name}}    
              </div>
            `
})
export class CreateRecipeComponent implements OnInit {

  recipeFormGroup: FormGroup = new FormGroup(
    { 
      recipeName: new FormControl(),
      mealType: new FormControl(),
      instructions: new FormControl()
    });

  allMealTypes: string[];

  recipeImage: File;

  allSlots: IngredientSlot[] = [];
  addedIngredients: Ingredient[] = [];

  API_message: string;
  creatingRecipe: boolean = false;
  creationSuccessful: boolean = false;

  constructor(
    private recipeService: RecipeService,
    private imageService: ImageService
    ) { }

  ngOnInit(): void {
    this.getAllMealTypes();
  }

  saveRecipeDetails() {
    // Only keep slots with valid ingredients
    this.allSlots = this.allSlots.filter(item => (item.ingredient));
    // Format into JSON object
    const new_recipe = {
      name: this.recipeFormGroup.get('recipeName').value,
      instruction: this.recipeFormGroup.get('instructions').value,
      mealType: this.recipeFormGroup.get('mealType').value,
      // Convert slots to appropriate ingredient format
      ingredients: this.allSlots.map(slot => {
        return {name: slot.ingredient.name, quantity: slot.quantity}
      })
    }

    this.creatingRecipe = true;
    // Send to endpoint to create new recipe
    this.recipeService.createRecipe(new_recipe)
    .subscribe(
      (creation_response: any) => {
        console.log(creation_response.recipe_id);

        if(!this.recipeImage) {
          this.creatingRecipe = false;
          this.API_message = creation_response.message;
          this.creationSuccessful = true;
        }

        if(this.recipeImage) {
          // Use recipe id to upload image
          this.imageService.uploadRecipeImage(creation_response.recipe_id, this.recipeImage)
          .subscribe(
            (upload_response: any) => {
              this.creatingRecipe = false;
              this.API_message = creation_response.message;
              this.creationSuccessful = true;
            },
            err => { 
              console.log(err);
            }
          )
        }

      },
      err => { 
        console.log(err);
      }
    )
  }

  addSlot() {
    this.allSlots.push( { ingredient: null, quantity: "" } )
  }

  removeSlot(index: number) {
    this.allSlots.splice(index, 1);
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

  getAllMealTypes() {
    this.recipeService.getAllMealTypes()
    .subscribe( (data: any[]) => {
      this.allMealTypes = data.map(elem => (elem.name));

      // Once the data comes in, any default values for form fields can be set
      this.recipeFormGroup = new FormGroup({
        recipeName: new FormControl(),
        mealType: new FormControl(this.allMealTypes[0]),
        instructions: new FormControl()
      });
    })
  }

  maintainRecipeImage(file: File){
    this.recipeImage = file;
  }

}
