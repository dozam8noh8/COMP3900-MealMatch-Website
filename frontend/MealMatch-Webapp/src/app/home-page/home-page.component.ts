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
  template: `
              <h2> Search for ingredient </h2>
              <app-search-bar
              [allItems]="getAllIngredients()"
              [itemAsString]="ingredientAsString"
              [additionalFiltering]="notOnList"
              (selectedItemEmitter)="addToList($event)"></app-search-bar>

              <div class="ingredientsAndButton">
                <button class="remove-all" (click)="ingredientService.removeAllFromList()" mat-raised-button type="raised" color="primary">Clear All Ingredients</button>
                <mat-card id="my-ingredients-section">
                  <h2>My Ingredients List</h2>
                  <div *ngIf="ingredientService.getAddedIngredients().length <= 0; then thenBlock else elseBlock"> </div>
                  <ng-template #thenBlock> <p class="ingredient-text">No ingredients selected</p> </ng-template>
                  <ng-template #elseBlock>
                      <div *ngFor="let ingredient of ingredientService.getAddedIngredients()">
                          <div class="user-list-item">
                              {{ingredient.name}} 
                              <button class="remove-button" (click)="ingredientService.removeFromList(ingredient)"> <strong>x</strong></button>
                          </div>
                      </div> 
                  </ng-template>
                </mat-card>
              </div>

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
    public ingredientService: IngredientService, 
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

  notOnList(ingredient: Ingredient): boolean {
    return !ingredient.onList;
  }

  addToList(ingredient: Ingredient) {
    this.ingredientService.addToList(ingredient);
  }

}
