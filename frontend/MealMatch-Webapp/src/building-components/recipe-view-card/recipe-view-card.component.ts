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
<mat-card-header >
<div mat-card-avatar style="background-image: url({{recipe.image}});background-size: cover;"></div>
<mat-card-title>{{recipeDisplayTitle}}</mat-card-title>
<mat-card-subtitle>Mealtype: {{recipe.mealtypes[0].name}}</mat-card-subtitle>
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


export class RecipeViewCardComponent implements OnInit{
    @Input() recipe: Recipe;
    @Input() showDeleteEdit = false; // Might need an observable here for login/logout.
    @Output() editEmitter = new EventEmitter<number>();
    @Output() deleteEmitter = new EventEmitter<number>();

    recipeDisplayTitle = '';
    recipeImagePlaceholder = 'assets/images/recipe_placeholder.jpg';
    loading = false;
    error: string = '';
    link: string;
    ingredientsString = '';
    constructor(private dialog: MatDialog, private recipeService: RecipeService) {}
    ngOnInit() {
        this.link = `/recipe/${this.recipe.id}`;
        this.generateDisplayStrings();
    }
    editRecipe() {
        console.log("Editing recipe")
        this.editEmitter.emit(this.recipe.id);
    }

    deleteRecipe() {
        let dialogRef = this.dialog.open(DeleteRecipePopupComponent);
        // Set attributes of popup.
          dialogRef.componentInstance.description ="Deleting Recipe";
          dialogRef.componentInstance.question = "Are you sure you want to delete the recipe? It's permanent"
          dialogRef.componentInstance.recipeId = this.recipe.id;
          dialogRef.afterClosed().subscribe(emission => {
            if (emission.behaviour === "Yes") {
                this.loading = true; // show spinner
              this.recipeService.deleteRecipe(emission.recipeId)
              .pipe(finalize(() => {console.log("Finally"); this.loading = false}))
              .subscribe( response => {
                  if (response.status === 200){
                    this.deleteEmitter.emit(this.recipe.id); // Pass back up to parent to delete from list.
                  }
                  else {
                      this.error = 'Something went wrong';
                  }
              },
              err => {console.log("Error occurred"); this.error = "An error occured"});
            }
            else {
              // Do nothing.
            }
        });
    }

    // Generate the string of ingredients shown on the card. Truncate at 100 chars
    generateDisplayStrings(){
        let truncate = false;
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
            this.ingredientsString += ".."
        }
        else {
            this.ingredientsString += ".";
        }
        console.log(this.ingredientsString);

        truncate = false;
        for (let word of this.recipe.name.split(" ")) {
            console.log(word)
            if (this.recipeDisplayTitle.length + word.length > 20){
                truncate = true;
                break;
            }
            this.recipeDisplayTitle += word + " ";
        }
        this.recipeDisplayTitle = this.recipeDisplayTitle.slice(0,-1);
        if (truncate) {
            this.recipeDisplayTitle += "..."
        }
    }

}
