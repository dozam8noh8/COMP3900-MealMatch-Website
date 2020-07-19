import { Component, OnInit } from '@angular/core';
import { Recipe } from '../models/recipe';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-loveless-sets',
  styleUrls: ['./loveless-sets.component.scss'],
  template: ``,
})
export class LovelessSetsComponent implements OnInit {

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
  }

}
