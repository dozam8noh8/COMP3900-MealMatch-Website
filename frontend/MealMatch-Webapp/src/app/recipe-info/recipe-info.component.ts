import { Component, OnInit } from '@angular/core';

import { RecipeService } from '../services/recipe.service';
import {Recipe} from '../models/recipe';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-recipe-info',
  styleUrls: ['./recipe-info.component.scss'],
  template:  `
                <!-- Added this so when recipe isnt defined (when api request is loading ) we dont get an undefined error -->
                <div class="main-div">
                <ng-container *ngIf="recipe">

                <mat-card id="image-ingredients" style="flex-direction: column; border-radius: 2%; padding-top: 8vh; margin-bottom: 2vh;">
                    <mat-card-title style="font-weight:lighter; font-size: 3.5em; padding-top: 2vh; padding-bottom: 4vh;">{{recipe.name}}</mat-card-title>
                    <div>
                        <img src="{{recipe.image || recipePlaceholder}}" style="width: 40%; margin-left: 30%; border-radius: 5%;">
                    </div>

                    <div id="ingredients" style="display: flex; flex-direction: column; font-weight:lighter">
                        <div>
                            <h2 style="font-weight:lighter; font-size: 2em">Meal Type: </h2>
                            <p>{{ recipe.mealtypes[0].name}}</p>
                        </div>
                        <div>
                            <h2 style="font-weight:lighter; font-size: 2em">Ingredients needed: </h2>
                            <ul style="display: inline-block;">
                                <div *ngFor="let ingredient of recipe.ingredients">
                                    <li>{{ingredient["ingredient.name"]}}: {{ingredient["quantity"]}}</li>
                                </div>
                            </ul>
                        </div>
                        <div>
                            <h2 style="font-weight:lighter; font-size: 2em">Steps</h2>
                            <!-- <p [innerHTML]="recipe.instructions"></p> -->
                            {{recipe.instruction}}
                        </div>
                    </div>
                </mat-card>
                </ng-container>
                </div>
              `
})
export class RecipeInfoComponent implements OnInit {

  recipe: Recipe;
  recipePlaceholder = 'assets/images/recipe_placeholder.jpg';
  
  constructor(
    private recipeService: RecipeService, 
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe( params => {
      this.getRecipeDetails(Number(params.get('id')));
    });

  }

  getRecipeDetails(repId: number) {
    this.recipeService.getRecipeDetails(repId)
    .subscribe( (data: Recipe) => {
      this.recipe = data
    });
  }

}
