import { Component, OnInit } from '@angular/core';
import { IngredientService } from 'src/app/services/ingredient.service';
import { Ingredient } from 'src/app/models/ingredient';

@Component({
  selector: 'app-recommend-ingredients',
  styleUrls: ['./recommend-ingredients.component.scss'],
  template: `
                <mat-card id="recommendedIngredientsSection">
                  <h2 style="font-weight: heavier">Do you also have:</h2>
                  <div *ngIf="recommendedIngredients.length <= 0; then thenBlock else elseBlock"> </div>
                  <ng-template #thenBlock> <p class="ingredient-text">No ingredient to recommend</p> </ng-template>
                  <ng-template #elseBlock>
                      <div *ngFor="let recIngredient of recommendedIngredients">
                          <div class="ingredient-item">
                            <button class="add-button" (click)="addIngredient(recIngredient)"> <strong>+</strong></button>
                            {{recIngredient.name}}
                          </div>
                      </div>
                  </ng-template>
                  <button mat-raised-button routerLink="/lovelesssets" color="primary" class="loveless-set"
                  matTooltip="Commonly searched sets of ingredients for which there are no recipes."> See Loveless Sets </button>
                </mat-card>
            `
})
export class RecommendIngredientsComponent implements OnInit {

  recommendedIngredients: Ingredient[];

  constructor(
    private ingredientService: IngredientService
  ) { }

  ngOnInit(): void {
    // Subscribe to get any changes to list of recommended ingredients
    this.ingredientService.getRecommendedIngredients()
    .subscribe( (data: Ingredient[]) => {
      this.recommendedIngredients = data;
    })
  }

  addIngredient(ingredient: Ingredient) {
    // Remove the ingredient from list of recommended currently stored
    this.recommendedIngredients = this.recommendedIngredients.filter( ing => (ing.id !== ingredient.id));

    // Add this ingredient to the list maintained in ingredientService
    // which inside will call the API to update list of recommended ingredients
    this.ingredientService.addToList(ingredient.id);
  }

}
