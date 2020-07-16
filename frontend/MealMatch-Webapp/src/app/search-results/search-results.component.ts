import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {

  selectedMealType: String;

  constructor(private router: Router, private searchService: SearchService) {
    let searchState = this.router.getCurrentNavigation().extras.state;
    // If a list of ingredients was passed from search (home page)
    if(searchState) {
      this.selectedMealType = searchState.mealType;
      this.searchService.searchForRecipes(searchState.searchIngredients);
    }
  }

  ngOnInit(): void {
  }

  updateMealType(newMealType: string) {
    this.selectedMealType = newMealType;
  }

  getResults() {
    if(this.selectedMealType==="All") {
      return this.searchService.getAllResults();

    } else {
      
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

  getAllMealTypes() {
    return this.searchService.allMealTypes;
  }

}
