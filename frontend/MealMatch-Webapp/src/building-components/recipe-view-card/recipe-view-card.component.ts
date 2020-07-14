import { Component, Input, OnInit, Output } from '@angular/core';
import { Recipe } from 'src/app/models/recipe';
import { EventEmitter } from '@angular/core';

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
    ngOnInit() {
        console.log("Instantiating card component")
    }
    editRecipe() {
        console.log("Editing recipe")
        this.editEmitter.emit(this.recipe.id);
    }

    deleteRecipe() {
        this.deleteEmitter.emit(this.recipe.id);
    }
    test() {
        console.log("OWEN IT WORKS")
    }

}