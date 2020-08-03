import { Component, OnInit } from '@angular/core';
import { IngredientService } from 'src/app/services/ingredient.service';
import { Ingredient } from 'src/app/models/ingredient';

@Component({
  selector: 'app-input-list',
  styleUrls: ['./input-list.component.scss'],
  template: `
                <mat-card id="my-ingredients-section">
                  <h2 style="font-weight: lighter; font-size: 2.5vw; margin-top: 1vh; margin-left: 2vw; margin-bottom:3%;">My Ingredients List</h2>
                  <div id="ingredientsAndButton" style="margin-left: 2vw; margin-right: 2vw">

                    <div id="inputIngredients">
                      <div *ngIf="getAddedIngredients().length <= 0; then thenBlock else elseBlock"> </div>
                      <ng-template #thenBlock> <p class="ingredient-text" style="font-weight: lighter;">No ingredients selected</p> </ng-template>
                      <ng-template #elseBlock>
                          <div *ngFor="let ingredient of getAddedIngredients()">
                              <div class="user-list-item">
                                  {{ingredient.name}}
                                  <button class="remove-button" (click)="removeFromList(ingredient)"> <strong>x</strong></button>
                              </div>
                          </div>
                      </ng-template>
                    </div>

                    <button id="removeAllButton" (click)="removeAllFromList()" mat-raised-button type="raised" color="primary" >
                      Clear All Ingredients
                    </button>

                  </div>

                </mat-card>
            `
})
/* This component represents the "My ingredients list" card on the home page,
it uses the recipe service to keep track of which ingredients have been added via
recommendations or category selection or search bar. */
export class InputListComponent implements OnInit {

  constructor(
    private ingredientService: IngredientService
  ) { }

  ngOnInit(): void { }

  getAddedIngredients(): Ingredient[] {
    return this.ingredientService.getAddedIngredients();
  }

  removeFromList(ingredient: Ingredient) {
    this.ingredientService.removeFromList(ingredient)
  }

  removeAllFromList() {
    this.ingredientService.removeAllFromList()
  }

}
