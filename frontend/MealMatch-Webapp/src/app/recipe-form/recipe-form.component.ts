import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Ingredient } from '../models/ingredient';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RecipeService } from '../services/recipe.service';
import { HttpClient } from '@angular/common/http';
import { ImageService } from '../image.service';
import { LovelessSet } from '../loveless-sets/loveless-sets.component';
import { Recipe } from '../models/recipe';
import { ActivatedRoute } from '@angular/router';
import { IngredientService } from '../services/ingredient.service';


@Component({
  selector: 'app-recipe-form',
  styleUrls: ['./recipe-form.component.scss'],
  template: `
              <form [formGroup]="recipeFormGroup" (ngSubmit)="saveRecipeDetails()">
                <h2>
                  Name of recipe: <input type="text" formControlName="recipeName"> </h2>

                <img *ngIf="recipeDetails.image" alt="user placeholder image" [src]="recipeDetails.image">

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

                <div *ngIf="!submitting">
                  <div *ngIf="!submissionComplete">
                    <button type="submit">Save</button>
                    <div *ngIf="completionErrorMessage">
                      {{completionErrorMessage}}
                    </div>
                  </div>

                <div *ngIf="submissionComplete">
                  {{completionSuccessMessage}} <br/>
                  <a routerLink="/dashboard">Back to Dashboard</a>
                </div>
              </div>
          </form>

`
})
export class RecipeFormComponent implements OnInit {
  // Optional recipeDetails to initialise recipe form with.
  @Input() recipeDetails: Recipe | undefined;

  // Generic form submission handling. Consider componentising (see form-submit.component)
  @Input() submitting: boolean;
  @Input() submissionComplete: boolean;
  @Input() completionSuccessMessage: string;
  @Input() completionErrorMessage: string;

  recipeFormGroup: FormGroup;

  allMealTypes: string[];

  recipeImage: File;

  // Contains an array of formGroup (name, id and quantity form controls)
  // Representing each slot to add ingredients.
  ingredientSlots: FormArray;

  @Output() buildRecipeEmitter = new EventEmitter<any>();
  recipeImagePath: any;
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


    // If we are using this component to edit a recipe, we need to set everything in the form.
    if (this.recipeDetails){
      console.log("RECIPE DETAILS")
      this.loadRecipeFromData(this.recipeDetails)
    }


    // Otherwise we are creating a recipe but we should listen for any routing from loveless set component.
    else {
      this.activatedRoute.queryParams.subscribe(res => {
        if (res?.contents) {
          this.loadRecipeFromData(JSON.parse(res.contents));
        }
      })
    }

    this.getAllMealTypes();
  }

  // Emit the completed recipe up to the parent component for submission!
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
      }),
      image: this.recipeImage || null
    }
    console.log("Emitting");
    this.buildRecipeEmitter.emit({
      recipe: new_recipe,
      image: this.recipeImage || undefined,
    });
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

      // Only patch value if we don't already have a mealtype
      if (!this.recipeFormGroup.controls.mealType.value){
        // Once the data comes in, any default values for form fields can be set
        this.recipeFormGroup.patchValue({
          mealType: this.allMealTypes[0]
      })
      }

    });
  }

  maintainRecipeImage(file: File){
    this.recipeImage = file;
  }

  loadRecipeFromData(recipe: Recipe) {
    // ID will be set to -1 if we need an ID from api.
    console.log(recipe);
    this.recipeFormGroup.get('recipeName').setValue(recipe.name);
    this.recipeFormGroup.get('mealType').setValue(recipe?.mealtypes[0].name); // TODO current broken unless edit recipe endpoint takes an id.
    this.recipeFormGroup.get('instructions').setValue(recipe?.instruction);

    recipe.ingredients.forEach(element => {
      // Nest a formgroup within the formArray that is in the main formgroup.
      let newSlot = this.createIngredientGroup(element);
      this.ingredientSlots.push(newSlot);
    });
    if (recipe.image) {
      this.recipeImagePath = recipe.image; // We will use this if there is already an image on the recipe.
    }
  }
  createIngredientGroup(ingredient?) {
    console.log("INGREDIENT IS ", ingredient)
    // TODO fix api calls to return just id rather than ingredient.id because this is disgusting.
    if (!ingredient.name){
      ingredient.name = ingredient["ingredient.name"]
    }
    if (!ingredient.id){
      ingredient.id = ingredient["ingredient.id"]
    }
    let ingredientSlotForm = this.fb.group({
      id: ingredient?.id || -1,
      name: ingredient?.name || "" ,
      quantity: ingredient?.quantity || "",
    })
    return ingredientSlotForm;
  }

  checkValidIngredients(){
    let allIngredientIds = this.ingredientService.getAllIngredients(true).map(ingredient => ingredient.id);
    // Remove controls that did not have valid ingredient ids.
    this.ingredientSlots.controls = this.ingredientSlots.controls.filter(control => {
      return allIngredientIds.includes(control.get('id').value)
    })
    // Get freshest set of ingredients.

  }

}
