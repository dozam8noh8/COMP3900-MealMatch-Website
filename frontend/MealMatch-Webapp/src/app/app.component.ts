import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
  <nav>
  <a routerLink="/home"> Home </a>
  <a routerLink="/login"> Login </a>
  <a routerLink="/signup"> Sign Up </a>

  
  </nav>
  <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'MealMatch-Webapp';
}
