import { Component, OnInit, Input, SimpleChanges, Inject } from '@angular/core';
import { RecipeService } from 'src/app/services/recipe.service';
import { FormGroup, FormControl } from '@angular/forms';
import { IngredientService } from 'src/app/services/ingredient.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-new-ingredient-popup',
  styleUrls: ['./new-ingredient-popup.component.scss'],
  template: `
                <h1> Adding a new ingredient </h1>
                <form [formGroup]="newIngredientForm" (ngSubmit)="createNewIngredient()">
                  Name of ingredient: <input type="text" formControlName="ingredientName"/>
                  <br/>
                  <select formControlName="ingredientCategory">
                    <option *ngFor="let category of getAllCategories()" [value]="category">
                      {{category}}
                    </option>
                  </select>

                  <br/>

                  <div *ngIf="!creatingIngredient && !creationSuccessful">   
                    <button type="button" mat-dialog-close="true">Cancel</button><button> Create new ingredient</button> 
                  </div>

                  <div *ngIf="creatingIngredient"> Adding your ingredient... </div>
                  
                  <div *ngIf="!creatingIngredient && creationSuccessful"> 
                    your ingredient has been created
                    <button type="button" mat-dialog-close="true">Back</button>
                  </div>
                               
                </form>  
              `
})
export class NewIngredientPopupComponent implements OnInit {

  newIngredientForm: FormGroup;
  creatingIngredient = false;
  creationSuccessful = false;
  // error

  constructor(private ingredientService: IngredientService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.newIngredientForm = new FormGroup({
      ingredientName: new FormControl(data.inputString),
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
    
    let ingredientName = this.newIngredientForm.get('ingredientName').value;
    let ingredientCategory = this.newIngredientForm.get('ingredientCategory').value
    this.ingredientService.createNewIngredient(ingredientName, ingredientCategory)
    .subscribe(
      data => {
        console.log(data);
        this.creatingIngredient = false;
        this.creationSuccessful = true;
        // Reload ingredientService to include latest ingredient
        this.ingredientService.getFromDB();
      },
      err => {
        this.creatingIngredient = false;
        this.creationSuccessful = false;
      }
    )
    // Send to endpoint and handle error
  }

}


