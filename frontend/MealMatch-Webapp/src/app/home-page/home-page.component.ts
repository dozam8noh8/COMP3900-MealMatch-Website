import { Component, OnInit } from '@angular/core';
import { IngredientService } from '../services/ingredient.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchService } from '../services/search.service';

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
                  [(value)]="selectedMealType">
                      <mat-option *ngFor="let mealtype of getAllMealTypes()" 
                      [value]="mealtype">
                          {{mealtype}}
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

  ingredientSearchForm;
  selectedMealType: string;

  constructor(
    private router: Router, 
    private ingredientServce: IngredientService, 
    private searchService: SearchService
    ) {
      this.selectedMealType = searchService.allMealTypes[0];
      this.ingredientSearchForm = new FormGroup({});
  }

  ngOnInit(): void {
  }

  submitIngredients() {
    this.router.navigateByUrl('/search', {
      state: {
        searchIngredients: this.ingredientServce.getAddedIngredients().map(item => {return item.name}),
        mealType: this.selectedMealType
      }
    });
  }

  getAllMealTypes() {
    return this.searchService.allMealTypes;
  }

}
