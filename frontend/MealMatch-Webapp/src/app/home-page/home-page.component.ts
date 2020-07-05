import { Component, OnInit } from '@angular/core';
import { IngredientService } from '../services/ingredient.service';
import { RecipeService } from '../services/recipe.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  template: `
              <div *ngIf="didComplete(); then thenComplete else elseIncomplete"> </div>
              <ng-template #thenComplete> 

                <div *ngIf="wasSuccessful(); then thenSuccessful else elseUnsuccessful"> </div>

                <ng-template #thenSuccessful>
                  <app-ingredient-search></app-ingredient-search>
                  <br>
                  <br>
                  <app-ingredient-by-category></app-ingredient-by-category>
                  <br>
                  <form [formGroup]="ingredientSearchForm" (ngSubmit)="submitIngredients()">
                    <div style="text-align: center;">
                      <button mat-raised-button type="submit" color="primary" sytle="margin: 0 auto;">Search for recipes</button>
                    </div>
                  </form>
                </ng-template>

                <ng-template #elseUnsuccessful>
                  {{ getError().status }}
                  {{ getError().message }}
                </ng-template>  

              </ng-template>

              <ng-template #elseIncomplete>
                Getting ingredients...
              </ng-template>

            `
})
export class HomePageComponent implements OnInit {

  ingredientSearchForm;

  constructor(private router: Router, private ingredientServce: IngredientService, private recipeService: RecipeService) {
    this.ingredientSearchForm = new FormGroup({});
  }

  ngOnInit(): void {
  }

  submitIngredients() {
    this.router.navigateByUrl('/search', {
      state: {
        searchIngredients: this.ingredientServce.getAddedIngredients().map(item => {return item.name})
      }
    });
  }

  didComplete() {
    return this.ingredientServce.requestComplete;
  }

  wasSuccessful() {
    return this.ingredientServce.requestSuccessful;
  }

  getError() {
    return this.ingredientServce.error;
  }

}
