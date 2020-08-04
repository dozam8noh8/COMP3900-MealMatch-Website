import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../services/search.service';
import { MealType } from '../models/mealtype';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-search-results',
  styleUrls: ['./search-results.component.scss'],
  template: `
              <form [formGroup]="formForMealType">
              <mat-form-field appearance="fill" style="margin-left: 2%; margin-top: 2%;">
                  <mat-label>Meal Type</mat-label>
                  <mat-select
                  matNativeControl
                  formControlName="selectedMealType"
                  (selectionChange)="updateSearchMealType($event.value)">
                      <mat-option *ngFor="let mealtype of allMealTypes"
                      [value]="mealtype">
                          {{mealtype}}
                      </mat-option>
                  </mat-select>
              </mat-form-field>
              <div layout="row" layout-fill layout-align="center center">
                  <mat-spinner *ngIf=!searchComplete() style="margin-left: 45%; margin-top: 15%;"> Showing spinner </mat-spinner>
              </div>

              <div *ngIf="searchComplete() && getResults().length > 0">
                  <div class="columned" style="margin-left: 2%;">
                      <div *ngFor="let recipe of getResults()">
                              <app-recipe-view-card [recipe]="recipe"></app-recipe-view-card>
                      </div>
                  </div>
                  <mat-paginator *ngIf="getResults().length > 0"
                  [length]="getResults().length"
                  [pageSize]="itemsPerPage"
                  [pageIndex]="displayedPage-1"
                  [pageSizeOptions]="[10, 20]"
                  (page)="handlePaginator($event)"
                  >
                  </mat-paginator>
              </div>

              <div layout="row" layout-fill layout-align="center center">
                  <div *ngIf="searchComplete() && getResults().length === 0" style="margin-left: 35%; margin-top: 10%">
                      <h1 style="font-weight: heavier; font-size: 3em" class="copperplate">We're Sorry</h1>
                      <h1 style="font-weight: lighter; font-size: 1.5em" class="copperplate">We can't seem to find any
                          <span *ngIf="getSelectedMealType() !== 'All'"> "{{getSelectedMealType()}}" </span>
                              recipes with just:
                      </h1>
                      <ul *ngFor="let ingredient of getSearchedIngredients()">
                          <li class="copperplate">{{ingredient}}</li>
                      </ul>
                      <button mat-raised-button color="primary" class="copperplate submitButton" routerLink="/home">Search for new recipes</button>
                  </div>
              </div>
              </form>
            `
})
export class SearchResultsComponent implements OnInit {

  formForMealType: FormGroup;
  allMealTypes: string[];

  // The page number of the current page of recipes being displayed.
  displayedPage = 1;

  // The number of items displayed per paginated page
  itemsPerPage: 10;

  constructor(
    private router: Router,
    private searchService: SearchService,
    private formBuilder: FormBuilder,
  ) {
    this.formForMealType = this.formBuilder.group({
      selectedMealType: ''
    });

    if(!this.router.navigated) { // If the user is manually typing in /search
      this.router.navigate(['/home']);
    }
    else { // The user is accessing this page by navigation i.e. search or pressing back

      let searchState = this.router.getCurrentNavigation().extras.state;
      if(searchState) { // If a list of ingredients was passed from search (home page)
        this.updateSearchMealType(searchState.mealType.name);
        this.searchService.searchForRecipes(searchState.searchIngredients, searchState.mealType.name);
      }
      else { // The user navigated to page by e.g. back button
        this.updateSearchMealType(searchService.getMealType());
      }

      this.searchService.getAllMealTypes()
      .subscribe( (data: MealType[]) => {
        // Get the meal types as strings
        this.allMealTypes = data.map(mtype => mtype.name);

      });
    }
  }

  ngOnInit(): void {

  }

  // Updates the meal type in the form and searchService
  updateSearchMealType(newMealType: string) {
    this.formForMealType.setValue({
      selectedMealType: newMealType
    });
    this.searchService.setMealType(newMealType);
  }

  // Gets the selected meal type from the form field
  getSelectedMealType(): string {
    return this.formForMealType.get('selectedMealType').value;
  }

  getResults() {

    if(!this.getSelectedMealType() || this.getSelectedMealType()==="All") {
      return this.searchService.getAllResults().recipes;
    } else {
      // Get the recipes that have the selected meal type as one of its meal types
      return this.searchService.getAllResults().recipes.filter(recipe => {
        return recipe.mealtypes.some( elem => (elem.name === this.getSelectedMealType()) );
      })
    }

  }

  getSearchedIngredients() {
    return this.searchService.inputIngredients;
  }

  searchComplete() {
    return this.searchService.searchComplete;
  }
  // When paginator changes, make a call for the next page (with the same search state).
  handlePaginator($event){
    let state = this.router.getCurrentNavigation().extras.state;
    this.searchService.searchForRecipes(state.searchIngredients, state.mealType.name, this.displayedPage, this.itemsPerPage)
  }
}
