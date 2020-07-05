import { Component, OnInit} from '@angular/core';
import { IngredientService } from '../../services/ingredient.service';

@Component({
  selector: 'app-ingredient-by-category',
  templateUrl: './ingredient-by-category.component.html',
  styleUrls: ['./ingredient-by-category.component.scss']
})
export class IngredientByCategoryComponent implements OnInit {

  ingredientService: IngredientService;

  constructor(ingService: IngredientService) { 
    this.ingredientService = ingService;
  }

  ngOnInit(): void {
  }

}
