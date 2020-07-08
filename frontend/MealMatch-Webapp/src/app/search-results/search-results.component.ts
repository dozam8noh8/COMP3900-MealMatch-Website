import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from '../models/recipe';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {

  constructor(private router: Router, private searchService: SearchService) {
    let searchState = this.router.getCurrentNavigation().extras.state;
    // If a list of ingredients was passed from search (home page)
    if(searchState) {
      this.searchService.searchForRecipes(searchState.searchIngredients);
    }
  }

  ngOnInit(): void {
  }

  getResults() {
    return this.searchService.getAllResults()
  }

  getSearchedIngredients() {
    return this.searchService.inputIngredients;
  }  

  searchComplete() {
    return this.searchService.searchComplete;
  }



}
