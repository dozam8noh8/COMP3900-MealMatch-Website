import { Component, OnInit, Inject, ViewChildren, QueryList } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { RecipeViewCardComponent } from 'src/building-components/recipe-view-card/recipe-view-card.component';
import { ImageService } from '../image.service';
import { MatDialog } from '@angular/material/dialog';
import { AddRecipePopupComponent } from 'src/building-components/add-recipe-popup/add-recipe-popup.component';

@Component({
  selector: 'app-profile-page',
  styleUrls: ['profile-page.component.scss'],
  template: `
  <h1>  Welcome to your recipe dashboard {{ username }}!</h1>
  <div>
    <app-photo-upload (uploadEmitter)="setProfilePhoto($event)">
    </app-photo-upload>
    <button (click)="uploadPhoto()" [disabled]="!recipeImage"> Upload Photo </button>
  </div>
  <img alt="user placeholder image" [src]="profile_pic">

  <button (click)="handleAddRecipe()"> Add a new recipe </button>

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
  profile_pic = "assets/images/user_placeholder.jpg";
  recipes: Recipe[];
  recipeImage: File;

  @ViewChildren(RecipeViewCardComponent) recipeCards: QueryList<RecipeViewCardComponent>;

  constructor(private authService: AuthService, private http: HttpClient,
           private recipeService: RecipeService, private imageService: ImageService,
           private dialog: MatDialog) { }

  ngOnInit(): void {
    this.userId = this.authService.getLoggedInUserId();
    this.authService.getUserDetails().subscribe(res => {
      this.username = res.username;
      this.email = res.email;
      if (res.profile_pic){
        this.profile_pic = res.profile_pic;

      }
      this.recipes = res.recipes;
    });

  }
  handleEditRecipe(recipeId: number) {
    console.log("Attempting to edit", event);
    //send api call
  }
  // Delete the recipe that was emitted by child to be deleted.
  handleDeleteRecipe(recipeToDelete: number) {
    this.recipes = this.recipes.filter(recipe => recipe.id !== recipeToDelete)
  }

  setProfilePhoto(file: File) {
    console.log("Setting profile photo")
    this.recipeImage = file;
  }
  uploadPhoto(){
    console.log("Uploading photo")
    if (this.recipeImage){
      this.imageService.uploadProfileImage(this.recipeImage).subscribe(res => console.log(res))
    }
  }
  handleAddRecipe() {
    this.dialog.open(AddRecipePopupComponent);
  }
}
