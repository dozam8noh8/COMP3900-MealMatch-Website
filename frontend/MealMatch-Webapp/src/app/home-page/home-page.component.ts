import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  template: `<p>This is the home page</p>
              <app-ingredient-search></app-ingredient-search>
              <br>
              <br>
              <app-ingredient-by-category></app-ingredient-by-category>
              Just putting recipe-info page here first because I haven't looked into routing: <app-recipe-info></app-recipe-info>
            `
})
export class HomePageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
