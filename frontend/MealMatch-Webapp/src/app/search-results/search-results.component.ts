import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../services/search.service';
import { MealType } from '../models/mealtype';
import { FormBuilder } from '@angular/forms';

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

              <ng-container *ngIf="searchComplete() && getResults().length > 0">
                  <ng-container class="columned" style="margin-left: 2%;">
                      <ng-container *ngFor="let recipe of getResults()">
                              <app-recipe-view-card [recipe]="recipe"></app-recipe-view-card>
                      </ng-container>
                  </ng-container>    
              </ng-container>

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

  formForMealType;
  allMealTypes: string[];

  constructor(
    private router: Router, 
    private searchService: SearchService,
    private formBuilder: FormBuilder
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
      return this.searchService.getAllResults();
    } else {
      // Get the recipes that have the selected meal type as one of its meal types
      return this.searchService.getAllResults().filter(recipe => {
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

}
