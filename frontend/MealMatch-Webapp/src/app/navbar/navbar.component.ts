import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-navbar',
  styleUrls: ['./navbar.component.scss'],
  template: `
  <mat-toolbar color="primary" class="nav">
  <a routerLink="/home" routerLinkActive="active"> Home </a>
  <a routerLink="/privateResource" routerLinkActive="active"> Private </a>
  <div class="nav-right" >
  <a *ngIf="!loggedIn" routerLink="/login" routerLinkActive="active"> Login </a>
  <a *ngIf="!loggedIn" routerLink="/signup" routerLinkActive="active"> Sign Up </a>
  <button *ngIf="loggedIn" (click)="logout()" mat-raised-button color="primary">Logout</button>
  </div>
  </mat-toolbar>`
})
// In the template above, the routerLinkActive allows us to add style to the active route link.
// mat toolbar is imported from angular materials (like bootstrap)
export class NavbarComponent implements OnInit {
  loggedIn: boolean;
  constructor(private authService: AuthService) {

  }

  ngOnInit(): void {
    this.loggedIn = this.authService.isLoggedIn();
  }
  logout() {
    console.log("Clicked logout");
    this.authService.logout();
  }

}
