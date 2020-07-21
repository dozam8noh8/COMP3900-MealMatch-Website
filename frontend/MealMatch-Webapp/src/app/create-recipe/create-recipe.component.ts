import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../models/ingredient';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RecipeService } from '../services/recipe.service';
import { HttpClient } from '@angular/common/http';
import { ImageService } from '../image.service';
import { LovelessSet } from '../loveless-sets/loveless-sets.component';
import { Recipe } from '../models/recipe';
import { ActivatedRoute } from '@angular/router';
import { IngredientService } from '../services/ingredient.service';

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
                  <div *ngFor="let slot of ingredientSlots.controls; let index=index; trackBy:trackIngredient">
                    <app-ingredient-slot
                    [formGroup]="slot"
                    [position]="index"
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

  recipeFormGroup: FormGroup;

  allMealTypes: string[];

  recipeImage: File;

  allSlots: IngredientSlot[] = [];

  API_message: string;
  creatingRecipe: boolean = false;
  creationSuccessful: boolean = false;
  ingredientSlots: FormArray;

  constructor(
    private recipeService: RecipeService,
    private imageService: ImageService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private ingredientService: IngredientService,
    ) {    }

  ngOnInit(): void {

    // Build formGroup
    this.ingredientSlots = this.fb.array([]); // Initialise ingredientSlots to be an empty array.
    this.recipeFormGroup = this.fb.group({
      recipeName: ["", Validators.required],
      mealType: [Validators.required], //need to fix this
      instructions: ["", Validators.required],
      ingredientSlots: this.ingredientSlots, // Nest form array inside formGroup to keep everything together :)
    })
    this.activatedRoute.queryParams.subscribe(res => {
      if (res?.contents) {
        this.loadRecipeFromRedirect(JSON.parse(res.contents));
      }
    })
    this.getAllMealTypes();
  }

  saveRecipeDetails() {
    // Only keep slots with valid ingredients

    this.checkValidIngredients()
    // Format into JSON object
    const new_recipe = {
      name: this.recipeFormGroup.get('recipeName').value,
      instruction: this.recipeFormGroup.get('instructions').value,
      mealType: this.recipeFormGroup.get('mealType').value,
      // Convert slots to appropriate ingredient format
      ingredients: this.ingredientSlots.controls.map(slot => {
        return {name: slot.get('name').value, quantity: slot.get('quantity').value}
      })
    }
    console.log(new_recipe)

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
    // Add a slot to the formArray
    // Nest a formgroup within the formArray that is in the main formgroup.
    let newSlot = this.createIngredientGroup()
    this.ingredientSlots.push(newSlot);
  }

  removeSlot(index: number) {
    this.ingredientSlots.controls.splice(index, 1);
  }

  trackIngredient(index: any, item: any) {
    return index;
  }

  // Make this an observable so we dont have to call the function 69 million times.
  slotsToIngredients() {
    return this.ingredientSlots.controls.map(control => {
      let ingredientName = control.get('name').value;
      let ingredientId = control.get('id').value;
      let ingredient: Ingredient = {
        name: ingredientName,
        id: ingredientId,
      }
      return ingredient;
    });
  }

  getAllMealTypes() {
    this.recipeService.getAllMealTypes()
    .subscribe( (data: any[]) => {
      this.allMealTypes = data.map(elem => (elem.name));

      // Once the data comes in, any default values for form fields can be set
      this.recipeFormGroup.patchValue({
        mealType: this.allMealTypes[0]
      })
    });
  }

  maintainRecipeImage(file: File){
    this.recipeImage = file;
  }

  loadRecipeFromRedirect(recipe: Recipe) {
    // ID will be set to -1 if we need an ID from api.
    console.log(recipe);
    this.recipeFormGroup.get('recipeName').setValue(recipe.name);
    this.recipeFormGroup.get('mealType').setValue(recipe?.mealtypes); // Will this be an array?
    this.recipeFormGroup.get('instructions').setValue(recipe?.instruction);

    recipe.ingredients.forEach(element => {
      // Nest a formgroup within the formArray that is in the main formgroup.
      let newSlot = this.createIngredientGroup(element);
      this.ingredientSlots.push(newSlot);
    });

  }
  createIngredientGroup(ingredient?: Ingredient) {
    let ingredientSlotForm = this.fb.group({
      id: ingredient?.id || -1,
      name: ingredient?.name || "",
      quantity: "",
    })
    return ingredientSlotForm;
  }

  checkValidIngredients(){
    let allIngredientIds = this.ingredientService.getAllIngredients(true).map(ingredient => ingredient.id);
    this.ingredientSlots.controls = this.ingredientSlots.controls.filter(control => {
      console.log("Id is ",control.get('id').value)
      return allIngredientIds.includes(control.get('id').value)
    })
    // Get freshest set of ingredients.

  }

}
