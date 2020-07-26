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
                  (selectionChange)="updateMealType($event.value)">
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
                      <div *ngFor="let recipe of getResults()" style="width: 400px">
                          <a routerLink="/recipe/{{recipe.id}}" style="text-decoration: none; margin-top: 2%;">
                              <app-recipe-view-card [recipe]="recipe"></app-recipe-view-card>
                          </a>
                      </div>
                  </div>    
              </div>

              <div layout="row" layout-fill layout-align="center center">
                  <div *ngIf="searchComplete() && getResults().length === 0" style="margin-left: 35%; margin-top: 10%">
                      <h1 style="font-weight: heavier; font-size: 3em" class="copperplate">We're Sorry</h1>
                      <h1 style="font-weight: lighter; font-size: 1.5em" class="copperplate">We can't seem to find any 
                          <span *ngIf="!selectedMealType || selectedMealType !== 'All'"> "{{selectedMealType}}" </span>
                              recipes with: 
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
  selectedMealType: string;
  allMealTypes: string[];

  constructor(
    private router: Router, 
    private searchService: SearchService,
    private formBuilder: FormBuilder
    ) {
      this.formForMealType = this.formBuilder.group({
        selectedMealType: ''
      });

    let searchState = this.router.getCurrentNavigation().extras.state;
    
    this.searchService.getAllMealTypes()
    .subscribe( (data: MealType[]) => {
      // Get the meal types as strings
      this.allMealTypes = data.map(mtype => mtype.name);

      // If a list of ingredients was passed from search (home page)
      if(searchState) {
        // Set the selected meal type as per the search
        this.selectedMealType = searchState.mealType.name;
        this.formForMealType.setValue({
          selectedMealType: searchState.mealType.name
        })
        this.searchService.searchForRecipes(searchState.searchIngredients);
      }
      else {
        // If there is no state a user cannot find anything with search
        this.router.navigate(['/home']);
      }
    })
  }

  ngOnInit(): void {
  }

  updateMealType(newMealType: string) {
    this.selectedMealType = newMealType;
  }

  getResults() {
    if(!this.selectedMealType || this.selectedMealType==="All") {
      return this.searchService.getAllResults();

    } else {
      // Get the recipes that have the selected meal type as one of its meal types
      return this.searchService.getAllResults().filter(recipe => {
        return recipe.mealtypes.some( elem => (elem.name === this.selectedMealType));
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
