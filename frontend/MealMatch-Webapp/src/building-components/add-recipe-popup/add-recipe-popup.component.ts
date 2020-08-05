import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-add-recipe-popup',
    styleUrls: ['add-recipe-popup.component.scss'],
    template: `
    <mat-card>
    <mat-card-title> Would you like to see sets of ingredients for which there are no recipes? </mat-card-title>
    <div class="yesno">
    <button mat-raised-button color="primary" (click)="handleYes()"> Yes, I'll help! </button>
    <button mat-raised-button color="warn" (click)="handleNo()"> No, create my own </button>
    </div>
  </mat-card>`
})

export class AddRecipePopupComponent {
    constructor(private router: Router, private dialogRef: MatDialogRef<any>){}


    handleYes() {
        this.dialogRef.close();
        this.router.navigate(['lovelesssets']);
    }

    handleNo() {
        this.router.navigate(['create']);
        this.dialogRef.close();
    }
}