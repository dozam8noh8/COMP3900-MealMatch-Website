import { Component, OnInit } from '@angular/core';
import { IngredientService } from '../services/ingredient.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchService } from '../services/search.service';
import { MealType } from '../models/mealtype';

@Component({
  selector: 'app-home-page',
  template: `
              <app-ingredient-search></app-ingredient-search>
              <br>
              <br>
              <app-ingredient-by-category></app-ingredient-by-category>
              <br>
              <br>
              <form [formGroup]="ingredientSearchForm" (ngSubmit)="submitIngredients()">

                <mat-form-field appearance="fill">
                  <mat-label>Meal Type</mat-label>
                  <mat-select
                  formControlName="selectedMealType">
                      <mat-option *ngFor="let mealtype of allMealTypes" 
                      [value]="mealtype">
                          {{mealtype.name}}
                      </mat-option>
                  </mat-select>
                </mat-form-field>

                <div style="text-align: center;">
                  <button mat-raised-button type="submit" color="primary" sytle="margin: 0 auto;">Search for recipes</button>
                </div>
              </form>
            `
})
export class HomePageComponent implements OnInit {

  allMealTypes: MealType[] = [];
  ingredientSearchForm;

  constructor(
    private router: Router, 
    private ingredientServce: IngredientService, 
    private searchService: SearchService,
    private formBuilder: FormBuilder
    ) {
      this.ingredientSearchForm = this.formBuilder.group({
        selectedMealType: ''
      })

      this.searchService.getAllMealTypes()
      .subscribe( (data: MealType[]) => {
        this.allMealTypes = data;
        // Set the selected mealtype to be 'All'
        this.ingredientSearchForm.setValue({
          selectedMealType: this.allMealTypes[0]
        })
      })


  }

  ngOnInit(): void {
  }

  submitIngredients() {
    this.router.navigateByUrl('/search', {
      state: {
        searchIngredients: this.ingredientServce.getAddedIngredients().map(item => {return item.name}),
        mealType: this.ingredientSearchForm.controls['selectedMealType'].value
      }
    });
  }

}
