import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Ingredient } from '../models/ingredient';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe';
import { ActivatedRoute } from '@angular/router';
import { IngredientService } from '../services/ingredient.service';
import { map, startWith, debounceTime, retry } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-recipe-form',
  styleUrls: ['./recipe-form.component.scss'],
  template: `
  <div class="container">
    <form [formGroup]="recipeFormGroup" (ngSubmit)="saveRecipeDetails()">
        <div class="flex-container">
            <div class="photo-upload-container">
                <div #Image *ngIf="recipeDetails && recipeDetails.image; else noImage">
                    <h2 class="title"> Change recipe image ... </h2>
                    <app-photo-upload (uploadEmitter)="maintainRecipeImage($event)"
                        [existingImageURL]="recipeDetails.image">
                    </app-photo-upload>
                </div>
                <ng-template #noImage>
                    <h2 class="title"> Upload an image ... </h2>
                    <app-photo-upload (uploadEmitter)="maintainRecipeImage($event)"
                    existingImageURL="assets/images/recipe_placeholder.jpg">
                    </app-photo-upload>
                </ng-template>
            </div>
            <div class="form">
                <h2 class="title"> Recipe Name </h2>
                <mat-form-field class="inputFields form-field">
                    <input matInput type="text" placeholder="Recipe Name" formControlName="recipeName" required>
                    <mat-error>
                        Please give your recipe a title.
                    </mat-error>
                </mat-form-field>

                <h2 class="title"> Mealtype </h2>
                <mat-form-field appearance="fill" class="select form-field">
                    <mat-select formControlName="mealType">
                        <mat-option *ngFor="let mealtype of allMealTypes" [value]="mealtype">
                            {{mealtype}}
                        </mat-option>
                    </mat-select>
                    <mat-error>
                        Choose a mealtype
                    </mat-error>
                </mat-form-field>

                <h2 class="title"> Ingredients </h2>
                  <div cdkDropList *ngIf="ingredientSlots.controls.length > 0"
                    class="draggable-list"
                    (cdkDropListDropped)="dropIngredient($event)"
                  >
                <div cdkDrag class="draggable-box" *ngFor="let slot of ingredientSlots.controls; let index=index; trackBy:trackIndex">
                    <app-ingredient-slot
                    [formGroup]="slot"
                    [formArray]="ingredientSlots"
                    [position]="index"
                    (removeIngredient)="removeIngredientSlot($event)"
                    [addedIngredients]="addedIngredients$ | async"
                    [formSubmitted]="formInvalid">
                    </app-ingredient-slot>
                    <div matTooltip="Click here to drag" cdkDragHandle>
                    <mat-icon class="drag-handle">drag_handle</mat-icon>
                  </div>
                </div>
                  </div>


                <button mat-raised-button class="form-field" color="primary" type="button" (click)="addIngredientSlot()">Add an
                    ingredient</button>

                <h2 class="title"> Instructions </h2>
              <div cdkDropList *ngIf="instructionSlots.controls.length > 0" class="draggable-list" (cdkDropListDropped)="dropInstruction($event)">
                <div cdkDrag class="draggable-box" *ngFor="let slot of instructionSlots.controls; let index=index; trackBy:trackIndex">
                  <app-instruction-slot
                  [formGroup]="slot"
                  [position]="index"
                  (removeInstruction)="removeInstructionSlot($event)"
                  [formSubmitted]="formInvalid"></app-instruction-slot>
                  <div matTooltip="Click here to drag" cdkDragHandle>
                    <mat-icon class="drag-handle">drag_handle</mat-icon>
                  </div>
                </div>
              </div>
                <button mat-raised-button class="form-field" color="primary" type="button" (click)="addInstructionSlot()">Add a step</button>

                <br />

                <div *ngIf="!submitting">
                    <div *ngIf="!submissionComplete">
                        <button mat-raised-button style="width: 25%" color="primary" type="submit">Save</button>
                        <h2 *ngIf="completionErrorMessage">
                            {{completionErrorMessage}}
                        </h2>
                    </div>

                    <h2 *ngIf="submissionComplete">
                        {{completionSuccessMessage}} <br />
                        <button mat-raised-button color="primary" routerLink="/dashboard">Back to Dashboard</button>
                        <button mat-raised-button color="primary" style="margin: 1.5vw;"
                            [routerLink]="'/recipe/' + completedRecipeId ">View Recipe</button>
                    </h2>
                    <mat-error *ngIf="formInvalid "> {{ invalidMessage }}
                    </mat-error>
                </div>
            </div>
        </div>
    </form>
</div>
  `
})
/* The recipe form component is a reusable component for creating or editing the details of a recipe.
  to use for recipe editing, send in the recipe as the "recipeDetails" input. Otherwise all fields will
  be empty by default. */
export class RecipeFormComponent implements OnInit {
  // Optional recipeDetails to initialise recipe form with.
  @Input() recipeDetails: Recipe | undefined;

  // Generic form submission handling. Consider componentising (see form-submit.component)
  @Input() submitting: boolean;
  @Input() submissionComplete: boolean;
  @Input() completionSuccessMessage: string;
  @Input() completionErrorMessage: string;
  @Input() completedRecipeId: number;


  recipeFormGroup: FormGroup;

  allMealTypes: string[];

  recipeImage: File;
  existingImageURL: string;
  formInvalid: boolean = false;
  invalidMessage = '';
  // Contains an array of formGroup (name, id and quantity form controls)
  // Representing each slot to add ingredients.
  ingredientSlots: FormArray;
  instructionSlots: FormArray;

  addedIngredients$: Observable<Ingredient[]>;

  @Output() buildRecipeEmitter = new EventEmitter<any>();
  recipeImagePath: string;
  constructor(
    private recipeService: RecipeService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private ingredientService: IngredientService,
    ) {    }

  ngOnInit(): void {
    // Build formGroup
    this.ingredientSlots = this.fb.array([]); // Initialise ingredientSlots to be an empty array.
    this.instructionSlots = this.fb.array([]);
    this.recipeFormGroup = this.fb.group({
      recipeName: ["", Validators.required],
      mealType: ["", Validators.required], //need to fix this
      ingredientSlots: this.ingredientSlots, // Nest form array inside formGroup to keep everything together :)
      instructionSlots: this.instructionSlots,
    })


    // If we are using this component to edit a recipe, we need to set everything in the form.
    if (this.recipeDetails){
      this.loadRecipeFromData(this.recipeDetails)
      // This recipe may have an image so get that
      this.recipeService.getRecipeDetails(this.recipeDetails.id)
      .subscribe( (response: Recipe) => {
        this.existingImageURL = response?.image;
      })
    }


    // We can be redirected here from selecting the loveless set option, we need to prepopulate with
    // the information sent from there.
    else {
      this.activatedRoute.queryParams.subscribe(res => {
        if (res?.contents) {
          this.loadRecipeFromData(JSON.parse(res.contents));
        }
      })
    }
    this.addedIngredients$ = this.ingredientSlots.valueChanges.pipe(debounceTime(1000), startWith([]),map(x => {
      let ingredients = this.slotsToIngredients();
      return ingredients;
    }), );
    this.getAllMealTypes();
  }

  // Emit the completed recipe up to the parent component for submission!
  saveRecipeDetails() {
    // Only keep slots with valid ingredients
    if (!this.recipeFormGroup.valid){
      this.formInvalid = true;
      this.invalidMessage = "Please make sure all fields of the form are filled out."
      return;
    }
    // If there is no ingredients in the recipe, we are invalid.
    if (!this.checkValidIngredients()){
      this.formInvalid = true;
      this.invalidMessage = "You must add at least one ingredient to the recipe"

      return;
    }

    if(this.instructionSlots.length < 1) {
      this.formInvalid = true;
      this.invalidMessage = "You must have one step in instructions";
      return
    }
    this.formInvalid = false;


    // Format into JSON object
    const new_recipe = {
      name: this.recipeFormGroup.get('recipeName').value,
      mealType: this.recipeFormGroup.get('mealType').value,
      // Convert slots to appropriate ingredient format
      ingredients: this.ingredientSlots.controls.map(slot => {
        return {name: slot.get('name').value, quantity: slot.get('quantity').value}
      }),
      instruction: this.instructionSlots.controls.map( slot => slot.get('instruction_text').value ), // Map instructionSlots to list of strings
      image: this.recipeImage || null
    }


    // Emit the created object to parent that will make the api call.
    this.buildRecipeEmitter.emit({
      recipe: new_recipe,
      image: this.recipeImage || undefined,
    });
  }

  addIngredientSlot() {
    // Add a slot to the formArray
    // Nest a formgroup within the formArray that is in the main formgroup.
    let newSlot = this.createIngredientGroup()
    this.ingredientSlots.push(newSlot);
  }

  addInstructionSlot() {
    let newSlot = this.createInstructionGroup();
    this.instructionSlots.push(newSlot);
  }

  removeIngredientSlot(index: number) {
    this.ingredientSlots.controls.splice(index, 1);
  }

  removeInstructionSlot(index: number) {
    this.instructionSlots.controls.splice(index, 1);
  }

  trackIndex(index: any, item: any) {
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
      if (!this.recipeFormGroup.get('mealType').value){
        // Once the data comes in, any default values for form fields can be set
        this.recipeFormGroup.patchValue({
          mealType: this.allMealTypes[0]
        })
      }
      else{
        console.log(this.recipeFormGroup.get('mealType').value)
      }

    });
  }

  maintainRecipeImage(file: File){
    this.recipeImage = file;
  }

  loadRecipeFromData(recipe: Recipe) {
    // ID will be set to -1 if we need an ID from api.
    this.recipeFormGroup.get('recipeName').setValue(recipe.name);
    this.recipeFormGroup.get('mealType').setValue(recipe.mealtypes?.[0]?.name); // TODO current broken unless edit recipe endpoint takes an id.

    recipe.ingredients.forEach(element => {
      // Nest a formgroup within the formArray that is in the main formgroup.
      let newSlot = this.createIngredientGroup(element);
      this.ingredientSlots.push(newSlot);
    });

    recipe.instruction.forEach( instr => {
      let newSlot = this.createInstructionGroup(instr);
      this.instructionSlots.push(newSlot);
    })

    if (recipe.image) {
      this.recipeImagePath = recipe.image; // We will use this if there is already an image on the recipe.
    }
  }

  createInstructionGroup(step?) {
    let instructionSlotForm = this.fb.group({
      instruction_text: [step || '', {validators: Validators.required}]
    });
    return instructionSlotForm;
  }

  createIngredientGroup(ingredient?) {
    // TODO fix api calls to return just id rather than ingredient.id because this is disgusting.
    if (ingredient && !ingredient.name){
      ingredient.name = ingredient["ingredient.name"]
    }
    if (ingredient && !ingredient?.id){
      ingredient.id = ingredient["ingredient.id"]
    }
    let ingredientSlotForm = this.fb.group({
      id: ingredient?.id || -1,
      name: ingredient?.name || "" ,
      quantity: [ingredient?.quantity || "", {validators: Validators.required}],
    })
    // Lock the ingredient in if it is already a valid ingredient.
    if (ingredient?.name){
      // For styling
      ingredientSlotForm.get('name').markAsDirty();
      ingredientSlotForm.get('name').clearValidators();
      ingredientSlotForm.get('name').markAsTouched();
      ingredientSlotForm.get('name').disable();


    }
    return ingredientSlotForm;
  }

  checkValidIngredients(){
    let allIngredientNames = this.ingredientService.getAllIngredients(true).map(ingredient => ingredient.name);
    // Remove controls that did not have valid ingredient names.
    this.ingredientSlots.controls = this.ingredientSlots.controls.filter(control => {
      return allIngredientNames.includes(control.get('name').value)
    })
    if (this.ingredientSlots.controls.length < 1){
      return false;
    }
    return true;
  }

  // On drop, change the order of the list
  dropInstruction(event: CdkDragDrop<FormGroup[]>) {
    moveItemInArray(this.instructionSlots.controls, event.previousIndex, event.currentIndex);
  }

  dropIngredient(event: CdkDragDrop<FormGroup[]>) {
    moveItemInArray(this.ingredientSlots.controls, event.previousIndex, event.currentIndex);
  }

}

