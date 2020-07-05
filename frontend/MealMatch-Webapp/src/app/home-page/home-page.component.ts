import { Component, OnInit } from '@angular/core';
import { IngredientService } from '../services/ingredient.service';
import { RecipeService } from '../services/recipe.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  template: `
                  <app-ingredient-search
                  ></app-ingredient-search>
                  <br>
                  <br>
                  <app-ingredient-by-category
                  ></app-ingredient-by-category>
                  <br>
                  <form [formGroup]="ingredientSearchForm" (ngSubmit)="submitIngredients()">
                    <div style="text-align: center;">
                      <button mat-raised-button type="submit" color="primary" style="margin: 0 auto;">Search for recipes</button>
                    </div>
                  </form>


            `
})
export class HomePageComponent implements OnInit {

  ingredientSearchForm: FormGroup;

  constructor(private router: Router, private ingredientService: IngredientService, private recipeService: RecipeService) {
    this.ingredientSearchForm = new FormGroup({});
  }

  ngOnInit(): void {
  }

  submitIngredients() {
    this.router.navigateByUrl('/search', {
      state: {
        searchIngredients: this.ingredientService.getAddedIngredients().map(item => {return item.name})
      }
    });
  }

  isRequestLoading() {
    return this.ingredientService.requestLoading;
  }

  wasSuccessful() {
    return this.ingredientService.requestSuccessful;
  }

  getError() {
    return this.ingredientService.error;
  }

}
