import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-instruction-slot',
  styleUrls: ['./instruction-slot.component.scss'],
  template: `
<mat-error *ngIf="formGroup.get('instruction_text').invalid && formSubmitted"> Please enter some text </mat-error>
<div class="flex-container">
  <span style="padding-right: 10px"> {{position+1}}. </span>
  <div style="flex-grow: 8">
    <mat-form-field style="width: 90%" appearance="outline">
        <textarea type="text"
        placeholder="Input step"
        matInput
        required
        rows="5"
        [formControl]="formGroup.get('instruction_text')"> </textarea>
    </mat-form-field>
  </div>

  <div>
    <button mat-raised-button color="warn" type="button" (click)="removeSelf()">Remove step</button>
  </div>
</div>
            `
})
export class InstructionSlotComponent implements OnInit {

  @Input() position: number;
  @Input() formGroup: FormGroup;
  @Input() formSubmitted: boolean;

  @Output() removeInstruction = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  removeSelf() {
    this.formGroup.removeControl('instruction_text');
    this.removeInstruction.emit(this.position);
  }

}
