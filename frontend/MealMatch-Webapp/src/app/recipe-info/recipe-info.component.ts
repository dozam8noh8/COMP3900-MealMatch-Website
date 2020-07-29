import { Component, OnInit } from '@angular/core';

import { RecipeService } from '../services/recipe.service';
import {Recipe} from '../models/recipe';
import { ActivatedRoute, Router } from '@angular/router';
import { RatingComment } from '../models/rating_comment';
import { RatingCommentService } from '../services/rating-comment.service';


@Component({
  selector: 'app-recipe-info',
  styleUrls: ['./recipe-info.component.scss'],
  template:  `
                <!-- Added this so when recipe isnt defined (when api request is loading ) we dont get an undefined error -->
                <div class="main-div">
                <ng-container *ngIf="recipe">

                <mat-card id="image-ingredients" style="flex-direction: column; border-radius: 2%; padding-top: 8vh; margin-bottom: 2vh;">
                    <mat-card-title style="font-weight:lighter; font-size: 3.5em; padding-top: 2vh; padding-bottom: 4vh;">{{recipe.name}}</mat-card-title>
                    
                    <!-- Show rating --> 
                    <ng-container *ngIf="nRatings <= 0"> 
                      There are no ratings yet
                    </ng-container>
                    <ng-container *ngIf="nRatings > 0"> 
                      <ngb-rating 
                      [(rate)]="averageRating"
                      [max]="5"
                      [readonly]="true">
                        <ng-template let-fill="fill" let-index="index">
                        <span class="star" [class.full]="fill === 100">
                          <span class="half" [style.width.%]="fill">&#9733;</span>&#9733;
                        </span>
                        </ng-template>
                      </ngb-rating>
                      {{averageRating}} ({{nRatings}} ratings)
                    </ng-container>
                    
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
                              <div *ngFor="let instruction of instructions">
                                <li>{{instruction}}</li>
                              </div>
                            </ol>
                        </div>
                    </div>
                  <app-display-comments style="width: 90%"
                  [recipeId]="recipe.id"></app-display-comments>
                </mat-card>
                </ng-container>
                </div>
              `
})
export class RecipeInfoComponent implements OnInit {

  recipe: Recipe;
  recipePlaceholder = 'assets/images/recipe_placeholder.jpg';
  instructions: string[] = [];
  allRatingComments: RatingComment;
  nRatings = 0;
  averageRating = 0;

  constructor(
    private recipeService: RecipeService,
    private rcService: RatingCommentService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
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

      if( Object.keys(data).length === 0 ) { // If data is empty
        this.router.navigate(['/notfound']);
      } else {
        this.recipe = data;
        this.instructions = this.recipe.instruction.split('\n');
      }

      this.getAllRatingComments();
    },
    (error) => {
      console.log(error);
    });
  }

  getAllRatingComments() {
    this.rcService.getAllRatingComments(this.recipe.id)
    .subscribe( (rcResp: RatingComment[]) => {
      // console.log(rcResp)
      // this.allRatingComments = rcResp;
      
      const allRatings = rcResp.map( rc => parseInt(rc.rating) )
      const totalStars = allRatings.reduce( (accumulator, currentValue) => (accumulator + currentValue) );
      this.nRatings = rcResp.length;
      this.averageRating = totalStars/this.nRatings;

      console.log(this.averageRating)
    })

  }

}
