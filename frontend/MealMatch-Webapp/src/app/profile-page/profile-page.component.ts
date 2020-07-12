import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe';

@Component({
  selector: 'app-private-resource',
  template: `<h1> This is a private resource!! </h1>
  <h1>  Welcome to your recipe dashboard {{ username }}!</h1>
  <img alt="user placeholder image" [src]="userImage">

  <div class="container" *ngFor="let recipe of recipes">
        <mat-card class="recipe">
          <div *ngIf="recipe.image">
              <img src="{{recipe.image}}" style="width: 100%;">
          </div>

          <b>{{recipe.name}}</b> <br>
          <i>Uses:
              <span *ngFor="let ingredient of recipe.ingredients">
                  {{ingredient["ingredient.name"]}}, <!-- Should not have comma for last ingredient -->
              </span>
          </i>
        </mat-card>
  </div>

`
})
export class ProfilePageComponent implements OnInit {
  userId: number;
  username: string;
  email: string;
  userImage = "assets/images/user_placeholder.jpg";
  recipes: Recipe[];
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    console.log("INITIALISING PROFILE PAGE");
    this.userId = this.authService.getLoggedInUserId();
    this.authService.getUserDetails().subscribe(res => {
      this.username = res.username;
      this.email = res.email;
      if (res.userImage){
        this.userImage = res.userImage;

      }
      this.recipes = res.recipes;
    });

  }

}
