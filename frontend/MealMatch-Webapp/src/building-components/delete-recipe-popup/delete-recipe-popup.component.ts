import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-delete-recipe-popup',
    styleUrls: ['delete-recipe-popup.component.scss'],
    template: `
    <mat-card>
    <mat-card-title> {{ description }} </mat-card-title>
    <mat-card-title> {{ question }} </mat-card-title>
    <div class="yesno">
    <button mat-raised-button color="primary" (click)="emitYes()"> Yes </button>
    <button mat-raised-button color="warn" (click)="emitNo()"> No </button>
    </div>


  </mat-card>

    `,
})

export class DeleteRecipePopupComponent implements OnInit {
    @Input() description: string;
    @Input() question: string;
    // @Output() yesClicked: EventEmitter<any>;
    // @Output() noClicked: EventEmitter<any>;
    constructor(private dialogRef: MatDialogRef<any>) {}
    ngOnInit(): void {
        console.log(this.description)
    }
    emitYes() {
        this.dialogRef.close('Yes');
    }
    emitNo() {
        this.dialogRef.close('No');
        //this.noClicked.emit();
    }

}