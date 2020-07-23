import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../services/search.service';
import { MealType } from '../models/mealtype';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {

  formForMealType;
  selectedMealType: string;
  allMealTypes: string[];

  constructor(
    private router: Router, 
    private searchService: SearchService,
    private formBuilder: FormBuilder
    ) {
      this.formForMealType = this.formBuilder.group({
        selectedMealType: ''
      });

    let searchState = this.router.getCurrentNavigation().extras.state;
    
    this.searchService.getAllMealTypes()
    .subscribe( (data: MealType[]) => {
      // Get the meal types as strings
      this.allMealTypes = data.map(mtype => mtype.name);

      // If a list of ingredients was passed from search (home page)
      if(searchState) {
        // Set the selected meal type as per the search
        this.selectedMealType = searchState.mealType.name;
        this.formForMealType.setValue({
          selectedMealType: searchState.mealType.name
        })
        this.searchService.searchForRecipes(searchState.searchIngredients);
      }
      else {
        // If there is no state a user cannot find anything with search
        this.router.navigate(['/home']);
      }
    })
  }

  ngOnInit(): void {
  }

  updateMealType(newMealType: string) {
    this.selectedMealType = newMealType;
  }

  getResults() {
    if(!this.selectedMealType || this.selectedMealType==="All") {
      return this.searchService.getAllResults();

    } else {
      // Get the recipes that have the selected meal type as one of its meal types
      return this.searchService.getAllResults().filter(recipe => {
        return recipe.mealtypes.some( elem => (elem.name === this.selectedMealType));
      })
    }

  }

  getSearchedIngredients() {
    return this.searchService.inputIngredients;
  }

  searchComplete() {
    return this.searchService.searchComplete;
  }

}
