import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from '../models/recipe';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {

  searchState;
  resultingRecipes: Recipe[];

  constructor(private router: Router, private http: HttpClient) { 
    this.searchState = this.router.getCurrentNavigation().extras.state;
  }

  ngOnInit(): void {
    this.http.post("http://localhost:5000/api/recipe_search", {
      "ingredients": this.searchState.searchIngredients
    })
    .subscribe( (data: Recipe[]) => {
      this.resultingRecipes = data
    }); 
  }



}
