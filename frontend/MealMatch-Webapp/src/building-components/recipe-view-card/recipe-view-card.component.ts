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
    <mat-card class="recipe">
    <ng-container *ngIf="!loading">
        <div *ngIf="recipe.image">
            <img src="{{recipe.image}}" style="width: 100%;">
        </div>
        <div *ngIf="!recipe.image">
            <img [src]="recipeImagePlaceholder" style="width: 100%;">
        </div>

        <b>{{recipe.name}}</b> <br>
        <i>Uses:
            <span *ngFor="let ingredient of recipe.ingredients">
                {{ingredient["ingredient.name"]}}, <!-- Should not have comma for last ingredient -->
            </span>
        </i>
        <div *ngIf="showDeleteEdit">
        <button mat-raised-button (click)="editRecipe()" color="primary"> Edit </button>
        <button mat-raised-button (click)="deleteRecipe()" color="primary"> Delete </button>
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
