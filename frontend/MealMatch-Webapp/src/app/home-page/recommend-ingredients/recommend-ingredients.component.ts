import { Component, OnInit } from '@angular/core';
import { IngredientService } from 'src/app/services/ingredient.service';
import { Ingredient } from 'src/app/models/ingredient';

@Component({
  selector: 'app-recommend-ingredients',
  styleUrls: ['./recommend-ingredients.component.scss'],
  template: `
                <mat-card id="recommendedIngredientsSection">
                  <h2 style="font-weight: heavier">Do you also have:</h2>

                  <div *ngIf="getRecommendedIngredients().length <= 0; then thenBlock else elseBlock"> </div>
                  <ng-template #thenBlock> <p class="ingredient-text">No ingredient to recommend</p> </ng-template>
                  <ng-template #elseBlock>
                      <div *ngFor="let recIngredient of getRecommendedIngredients()">
                          <div class="ingredient-item">
                            <button class="add-button" (click)="addIngredient(recIngredient)"> <strong>+</strong></button>
                            {{recIngredient.name}} 
                          </div>
                      </div> 
                  </ng-template>
                </mat-card>
            `
})
export class RecommendIngredientsComponent implements OnInit {

  constructor(
    private ingredientService: IngredientService
  ) { }

  ngOnInit(): void {
  }

  getRecommendedIngredients(): Ingredient[] {
    return this.ingredientService.getRecommendedIngredients();
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredientService.addToList(ingredient.id);
  }

}
