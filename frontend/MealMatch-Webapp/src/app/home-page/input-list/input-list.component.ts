import { Component, OnInit } from '@angular/core';
import { IngredientService } from 'src/app/services/ingredient.service';
import { Ingredient } from 'src/app/models/ingredient';

@Component({
  selector: 'app-input-list',
  styleUrls: ['./input-list.component.scss'],
  template: `
                <mat-card id="my-ingredients-section">
                  <h2 style="font-weight: lighter; font-size: 2.5vw; margin-top: 2vh; margin-left: 2vw; margin-bottom:5%;">My Ingredients List</h2>
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

                    <button id="removeAllButton" (click)="removeAllFromList()" mat-raised-button type="raised" color="primary" style="border-radius: 15px; width: 40%; margin-left: 30%; margin-top: 2vh; margin-bottom: 1.5vh">Clear All Ingredients</button>

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
