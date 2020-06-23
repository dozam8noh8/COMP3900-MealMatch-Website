import { Component, OnInit } from '@angular/core';

import { RecipeService } from '../recipe.service';
import {Recipe} from '../recipe';


@Component({
  selector: 'app-recipe-info',
  templateUrl: './recipe-info.component.html',
  styleUrls: ['./recipe-info.component.scss']
})
export class RecipeInfoComponent implements OnInit {

  recipeService: RecipeService;
  recipe: Recipe;

  constructor(repServ: RecipeService) { 
    this.recipeService = repServ;
  }

  ngOnInit(): void {
    this.getRecipeDetails();
  }

  getRecipeDetails() {
    this.recipeService.getRecipeDetails(1)
    .subscribe( (data: Recipe) => { this.recipe = data }
    );
  }

}
