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
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  styleUrls: ['profile-page.component.scss'],
  template: `
  <h1 style="margin-left: 1.5vw; font-weight: lighter; font-size: 5vh; margin-top: 4vh;">  Welcome to your recipe dashboard, {{ username }}!</h1>
  <div style="display: flex; margin-top: 5vh">
    <div style="margin-left: 10vw; margin-right: 0; margin-top: 5vh; margin-bottom: 2vh; width: 35%; position: right;">
      <app-photo-upload (uploadEmitter)="setProfilePhoto($event)" [existingImageURL]="profile_pic" [loading]="loading">
      </app-photo-upload>
      <span *ngIf="photoIsUploading">Uploading...</span>
      <span *ngIf="!photoIsUploading">
        <button (click)="uploadPhoto()" [disabled]="!newProfilePhotoFile || photoUploadComplete" class="submitButton"> Save Photo Change </button>
      </span>
    </div>
    <div style="margin-top: 13vh">
                      <h1 style="font-weight: lighter; font-size: 2em" class="copperplate">Contribute to our community of recipes!</h1>
      <button mat-raised-button color="primary" class="submitButton" (click)="handleAddRecipe()" style="margin-left: 15vw; font-size: 2vh;"> Add a new recipe </button>
    </div>
  </div>
  <div *ngIf="recipes && recipes.length > 0; else noRecipes" class="all-recipes-container">
    <div class="container" *ngFor="let recipe of recipes">
      <app-recipe-view-card [recipe]="recipe" [showDeleteEdit]="true" (editEmitter)="handleEditRecipe($event)" (deleteEmitter)="handleDeleteRecipe($event)">
      </app-recipe-view-card>
    </div>
  </div>
  <ng-template #noRecipes >
    <h1 *ngIf="!loading"> You have no recipes </h1>
    <mat-spinner *ngIf="loading" style="margin-left: 47%;"> </mat-spinner>
  </ng-template>

`
})
export class ProfilePageComponent implements OnInit {
  userId: number;
  username: string;
  email: string;
  profile_pic = "assets/images/user_placeholder.jpg";
  recipes: Recipe[];
  newProfilePhotoFile: File;
  loading = true;
  photoIsUploading = false;
  photoUploadComplete = false;

  @ViewChildren(RecipeViewCardComponent) recipeCards: QueryList<RecipeViewCardComponent>;

  constructor(private authService: AuthService, private http: HttpClient,
           private recipeService: RecipeService, private imageService: ImageService,
           private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.userId = this.authService.getLoggedInUserId();
    this.authService.getUserDetails().subscribe(res => {
      this.loading = false;
      this.username = res.username;
      this.email = res.email;
      if (res.profile_pic){
        this.profile_pic = res.profile_pic;

      }
      this.recipes = res.recipes;
    });
  }
  // Called when edit recipe button is clicked on a child recipe-view-card component.
  handleEditRecipe(recipeId: number) {
    // Redirect to edit recipe page with the id of the recipe being edited as the param.
    this.router.navigate(['/edit', recipeId]);
  }
  // Delete the recipe from the view that was emitted by child to be deleted. It is deleted in backend by child.
  handleDeleteRecipe(recipeToDelete: number) {
    this.recipes = this.recipes.filter(recipe => recipe.id !== recipeToDelete)
  }

  // Set a user's profile image based on what is selected and emitted from the photo upload component.
  setProfilePhoto(file: File) {
    this.newProfilePhotoFile = file;
    this.photoUploadComplete = false;
  }

  // Upload a profile picture
  uploadPhoto(){
    console.log("Uploading photo")
    this.photoIsUploading = true;
    if (this.newProfilePhotoFile){
      this.imageService.uploadProfileImage(this.newProfilePhotoFile).subscribe((res:any) => {
        this.profile_pic = `http://localhost:5000/static/${res.msg}`
        this.photoIsUploading = false;
        this.photoUploadComplete = true;
      })
    }
  }
  // Open a the popup that asks if you would like to add a recipe.
  handleAddRecipe() {
    this.dialog.open(AddRecipePopupComponent);
  }
}
