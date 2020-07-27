import { Component, OnInit } from '@angular/core';
import { IngredientService } from '../services/ingredient.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchService } from '../services/search.service';
import { MealType } from '../models/mealtype';
import { Ingredient } from '../models/ingredient';

@Component({
  selector: 'app-home-page',
  styleUrls: ['./home-page.component.scss'],
  template: `<div class="homepage-div">
              <mat-card id="search-section" style="margin-top: 18px; width: 75vw; border-radius: 10px;">
                <h1 style="font-weight: lighter; font-size: 2.5vw;"> Search for ingredient </h1>
                <div style="width: 60%; margin-left:20%;">
                  <app-search-bar
                  [allItems]="getAllIngredients()"
                  [itemAsString]="ingredientAsString"
                  [additionalFiltering]="notOnList"
                  (selectedItemEmitter)="addToList($event)"></app-search-bar>
                </div>
              </mat-card>
              <br/>
              <br/>
              <div id="inputListAndRecommendations">
                <app-input-list> </app-input-list>
                <app-recommend-ingredients></app-recommend-ingredients>
              </div>
              <br/>
              <br/>
              <app-ingredient-by-category></app-ingredient-by-category>
              <br>
              <br>
              <form [formGroup]="ingredientSearchForm" (ngSubmit)="submitIngredients()">
                <div style="text-align: center; margin-bottom: 15vh;">
                  <button mat-raised-button type="submit" color="white" class=submitButton>Search for recipes</button>
                </div>

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
              </form>
              </div>
            `
})
export class HomePageComponent implements OnInit {

  allMealTypes: MealType[] = [];
  ingredientSearchForm;

  constructor(
    private router: Router, 
    private ingredientService: IngredientService, 
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
        searchIngredients: this.ingredientService.getAddedIngredients().map(item => {return item.name}),
        mealType: this.ingredientSearchForm.controls['selectedMealType'].value
      }
    });
  }

  getAllIngredients(): Ingredient[] {
    return this.ingredientService.getAllIngredients();
  }

  ingredientAsString(ingredient: Ingredient): string {
    return ingredient?.name;
  }

  // Pass this function into app-search-bar so that search-bar will also check that an ingredient has not already been inputted
  notOnList(ingredient: Ingredient): boolean {
    return !ingredient.onList;
  }

  addToList(ingredient: Ingredient) {
    this.ingredientService.addToList(ingredient);
  }

}
