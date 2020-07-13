import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe';
import { MatDialog } from '@angular/material/dialog';
import { DeleteRecipePopupComponent } from 'src/building-components/delete-recipe-popup/delete-recipe-popup.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profile-page',
  styleUrls: ['profile-page.component.scss'],
  template: `<h1> This is a private resource!! </h1>
  <h1>  Welcome to your recipe dashboard {{ username }}!</h1>
  <img alt="user placeholder image" [src]="userImage">

  <div class="all-recipes-container">
    <div class="container" *ngFor="let recipe of recipes">
      <app-recipe-view-card [recipe]="recipe" [showDeleteEdit]="true" (editEmitter)="handleEditRecipe($event)" (deleteEmitter)="handleDeleteRecipe($event)">
      </app-recipe-view-card>
    </div>
  </div>

`
})
export class ProfilePageComponent implements OnInit {
  userId: number;
  username: string;
  email: string;
  userImage = "assets/images/user_placeholder.jpg";
  recipes: Recipe[];

  constructor(private authService: AuthService, private dialog: MatDialog, private http: HttpClient, private recipeService: RecipeService) { }

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
  handleEditRecipe(recipeId: number) {
    console.log("Attempting to edit", event);
    //send api call
  }
  handleDeleteRecipe(recipeId: number) {
    console.log(recipeId)
    let dialogRef = this.dialog.open(DeleteRecipePopupComponent, {
      // data : {
      //   description: "",
      //   question: "Are you sure you want to delete the recipe? It's permanent",
      // }
    });
    dialogRef.componentInstance.description ="Deleting Recipe";
    dialogRef.componentInstance.question = "Are you sure you want to delete the recipe? It's permanent"
    dialogRef.componentInstance.recipeId = recipeId;
    //dialogRef.componentInstance.emitYes.subscribe(emission => {}
    dialogRef.afterClosed().subscribe(emission => {
      if (emission.behaviour === "Yes") {
        console.log("Clicked yes");
        this.recipeService.deleteRecipe(emission.recipeId)
        .subscribe(response => {
          console.log(response.status);
          if (response.status === 200) {
            console.log("Deleting recipe");
            this.recipes = this.recipes.filter(recipe => recipe.id !== emission.recipeId)
            //Add loading bar
          }
          else {
            console.log("Couldn't delete recipe")
          }
        });
      }
      else {
        console.log("Clicked No");
        // Do nothing.
      }
    })

  }

}
