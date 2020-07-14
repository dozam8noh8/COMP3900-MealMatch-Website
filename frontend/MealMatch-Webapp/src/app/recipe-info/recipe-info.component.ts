import { Component, OnInit } from '@angular/core';

import { RecipeService } from '../services/recipe.service';
import {Recipe} from '../models/recipe';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-recipe-info',
  templateUrl: './recipe-info.component.html',
  styleUrls: ['./recipe-info.component.scss']
})
export class RecipeInfoComponent implements OnInit {

  recipeService: RecipeService;
  recipe: Recipe;

  constructor(repServ: RecipeService, private route: ActivatedRoute) {
    this.recipeService = repServ;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( params => {
      this.getRecipeDetails(Number(params.get('id')));
    });

  }

  getRecipeDetails(repId: number) {
    this.recipeService.getRecipeDetails(repId)
    .subscribe( (data: Recipe) => {
      this.recipe = data

    }
    );
  }

}
