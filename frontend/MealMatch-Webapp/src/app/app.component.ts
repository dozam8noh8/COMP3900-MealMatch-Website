import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
  <app-navbar> </app-navbar>

  <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'MealMatch-Webapp';
}
