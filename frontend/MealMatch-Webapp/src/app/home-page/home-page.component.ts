import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  template: `<p>This is the home page</p>
              <app-ingredient-search></app-ingredient-search>
            `
})
export class HomePageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
