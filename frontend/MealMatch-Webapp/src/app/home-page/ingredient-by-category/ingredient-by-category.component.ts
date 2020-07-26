import { Component, OnInit } from '@angular/core';
import { IngredientService } from '../../services/ingredient.service';
import { Ingredient } from 'src/app/models/ingredient';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-ingredient-by-category',
  styleUrls: ['./ingredient-by-category.component.scss'],
  template: `
              <mat-card style="margin: 0 auto; width: 75%;">
                <h2>Ingredients by Category</h2>
                <mat-tab-group >
                  <div *ngFor="let category of getAllCategories()">
                    <mat-tab label="{{category.name}}">
                      <ul class="columned">
                        <div *ngFor="let ingredient of category.ingredients">
                          <mat-checkbox 
                          [checked]="ingredient.onList"
                          (change)="addOrRemove(ingredient)">
                              {{ingredient.name}}
                          </mat-checkbox>                                
                        </div>
                      </ul>
                    </mat-tab>
                  </div>
                </mat-tab-group>    
              </mat-card>
            `
})
export class IngredientByCategoryComponent implements OnInit {

  constructor(
    private ingredientService: IngredientService
  ) { }

  ngOnInit(): void {
  }

  addOrRemove(ingredient: Ingredient) {
    ingredient.onList 
      ? this.ingredientService.removeFromList(ingredient)
      : this.ingredientService.addToList(ingredient);
  }

  getAllCategories(): Category[] {
    return this.ingredientService.getAllCategories();
  }

}
