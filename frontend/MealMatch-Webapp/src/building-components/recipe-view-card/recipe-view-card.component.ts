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
  <ng-container *ngIf="!loading">
    <mat-card class="example-card">
    <mat-card-header>
        <div mat-card-avatar style="background-image: url({{recipe.image}});background-size: cover;"></div>
        <mat-card-title>{{recipe.name}}</mat-card-title>
        <mat-card-subtitle>Primary Mealtype: {{recipe.mealtypes[0].name}}</mat-card-subtitle>
    </mat-card-header>
    <div *ngIf="recipe.image">
        <img mat-card-image src={{recipe.image}} alt="Photo of a Shiba Inu">
    </div>
    <div *ngIf="!recipe.image">
        <img mat-card-image [src]="recipeImagePlaceholder alt="Photo of a Shiba Inu">
    </div>
    <mat-card-content>
        <p style="font-weight: lighter; font-size: 1em;">
        Ingredients include:
            <span *ngFor="let ingredient of recipe.ingredients">
                {{ingredient["ingredient.name"]}}, <!-- Should not have comma for last ingredient -->
            </span>
        </p>
    </mat-card-content>

        <mat-card-actions>
            <button mat-button (click)="editRecipe()">Edit</button>
            <button mat-button (click)="deleteRecipe()">Delete</button>
        </mat-card-actions>

    </mat-card>
</ng-container>
    <mat-spinner *ngIf=loading> Showing spinner </mat-spinner>
  `
})

export class RecipeViewCardComponent implements OnInit{
    @Input() recipe: Recipe;
    @Input() showDeleteEdit = false; // Might need an observable here for login/logout.
    @Output() editEmitter = new EventEmitter<number>();
    @Output() deleteEmitter = new EventEmitter<number>();

    recipeImagePlaceholder = 'assets/images/user_placeholder.jpg';
    loading = false;
    error: string = '';

    constructor(private dialog: MatDialog, private recipeService: RecipeService) {}
    ngOnInit() {
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

}
