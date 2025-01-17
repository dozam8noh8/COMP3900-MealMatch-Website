import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  styleUrls: ['./search-bar.component.scss'],
  template: `
              <mat-form-field style="width: 100%;">
                <input type="text"
                placeholder="Input an ingredient"
                matInput
                [formControl]="fc"
                [matAutocomplete]="auto">
                <mat-autocomplete 
                autoActiveFirstOption 
                #auto="matAutocomplete" 
                [displayWith]="itemAsString"
                (optionSelected)="selectItem($event.option.value)">
                    <mat-option *ngFor="let option of filteredOptions | async" [value]="(option)"> 
                        {{itemAsString(option)}} 
                    </mat-option>
                </mat-autocomplete>
              </mat-form-field>
            `
})
export class SearchBarComponent implements OnInit {

  // All objects to search from
  @Input() allItems: any[];
  // Function from parent component on how object is represented as a string
  @Input() itemAsString: (value: any) => string;
  // Any other conditions the parent wants met for filtered results e.g. not already on a list
  @Input() additionalFiltering: (value: any) => boolean;
  // Allows a function in the parent to be triggered (for when a item is selected)
  @Output() selectedItemEmitter = new EventEmitter<any>();

  filteredOptions: Observable<any[]>;
  fc: FormControl;

  constructor() { }

  ngOnInit(): void {
    this.fc = new FormControl();
    this.filteredOptions = this.fc.valueChanges
    .pipe(
      map(strValue => this._filter(strValue))
    )
  }

  selectItem(selectedItem: any) {
    // Emit the item so that it can be processed in the parent component
    this.selectedItemEmitter.emit(selectedItem);
    this.fc.setValue('')
  }

  private _filter(value: string): any[] {
    const filterValue = value.toString().trim().toLowerCase();
    return filterValue==='' 
      ? [] 
      : this.allItems.filter(item => {
        var flag = true;
        // Check if the current object converted to a string matches the search value
        if(this.itemAsString) flag = flag && this.itemAsString(item).toLowerCase().startsWith(filterValue);
        // Also check if there are other conditions
        if(this.additionalFiltering) flag = flag && this.additionalFiltering(item)
        return flag;
      })
  }

}
