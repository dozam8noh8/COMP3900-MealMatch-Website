import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-popup',
  styleUrls: ['popup.component.scss'],
  template: `
  <mat-card>
  <mat-card-title> Looks like you're trying to access a logged in page </mat-card-title>
  <mat-card-title> Would you like to navigate to the login page? </mat-card-title>
  <div class="yesno">
  <button mat-raised-button color="primary" routerLink="/login" mat-dialog-close="true"> Yes </button>
  <button mat-raised-button color="warn" mat-dialog-close="true"> No </button>
  </div>


</mat-card>

  `
})
export class PopupComponent implements OnInit {

  constructor(private router: Router, public dialog: MatDialog ) { }

  ngOnInit(): void {
  }
  close() {
  }

}
