import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  styleUrls: ['./navbar.component.scss'],
  template: `  
  <mat-toolbar color="primary" class="nav">
  <a routerLink="/home" routerLinkActive="active"> Home </a>
  <div class="nav-right" >
  <a routerLink="/login" routerLinkActive="active"> Login </a>
  <a routerLink="/signup" routerLinkActive="active"> Sign Up </a>
  </div>
  </mat-toolbar>`
})
// In the template above, the routerLinkActive allows us to add style to the active route link.
// mat toolbar is imported from angular materials (like bootstrap)
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
