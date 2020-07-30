import { Component, OnInit, Input, SimpleChanges, Inject, Output, EventEmitter } from '@angular/core';
import { RecipeService } from 'src/app/services/recipe.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IngredientService } from 'src/app/services/ingredient.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Ingredient } from 'src/app/models/ingredient';

@Component({
  selector: 'app-new-ingredient-popup',
  styleUrls: ['./new-ingredient-popup.component.scss'],
  template: `
              <mat-card>
                <h1> Adding a new ingredient </h1>
                <form [formGroup]="newIngredientForm" (ngSubmit)="createNewIngredient()">
                  <mat-form-field appearance="fill">
                    <mat-label> Name of ingredient </mat-label>
                    <input matInput type="text" formControlName="ingredientName" required>
                  </mat-form-field>

                  <br/>

                  <mat-form-field>
                    <mat-label>Ingredient Category</mat-label>
                    <mat-select formControlName="ingredientCategory">
                      <mat-option *ngFor="let category of getAllCategories()" [value]="category">
                        {{category}}
                      </mat-option>
                    </mat-select>                  
                  </mat-form-field>

                  <br/>

                  <div *ngIf="!creatingIngredient && !creationSuccessful">
                    <button mat-dialog-close="true" mat-raised-button color="warn">Cancel</button>
                    <button type="submit" mat-raised-button color="primary"> Create new ingredient</button>
                  </div>

                  <ng-container *ngIf="invalidMessage">
                    {{invalidMessage}}
                  </ng-container>

                  <div *ngIf="creatingIngredient"> Adding your ingredient... </div>

                  <div *ngIf="!creatingIngredient && creationSuccessful">
                    Your ingredient has been created
                    <button type="button" mat-dialog-close="true" mat-raised-button color="primary">Back</button>
                  </div>

                </form>
              </mat-card>
            `
})
export class NewIngredientPopupComponent implements OnInit {

  newIngredientForm: FormGroup;
  creatingIngredient = false;
  creationSuccessful = false;
  invalidMessage: string;
  // Allows an ingredient to be sent to parent (used upon successful creation)
  emitIngredient = new EventEmitter<Ingredient>();

  @Output() handleNew = new EventEmitter<Ingredient>();

  constructor(
    private ingredientService: IngredientService,
    public dialogRef: MatDialogRef<NewIngredientPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    this.newIngredientForm = new FormGroup({
      ingredientName: new FormControl(data.inputString, [Validators.required]),
      ingredientCategory: new FormControl(ingredientService.allCategories[0].name)
    })
  }

  ngOnInit(): void {
  }

  getAllCategories() {
    return this.ingredientService.getAllCategories().map(cat => (cat.name));
  }

  createNewIngredient() {
    this.creatingIngredient = true;

    // Check that all fields are valid
    if (!this.newIngredientForm.valid){
      this.creatingIngredient = false;
      this.invalidMessage = "Please fill in all fields"
      return;
    }
    
    let nameValue = this.ingredientName.value;
    let categoryValue = this.ingredientCategory.value;
    this.ingredientService.createNewIngredient(nameValue, categoryValue)
    .subscribe(
      (creation_response : any) => {
        this.creatingIngredient = false;
        this.creationSuccessful = true;
        // Add the new ingredient with the id returned from the response to the frontend.
        let newIngredient: Ingredient = {
          id: creation_response.id,
          name: nameValue,
          onList: false,
          category: categoryValue
        }
        // Send this newly created ingredient to the parent component (so that it can be added)
        this.emitIngredient.emit(newIngredient);
      },
      err => {
        this.creatingIngredient = false;
        this.creationSuccessful = false;
      }
    );
  }

  get ingredientName() { return this.newIngredientForm.get('ingredientName') }
  get ingredientCategory() { return this.newIngredientForm.get('ingredientCategory') }
}

