import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeViewCardComponent } from 'src/building-components/recipe-view-card/recipe-view-card.component';
import { ImageService } from '../image.service';
import { MatDialog } from '@angular/material/dialog';
import { AddRecipePopupComponent } from 'src/building-components/add-recipe-popup/add-recipe-popup.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  styleUrls: ['profile-page.component.scss'],
  template: `
    <h1 class="greeting-text">
      Welcome to your recipe dashboard, {{ username }}!
    </h1>
    <div style="display: flex; margin-top: 5vh">
      <div class="photo-upload-container">
        <app-photo-upload
          (uploadEmitter)="setProfilePhoto($event)"
          [existingImageURL]="profile_pic"
          [loading]="loading"
        >
        </app-photo-upload>
        <span *ngIf="photoIsUploading">Uploading...</span>
        <span *ngIf="!photoIsUploading">
          <button
            (click)="uploadPhoto()"
            [disabled]="!newProfilePhotoFile || photoUploadComplete"
            class="submitButton"
          >
            Save Photo Change
          </button>
        </span>
      </div>
      <div class="contribute-recipes">
      <h1 *ngIf="!recipesLoading" [ngPlural]="totalRecipesNumber" class="copperplate">
          <ng-template ngPluralCase="=0">You haven't contributed any recipes yet, contribute to our community of recipes!</ng-template>
          <ng-template ngPluralCase="=1">You've contributed {{totalRecipesNumber}} recipe, contribute another?</ng-template>
          <ng-template ngPluralCase="other">You've contributed {{totalRecipesNumber}} recipes! Fancy one more?</ng-template>

        </h1>
        <button
          mat-raised-button
          color="primary"
          class="submitButton"
          (click)="handleAddRecipe()"
        >
          Add a new recipe
        </button>
      </div>
    </div>
    <div
      *ngIf="recipes && recipes.length > 0; else noRecipes"
      class="all-recipes-container"
    >
      <div class="container" *ngFor="let recipe of recipes">
        <app-recipe-view-card
          [recipe]="recipe"
          [showDeleteEdit]="true"
          (editEmitter)="handleEditRecipe($event)"
          (deleteEmitter)="handleDeleteRecipe($event)"
        >
        </app-recipe-view-card>
      </div>
    </div>
    <ng-template #noRecipes>
      <h1 *ngIf="!recipesLoading">You have no recipes</h1>
      <mat-spinner *ngIf="recipesLoading" style="margin-left: 47%;"> </mat-spinner>
    </ng-template>
    <mat-paginator *ngIf="recipes"
    [length]="totalRecipesNumber"
    [pageSize]="itemsPerPage"
    [pageSizeOptions]="[12, 24, 40]"
    (page)="handlePaginator($event)"
    > </mat-paginator>
  `,
})
/* The profile page component is the main dashboard component for users.
  Inside, they can find the recipes they have contributed, their profile picture
  and options for them to edit/delete certain details. */
export class ProfilePageComponent implements OnInit {
  // The id of the user who's page is being shown. Used in API request to get the right details.
  userId: number;
  // The username of the user to display.
  username: string;
  // Set the email aswell for future features.
  email: string;
  // Path to the profile picture, if there is none, a default will be displayed.
  profile_pic = 'assets/images/user_placeholder.jpg';
  // All the recipes a user has contributed.
  recipes: Recipe[];
  // The profile photo file selected by the photo upload component to update.
  newProfilePhotoFile: File;

  // The page number of the current page of recipes being displayed.
  displayedPage = 1;

  // The number of items displayed per paginated page
  itemsPerPage = 12;

  // Dynamic variables give user feedback about what events are happening on the page.
  loading = true;
  // Separate loading variable for paginated recipes.
  recipesLoading = true;
  photoIsUploading = false;
  photoUploadComplete = false;
  // The number of recipes a user has contributed in total (used for pagination).
  totalRecipesNumber: number;

  constructor(
    private authService: AuthService,
    private imageService: ImageService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the user id of the logged in user.
    this.userId = this.authService.getLoggedInUserId();
    // Get all the user details from the backend and populate the component.
    this.authService.getUserDetails(this.displayedPage, this.itemsPerPage).subscribe((res) => {
      this.loading = false;
      this.recipesLoading = false;
      this.username = res.username;
      this.email = res.email;
      this.totalRecipesNumber = res.total_results;

      if (res.profile_pic) {
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
    this.recipes = this.recipes.filter(
      (recipe) => recipe.id !== recipeToDelete
    );
  }

  // Set a user's profile image based on what is selected and emitted from the photo upload component.
  setProfilePhoto(file: File) {
    this.newProfilePhotoFile = file;
    this.photoUploadComplete = false;
  }

  // Upload a profile picture
  uploadPhoto() {
    console.log('Uploading photo');
    this.photoIsUploading = true;
    if (this.newProfilePhotoFile) {
      this.imageService
        .uploadProfileImage(this.newProfilePhotoFile)
        .subscribe((res: any) => {
          this.profile_pic = `http://localhost:5000/static/${res.msg}`;
          this.photoIsUploading = false;
          this.photoUploadComplete = true;
        });
    }
  }
  // Open a the popup that asks if you would like to add a recipe.
  handleAddRecipe() {
    this.dialog.open(AddRecipePopupComponent);
  }
  // Handles the pagination of the page, loading only itemsPerPage items at once.
  handlePaginator($event){
    this.itemsPerPage = $event.pageSize;
    this.displayedPage = $event.pageIndex + 1;
    // Clear the recipes so that we dont show the previous page's recipes aswell.
    this.recipes = [];
    console.log($event);
    this.recipesLoading = true;
    // Not ideal to get all user details again just for recipes.
    this.authService.getUserDetails(this.displayedPage, this.itemsPerPage)
    .subscribe(response => {
      this.recipesLoading = false;
      this.recipes = response.recipes;
      this.totalRecipesNumber = response.total_results;
    })
  }
}
