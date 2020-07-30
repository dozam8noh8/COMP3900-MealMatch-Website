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
  <button *ngIf="loggedInTest" mat-button routerLink="/dashboard" routerLinkActive="active" class="nav-button"> Dashboard </button>
  <button *ngIf="!(loggedIn | async)" mat-button routerLink="/login" routerLinkActive="active" class="nav-button"> Login </button>
  <button  *ngIf="!loggedInTest"  mat-button routerLink="/signup" routerLinkActive="active" class="nav-button"> Sign Up </button>
  <button *ngIf="loggedInTest" (click)="logout()" mat-button color="primary" class="nav-button">Logout</button>
  </div>
  </mat-toolbar>`
})
// In the template above, the routerLinkActive allows us to add style to the active route link.
// mat toolbar is imported from angular materials (like bootstrap)
export class NavbarComponent implements OnInit {
  loggedInSubscription$: Subscription;
  loggedIn: Observable<boolean>;
  loggedInTest: boolean;
  constructor(private authService: AuthService) {

  }
/* Note to Owen. We can't send a subscription straight into an ngIf.
 We can either do "observable | async" which subscribes on the spot
OR we can set a regular boolean variable inside of the observable.subscribe()
and put that variable in the ngIf */
  ngOnInit(): void {
    this.loggedInSubscription$ = this.authService.isLoggedIn().pipe(map(loggedInTest => {console.log("Inside subscription", loggedInTest); this.loggedInTest = loggedInTest})).subscribe(x => x); //this should be equivalent to below with | async
    this.loggedIn = this.authService.isLoggedIn().pipe(map(x => {console.log(x); return x}));
  }
  logout() {
    console.log("Clicked logout");
    this.authService.logout();
  }

}
