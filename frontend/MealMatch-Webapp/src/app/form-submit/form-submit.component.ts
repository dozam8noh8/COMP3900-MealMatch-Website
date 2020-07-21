import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-form-submit',
  styleUrls: ['./form-submit.component.scss'],
  template: `<div *ngIf="submitting"> Creating recipe... </div>


`
})
/* This component may be useful for reusing form submission logic. At the moment, I can't think of a good way of separating
the form with the form submit component (as the button to submit the form is in the form submit component.)

We could emit the event from the form submit to the parent which will then trigger the actual form submit in the form component
but this seems overcomplicated.

*/

export class FormSubmitComponent implements OnInit {
  @Input() submitting: boolean;
  @Input() submissionComplete: boolean;
  @Input() completionSuccessMessage: string;
  @Input() completionErrorMessage: string;
  constructor() { }

  ngOnInit(): void {
  }

}


