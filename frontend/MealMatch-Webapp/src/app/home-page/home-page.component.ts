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
  template: `
            <div *ngIf="loading" class="page-loading" style="height: 100%;">
              <mat-spinner  style="margin:auto; top: 40%"> </mat-spinner>
              <h1 *ngIf="loading"> Loading webpage... </h1>
            </div>

            <div *ngIf="!loading" class="homepage-div">
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
                <form [formGroup]="ingredientSearchForm" (ngSubmit)="submitIngredients()">
                  <button mat-raised-button type="submit" color="primary" class="submitButton">Search for recipes</button>
                </form>

              </mat-card>

              <div id="inputListAndRecommendations">
                <app-input-list> </app-input-list>
                <app-recommend-ingredients></app-recommend-ingredients>
              </div>

              <app-ingredient-by-category></app-ingredient-by-category>
              </div>
            `
})
/* The home page component displays the view for the home page,
it has several sub components that mostly use the ingredient service
and search service to interact with each other. */
export class HomePageComponent implements OnInit {
  // loading state of page
  loading = true;
  // The mealtypes displayed in the dropdown
  allMealTypes: MealType[] = [];
  // The form group containing all the information required to search
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
        console.log("just about to finish loading")
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
