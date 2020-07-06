import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-spinner-button',
    template: `
    <div style="text-align:center">
      <button mat-raised-button colour="primary" [class.spinner]="loading" [disabled]="loading">Save</button>
    </div>`
})

// Currently not in use.
export class SpinnerButtonComponent {
    @Input() colour : String;
    @Input() loading: boolean;

    constructor() {}
}