import { Component, Input, OnInit, Output } from '@angular/core';
import { Recipe } from 'src/app/models/recipe';
import { EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteRecipePopupComponent } from '../delete-recipe-popup/delete-recipe-popup.component';
import { RecipeService } from 'src/app/services/recipe.service';
import { map, finalize } from 'rxjs/operators';
@Component({
    selector: 'app-recipe-view-card',
    styleUrls: ['recipe-view-card.component.scss'],
    template: `

<mat-card class="recipe" style="display: flex; flex-direction: column">
<ng-container *ngIf="!loading">
<div [routerLink]="link" style="cursor: pointer; flex: 1;" class="invisible-outline">
<mat-card-header  class="text-oneline">
<div mat-card-avatar style="background-image: url({{recipe.image}});background-size: cover;"></div>
<mat-card-title >{{recipeDisplayTitle}}</mat-card-title>
<mat-card-subtitle>Mealtype: {{recipe.mealtypes[0].name}}
<div>
    <span *ngIf="recipe.rating===0">Rating: Unrated</span>
    <span *ngIf="recipe.rating > 0">Rating: {{recipe.rating.toFixed(1)}}</span>
    <span *ngIf="recipe.rating > 0" style="color: gold;"> &#9733; </span>
</div></mat-card-subtitle>
</mat-card-header>
    <div *ngIf="recipe.image" >
        <img src="{{recipe.image}}">
    </div>
    <div *ngIf="!recipe.image">
        <img [src]="recipeImagePlaceholder">
    </div>

    <b>{{recipe.name}}</b> <br>
    <div class="ingredient-list">
    <i>Uses: {{ingredientsString}}
    </i>
    </div>
    </div>

    <div class="edit-delete-container" *ngIf="showDeleteEdit">
    <button mat-raised-button (click)="editRecipe()" color="primary" [routerLink]="null"> Edit </button>
    <button mat-raised-button (click)="deleteRecipe()" color="warn" [routerLink]="null"> Delete </button>
    <mat-error> {{error}} </mat-error>
    </div>
</ng-container>
<mat-spinner *ngIf=loading> Showing spinner </mat-spinner>

</mat-card>
  `
})

/* The recipe view card is a reusable component displaying the key details of a recipe.
    there are currently two different views depending on who is viewing the card and from where.
    The buttons will currently show only for recipes on a user's profile because only the owner
    should be able to alter the state of a recipe. */
export class RecipeViewCardComponent implements OnInit{
    // The details of the recipe the view card is displaying.
    @Input() recipe: Recipe;
    // Whether or not we should show the buttons. Input true on the profile_page.
    @Input() showDeleteEdit = false;
    // Emits to the parent when edit is clicked.
    @Output() editEmitter = new EventEmitter<number>();
    // Emits to the parent when delete is clicked
    @Output() deleteEmitter = new EventEmitter<number>();


    // Placeholder image for recipes that have no attached image.
    recipeImagePlaceholder = 'assets/images/recipe_placeholder.jpg';
    // Represents the loading state of the card (if the card is being deleted or loaded from API)
    loading = false;
    // Displays errors from API.
    error: string = '';
    // The view to navigate to when the card is clicked (other than the buttons)
    link: string;
    // The formatted string of ingredients displayed on the card after truncation.
    ingredientsString = '';
    // The title shown on the card after truncation/formatting.
    recipeDisplayTitle = '';

    constructor(private dialog: MatDialog, private recipeService: RecipeService) {}

    ngOnInit() {
        // Set the navigation link for when card is clicked (shorthand for template)
        this.link = `/recipe/${this.recipe.id}`;
        this.generateDisplayStrings();
    }
    // Emit to parent when edit button is clicked
    editRecipe() {
        this.editEmitter.emit(this.recipe.id);
    }

    // Open a confirmation dialog and then emit to parent if delete button is clicked
    deleteRecipe() {
        // Open a delete confirmation popup
        let dialogRef = this.dialog.open(DeleteRecipePopupComponent);
        // Set attributes of popup.
          dialogRef.componentInstance.description ="Deleting Recipe";
          dialogRef.componentInstance.question = "Are you sure you want to delete the recipe? It's permanent"
          dialogRef.componentInstance.recipeId = this.recipe.id;

          // After popup is closed, get the behaviour the popup emitted. (Yes or No)
          dialogRef.afterClosed().subscribe(emission => {
            if (emission?.behaviour === "Yes") {
                this.loading = true; // show spinner's to indicate to user api call is in progress
                this.recipeService.deleteRecipe(emission.recipeId)
                .pipe(finalize(() => {this.loading = false})) // On completion, regardless of status stop loading.
                .subscribe( response => {
                    // If successful deletion, emit to parent to delete from list and view.
                    if (response.status === 200){
                        this.deleteEmitter.emit(this.recipe.id);
                    }
                    else {
                        // Display an error if deletion failed.
                        this.error = 'Something went wrong';
                    }
                },
                // If we get an error response, show an error.
                err => { this.error = "An error occured"});
            }
            else {
              // Do nothing, the popup will be closed.
            }
        });
    }

    // Generate the formatted string of ingredients shown on the card.
    // No longer need to truncate title as it is done in css
    generateDisplayStrings(){
        let truncate = false;
        // Take less than 120 characters worth of ingredients.
        for (let ingredient of this.recipe.ingredients) {
            if (this.ingredientsString.length + ingredient["ingredient.name"].length > 120) {
                truncate = true;
                break;
            }
            this.ingredientsString += (ingredient["ingredient.name"] + ", ")
        }
        // Remove last ", "
        this.ingredientsString = this.ingredientsString.slice(0,-2);
        if (truncate) {
            this.ingredientsString += "..."
        }
        this.recipeDisplayTitle = this.recipe.name;

    }

}
