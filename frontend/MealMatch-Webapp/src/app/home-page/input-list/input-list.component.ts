import { Component, OnInit } from '@angular/core';
import { IngredientService } from 'src/app/services/ingredient.service';
import { Ingredient } from 'src/app/models/ingredient';

@Component({
  selector: 'app-input-list',
  styleUrls: ['./input-list.component.scss'],
  template: `
                <mat-card id="my-ingredients-section">
                  <h2>My Ingredients List</h2>
                  <div id="ingredientsAndButton">

                    <div id="inputIngredients">
                      <div *ngIf="getAddedIngredients().length <= 0; then thenBlock else elseBlock"> </div>
                      <ng-template #thenBlock> <p class="ingredient-text">No ingredients selected</p> </ng-template>
                      <ng-template #elseBlock>
                          <div *ngFor="let ingredient of getAddedIngredients()">
                              <div class="user-list-item">
                                  {{ingredient.name}} 
                                  <button class="remove-button" (click)="removeFromList(ingredient)"> <strong>x</strong></button>
                              </div>
                          </div> 
                      </ng-template>
                    </div>

                    <button id="removeAllButton" (click)="removeAllFromList()" mat-raised-button type="raised" color="primary">Clear All Ingredients</button>

                  </div>

                </mat-card>
            `
})
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
