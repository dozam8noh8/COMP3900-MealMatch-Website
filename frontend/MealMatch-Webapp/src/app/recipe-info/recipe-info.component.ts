import { Component, OnInit } from '@angular/core';

import { RecipeService } from '../services/recipe.service';
import {Recipe} from '../models/recipe';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-recipe-info',
  styleUrls: ['./recipe-info.component.scss'],
  template:  `
                <!-- Added this so when recipe isnt defined (when api request is loading ) we dont get an undefined error -->
                <div class="main-div">
                <ng-container *ngIf="recipe">

                <mat-card id="image-ingredients">
                    <mat-card-title>
                      {{recipe.name}}
                      <!-- If the recipe belongs to the user, allow them to edit it -->
                      <span *ngIf="currentUserId && currentUserId===recipe.user.id" id="edit-button">
                        <button mat-raised-button color="primary" [routerLink]="'/edit/'+recipe.id">Edit</button>
                      </span>
                    </mat-card-title>
                    <div class="rating-contributor-container">
                    <div class="contributor"> <b> Contributed by: </b> {{recipe.user.username}} </div>
                    <div class="rating-container">
                        <ng-container *ngIf="recipe.rating_count <= 0">
                          There are no ratings yet
                        </ng-container>
                        <ng-container *ngIf="recipe.rating_count > 0">
                          <ngb-rating
                          [(rate)]="recipe.rating"
                          [max]="5"
                          [readonly]="true">
                            <ng-template let-fill="fill" let-index="index">
                            <span class="star" [class.full]="fill === 100">
                              <span class="half" [style.width.%]="fill">&#9733;</span>&#9733;
                            </span>
                            </ng-template>
                          </ngb-rating>
                          <b> {{recipe.rating.toFixed(1)}} </b>
                          <span *ngIf="recipe.rating_count === 1"> ({{recipe.rating_count}} rating) </span>
                          <span *ngIf="recipe.rating_count > 1"> ({{recipe.rating_count}} ratings) </span>
                        </ng-container>
                    </div>
                    </div>

                    <div class="image-container">
                        <img mat-card-image src="{{recipe.image || recipePlaceholder}}">
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
                            <ol style="display: inline-block;">
                              <div *ngFor="let step of recipe.instruction">
                                <li>{{step}}</li>
                              </div>
                            </ol>
                        </div>
                    </div>
                  <app-review-section style="width: 90%"
                  [recipeId]="recipe.id"
                  [recipeOwnerId]="recipe.user.id"
                  (reloadEmitter)="getRecipeDetails($event)"></app-review-section>
                </mat-card>
                </ng-container>
                </div>
              `
})
export class RecipeInfoComponent implements OnInit {

  recipe: Recipe;
  recipePlaceholder = 'assets/images/recipe_placeholder.jpg';
  currentUserId: number;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentUserId = this.authService.getLoggedInUserId();
    this.route.paramMap.subscribe( params => {
      let recipeId = params.get('id');
      // If parameter 'id' is not a number
      if (!recipeId || isNaN(+recipeId)) {
        this.router.navigate(['/notfound']);
        return;
      }
      this.getRecipeDetails(Number(recipeId));

    });

  }

  getRecipeDetails(repId: number) {
    this.recipeService.getRecipeDetails(repId)
    .subscribe( (data: Recipe) => {

      if( Object.keys(data).length === 0 ) { // If data is empty, because API returned nothing with repId
        this.router.navigate(['/notfound']);
      } else {
        this.recipe = data;
      }

    },
    (error) => {
      this.router.navigate(['/notfound']);
      // or could inform user that recipe with such id does not exist
    });
  }

}
