import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-hall-of-fame',
  styleUrls: ['./hall-of-fame.component.scss'],
  template: `
      <h1  class="greeting-text"> Welcome to the hall of fame <i class="em em-fire" aria-role="presentation" aria-label="BIRD"></i> </h1>
      <div class="fame-container">
        <mat-card>
          <mat-card-title class="copperplate"> Top Recipe Contributors <i class="em em-female-cook" aria-role="presentation" aria-label=""></i> </mat-card-title>
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

        <mat-card>
        <mat-card-title class="copperplate"> Top Rated Recipes <i class="em em-spaghetti" aria-role="presentation" aria-label="SPAGHETTI"></i> </mat-card-title>

          </mat-card>

      </div>

      `
})
export class HallOfFameComponent implements OnInit {

  constructor(private recipeService: RecipeService, private authService: AuthService) { }
  contributors: any[] = [{contributor: "Owen", amount: 100},
  {contributor: "Waqif", amount: 100},{contributor: "Manni", amount: 100},{contributor: "Kenny", amount: 1},];
  ngOnInit(): void {
  }

}
