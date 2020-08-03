import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe';

@Component({
  selector: 'app-all-recipes',
  styleUrls: ['./all-recipes.component.scss'],
  template: `
<div
      *ngIf="recipes && recipes.length > 0; else noRecipes"
      class="all-recipes-container"
    >
      <div class="container" *ngFor="let recipe of recipes">
        <app-recipe-view-card
          [recipe]="recipe"
        >
        </app-recipe-view-card>
      </div>
    </div>
    <ng-template #noRecipes>
      <h1 *ngIf="!loading">You have no recipes</h1>
      <mat-spinner *ngIf="loading" style="margin-left: 47%;"> </mat-spinner>
    </ng-template>
    <mat-paginator *ngIf="!loading && recipes.length > 1"
    [length]="totalRecipesNumber"
    [pageSize]="itemsPerPage"
    [pageSizeOptions]="[12, 24, 40]"
    (page)="handlePaginator($event)"
    > </mat-paginator>
  `
})
/* The all recipes component provides a paginated view to display all
recipes in the system. This can give users the opportunity to browse
through options when their ingredients don't match anything. */
export class AllRecipesComponent implements OnInit {
  recipes: Recipe[];
  itemsPerPage = 12;
  displayedPage = 1;
  loading = true;
    totalRecipesNumber: any;

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.recipeService.getAllRecipes(this.itemsPerPage, this.displayedPage).subscribe((response: any) => {
      this.loading = false;
      this.recipes = response.recipes;
    })
  }
  // Handles the pagination of the page, loading only itemsPerPage items at once.
  handlePaginator($event){
    this.itemsPerPage = $event.pageSize;
    this.displayedPage = $event.pageIndex + 1;
    // Clear the recipes so that we dont show the previous page's recipes aswell.
    this.recipes = [];
    console.log($event);
    this.loading = true;
    // Not ideal to get all user details again just for recipes.
    this.recipeService.getAllRecipes(this.displayedPage, this.itemsPerPage)
    .subscribe((response: any) => {
      this.loading = false;
      this.recipes = response.recipes;
      this.totalRecipesNumber = response.total_results;
    })
  }
}
