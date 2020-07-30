import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-hall-of-fame',
  styleUrls: ['./hall-of-fame.component.scss'],
  template: `
      <h1  class="greeting-text"> Welcome to the hall of fame <i class="em em-fire" aria-role="presentation" aria-label="BIRD"></i> </h1>
      <div class="fame-container">
        <mat-card class="contributors" *ngIf="!loading">
          <mat-card-title class="copperplate" style="margin-bottom: 1vh"> Top Recipe Contributors <i class="em em-female-cook" aria-role="presentation" aria-label=""></i> </mat-card-title>
            <div>
              <div class="fame-items" >
                <div class="lhs">
                  <h1  *ngFor="let contributor of contributors; let index=index"> {{index + 1}}. {{contributor.contributor}} </h1>
                </div>
                <!-- <div class="middle">
                  <ng-container *ngFor="let contributor of contributors;"> <i class="em em-star" aria-role="presentation" aria-label=""> </i> <br></ng-container>
                </div> -->
                <div class="rhs" >
                  <h1 *ngFor="let contributor of contributors; let index=index" [ngPlural]=contributor.amount>
                      <ng-template ngPluralCase="=1"> {{contributor.amount}} Recipe </ng-template>
                      <ng-template ngPluralCase="other"> {{contributor.amount}} Recipes </ng-template>
                  </h1>
                </div>
              </div>
            </div>
        </mat-card>

        <mat-card class="recipes" *ngIf="!loading">
        <mat-card-title class="copperplate"> Top Rated Recipes <i class="em em-spaghetti" aria-role="presentation" aria-label="SPAGHETTI"></i> </mat-card-title>
        <div>
              <div class="fame-items-recipes" >
                <div class="top-rated-recipe" *ngFor="let recipe of topRatedRecipes; let index=index">
                  <div   > <a [routerLink]="'/recipe/' + recipe.id"> {{index + 1}}. {{recipe.name}} </a> </div>
                  <div>  </div>
                  <div>  {{recipe.contributor}} 	&nbsp;	&nbsp;   {{recipe.rating}}/5 <i class="em em-star" aria-role="presentation" aria-label=""> </i> </div>
                </div>
              </div>
            </div>
        </mat-card>

        <mat-spinner *ngIf="loading" style="margin-left: 45%;"></mat-spinner>
      </div>

      `
})
/*
The hall of fame component displays (up to) the top 10 contributors of recipes and the top 10 rated recipes.
It attempts to use flexbox for a responsive like design.
*/
export class HallOfFameComponent implements OnInit {
  constructor(private recipeService: RecipeService) { }
  // Represents the loading state of the page.
  loading: boolean = true;
  // The top contributors of recipes (list is ordered), Max 10 is returned from API call
  contributors = [];
  // The recipes with highest ratings in order. (Max 10).
  topRatedRecipes = [];

  ngOnInit(): void {
    // Get the top rated recipes and top recipe contributors from backend.
    // Add them to component arrays.
    this.recipeService.getTopRated().subscribe((response:any) => {
      this.loading = false;
      for (let key in response.Users) {
        let curr = response.Users[key];
        this.contributors.push({
          contributor: curr.username,
          amount: curr.count,
          id: curr.id,
        })
      }
      for (let key in response.Recipes) {
        let curr = response.Recipes[key]
        this.topRatedRecipes.push({
          id: curr.id,
          name: curr.name,
          rating: curr.rating,
          contributor: curr.user,
        })
      }
    });
  }

}
