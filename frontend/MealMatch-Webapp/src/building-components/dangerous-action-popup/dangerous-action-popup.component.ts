import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-dangerous-action',
    styleUrls: ['dangerous-action-popup.component.scss'],
    template: `
    <mat-card>
    <mat-card-title> {{ description }} </mat-card-title>
    <mat-card-title> {{ question }} </mat-card-title>
    <div class="yesno">
    <button mat-raised-button color="warn" (click)="emitYes()"> Yes </button>
    <button mat-raised-button color="primary" (click)="emitNo()"> No </button>
    </div>


  </mat-card>

    `,
})

export class DangerousActionPopupComponent implements OnInit {
    // Description of dangerous action
    @Input() description: string;
    // Question to prompt user
    @Input() question: string;
    // If deleting a recipe, the recipe id of the parent recipe card.
    @Input() recipeId: number;

    constructor(private dialogRef: MatDialogRef<any>) {}
    ngOnInit(): void {
    }
    emitYes() {
        this.dialogRef.close({behaviour: 'Yes', recipeId: this.recipeId});
    }
    emitNo() {
        this.dialogRef.close({behaviour: 'No', recipeId: this.recipeId});
    }

}