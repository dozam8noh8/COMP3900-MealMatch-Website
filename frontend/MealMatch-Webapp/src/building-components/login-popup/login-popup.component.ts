import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login-popup',
  styleUrls: ['login-popup.component.scss'],
  template: `
  <mat-card>
  <mat-card-title> Looks like you're trying to access a logged in page </mat-card-title>
  <mat-card-title> Would you like to navigate to the login page? </mat-card-title>
  <div class="yesno">
  <button mat-raised-button color="primary" (click)="redirectToLogin()" mat-dialog-close="true"> Yes </button>
  <button mat-raised-button color="warn" mat-dialog-close="true"> No </button>
  </div>


</mat-card>

  `
})
/* The login popup component is activated from the auth guard, it prompts users to login if
they wish to proceed to the page. If they do, they are redirected to the login component
but the url state is preserved in the query params so they can return to the page they were
attempting to look at as soon as they are logged in. */
export class LoginPopupComponent implements OnInit {

  constructor(private router: Router, public dialog: MatDialog ) { }

  ngOnInit(): void {
  }
  redirectToLogin() {
    this.router.navigate(["/login"],{queryParams: {returnUrl: this.router.url}})
  }

}
