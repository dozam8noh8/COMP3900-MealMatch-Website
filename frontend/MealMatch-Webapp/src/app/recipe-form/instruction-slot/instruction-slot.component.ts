import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-instruction-slot',
  styleUrls: ['./instruction-slot.component.scss'],
  template: `
<div class="flex-container">
  {{position+1}}.
  <div style="flex-grow: 8">
    <mat-form-field style="width: 90%" appearance="outline">
        <input type="text"
        placeholder="Input step"
        matInput
        required
        [formControl]="formGroup.get('instruction_text')">
        <mat-error *ngIf="formGroup.get('instruction_text').invalid">
          Please enter some text
        </mat-error>

    </mat-form-field>
  </div>

  <div>
    <button mat-raised-button color="warn" type="button" (click)="removeSelf()">Remove instruction</button>
  </div>
</div>
            `
})
export class InstructionSlotComponent implements OnInit {

  @Input() position: number;
  @Input() formGroup: FormGroup;

  @Output() removeInstruction = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  removeSelf() {
    this.removeInstruction.emit(this.position);
  }

}
