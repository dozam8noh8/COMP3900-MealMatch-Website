import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-navbar',
  styleUrls: ['./navbar.component.scss'],
  template: `
  <mat-toolbar color="primary" class="nav">
  <a routerLink="/home" routerLinkActive="active"><img src="assets/images/logo3.png" class="logo"></a>
  <div class="nav-middle">
  <button mat-button routerLink="/halloffame" routerLinkActive="active" class="nav-button"> Hall Of Fame </button>
  </div>
  <div class="nav-right" >
  <button *ngIf="loggedIn | async" mat-button routerLink="/dashboard" routerLinkActive="active" class="nav-button"> Dashboard </button>
  <button *ngIf="!(loggedIn | async)" mat-button routerLink="/login" routerLinkActive="active" class="nav-button"> Login </button>
  <button  *ngIf="!(loggedIn | async)"  mat-button routerLink="/signup" routerLinkActive="active" class="nav-button"> Sign Up </button>
  <button *ngIf="loggedIn | async" (click)="logout()" mat-button color="primary" class="nav-button">Logout</button>
  </div>
  </mat-toolbar>`
})
// In the template above, the routerLinkActive allows us to add style to the active route link.

/* The navbar component is attached by default to all routes for easy navigation, it uses an observable
of the loggedin state to change buttons displayed when a user logs out. */
export class NavbarComponent implements OnInit {

  loggedInSubscription$: Subscription;
  loggedIn: Observable<boolean>;
  constructor(private authService: AuthService) {

  }

  ngOnInit(): void {
    // Observe the loggedIn state of the user
    this.loggedIn = this.authService.isLoggedIn();
  }
  logout() {
    this.authService.logout();
  }

}


/* Note to Owen. We can't send a subscription straight into an ngIf.
 We can either do "observable | async" which subscribes on the spot
OR we can set a regular boolean variable inside of the observable.subscribe()
and put that variable in the ngIf */
