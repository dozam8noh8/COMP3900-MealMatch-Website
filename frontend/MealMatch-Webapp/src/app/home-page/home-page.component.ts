import { Component, OnInit } from '@angular/core';
import { IngredientService } from '../services/ingredient.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchService } from '../services/search.service';
import { MealType } from '../models/mealtype';
import { Ingredient } from '../models/ingredient';

@Component({
  selector: 'app-home-page',
  styleUrls: ['./home-page.component.scss'],
  template: `<div class="homepage-div">
              <mat-card id="search-section">


              <mat-form-field [formGroup]="ingredientSearchForm" class="mealtype" appearance="fill">
                  <mat-label>Meal Type</mat-label>
                  <mat-select
                  formControlName="selectedMealType">
                      <mat-option *ngFor="let mealtype of allMealTypes"
                      [value]="mealtype">
                          {{mealtype.name}}
                      </mat-option>
                  </mat-select>
                </mat-form-field>



                <h1> Search for ingredient </h1>
                <div class="search-bar-container">
                  <app-search-bar
                  [allItems]="getAllIngredients()"
                  [itemAsString]="ingredientAsString"
                  [additionalFiltering]="notOnList"
                  (selectedItemEmitter)="addToList($event)"></app-search-bar>
                </div>
              </mat-card>

              <div id="inputListAndRecommendations">
                <app-input-list> </app-input-list>
                <app-recommend-ingredients></app-recommend-ingredients>
              </div>

              <app-ingredient-by-category></app-ingredient-by-category>

              <form [formGroup]="ingredientSearchForm" (ngSubmit)="submitIngredients()">
                <div class="submit-button-container">
                  <button mat-raised-button type="submit" color="white" class="submitButton">Search for recipes</button>
                </div>
              </form>
                <button mat-raised-button routerLink="/lovelesssets" color="primary" class="submitButton"> Loveless Sets </button>
              </div>
            `
})
export class HomePageComponent implements OnInit {
  loading = true;
  allMealTypes: MealType[] = [];
  ingredientSearchForm: FormGroup;
  constructor(
    private router: Router,
    private ingredientService: IngredientService,
    private searchService: SearchService,
    private formBuilder: FormBuilder
    ) {
      this.ingredientSearchForm = this.formBuilder.group({
        selectedMealType: ''
      })
      // Populate in constructor so we can click back to the home page and not have to reload page.
      this.searchService.getAllMealTypes()
      .subscribe( (data: MealType[]) => {
        this.allMealTypes = data;
        // Set the selected mealtype to be 'All'
        this.ingredientSearchForm.setValue({
          selectedMealType: this.allMealTypes[0]
        })
        this.loading = false;
      })

  }

  ngOnInit(): void {

  }

  submitIngredients() {
    // If we click submit before the page has finished loading, we don't want to do anything
    if (this.loading){
      return;
    }
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

  // Simply returns the name of an ingredient
  // (Passed into app-search-bar because search bar needs to know how an object is represented as a string in order to match)
  ingredientAsString(ingredient: Ingredient): string {
    return ingredient?.name;
  }

  // Checks that an ingredient is not already selected
  // (Pass into app-search-bar so that search bar will also filter by this condition)
  notOnList(ingredient: Ingredient): boolean {
    return !ingredient.onList;
  }

  // Adds an ingredient to user's input list
  // (Passed into search-bar so it can be triggered on selection)
  addToList(ingredient: Ingredient) {
    this.ingredientService.addToList(ingredient.id);
  }

}
