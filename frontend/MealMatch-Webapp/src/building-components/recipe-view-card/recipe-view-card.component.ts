import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from 'src/app/models/recipe';

@Component({
    selector: 'app-recipe-view-card',
    styleUrls: ['recipe-view-card.component.scss'],
    template: `
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
  `
})

export class RecipeViewCardComponent implements OnInit{
    @Input() recipe: Recipe;

    ngOnInit() {
        console.log("Instantiating card component")
    }

}
