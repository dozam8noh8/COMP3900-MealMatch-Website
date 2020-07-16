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
                <button type="button" mat-dialog-close="true">Cancel</button>
                <button> Create new ingredient</button>              
              </form>

              `
})
export class NewIngredientPopupComponent implements OnInit {

  newIngredientForm: FormGroup;

  constructor(private ingredientService: IngredientService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.newIngredientForm = new FormGroup({
      ingredientName: new FormControl(data.inputString),
      ingredientCategory: new FormControl()
    })
  }

  ngOnInit(): void {
  }
  
  getAllCategories() {
    return this.ingredientService.getAllCategories().map(cat => (cat.name));
  }

  createNewIngredient() {
    console.log(this.newIngredientForm.get('ingredientName').value)
    console.log(this.newIngredientForm.get('ingredientCategory').value)
    // Send to endpoint and handle error
  }

}


