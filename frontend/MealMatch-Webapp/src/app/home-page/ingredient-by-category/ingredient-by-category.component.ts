import { Component, OnInit } from '@angular/core';
import { IngredientService } from '../../services/ingredient.service';
import { Ingredient } from 'src/app/models/ingredient';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-ingredient-by-category',
  styleUrls: ['./ingredient-by-category.component.scss'],
  template: `
              <mat-card style="margin: 0 auto; width: 75%; border-radius: 10px;">
                <h2 style="font-weight: lighter; font-size: 2.5vw; margin-top: 2vh; margin-left: 2vw; margin-bottom:5%;">Ingredients by Category</h2>
                <mat-tab-group >
                  <div *ngFor="let category of getAllCategories()">
                    <mat-tab label="{{category.name}}">
                      <ul class="columned">
                        <div *ngFor="let ingredient of category.ingredients">
                          <mat-checkbox 
                          [checked]="ingredient.onList"
                          (change)="addOrRemove(ingredient)"
                          color="primary"
                          style="margin-top: 30px; margin-right: 30px;">
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
      : this.ingredientService.addToList(ingredient.id);
  }

  getAllCategories(): Category[] {
    return this.ingredientService.getAllCategories();
  }

}
