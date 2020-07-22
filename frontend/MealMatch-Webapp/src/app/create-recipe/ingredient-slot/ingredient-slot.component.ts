import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IngredientService } from 'src/app/services/ingredient.service';
import { Observable } from 'rxjs';
import { Ingredient } from 'src/app/models/ingredient';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { NewIngredientPopupComponent } from '../new-ingredient-popup/new-ingredient-popup.component';
import { IngredientSearchComponent } from 'src/app/home-page/ingredient-search/ingredient-search.component';


@Component({
  selector: 'app-ingredient-slot',
  styleUrls: ['./ingredient-slot.component.scss'],
  template: `
              <input type="text" placeholder="quantity"
              [formControl]="formGroup.get('quantity')">
              <mat-form-field style="width: 50%;">
                  <input type="text"
                  placeholder="Input an ingredient"
                  matInput
                  [formControl]="formGroup.get('name')"
                  [matAutocomplete]="auto">
                  <mat-autocomplete
                  autoActiveFirstOption
                  #auto="matAutocomplete"
                  [displayWith]="displayIngredient"
                  (optionSelected)="addToList($event.option.value)">
                      <mat-option *ngFor="let option of filteredOptions | async" [value]="option">
                          {{option.name}}
                      </mat-option>
                  </mat-autocomplete>
              </mat-form-field>
              <button type="button" (click)="removeSelf()">Remove ingredient</button>

              <div *ngIf="!ingredientIsValid">
                <em>This ingredient does not exist. Would you like to add to our collection of ingredients?</em>
                <button type="button" (click)="openNewIngredientDialog()">Yes</button>
              </div>
            `
})
export class IngredientSlotComponent implements OnInit {

  // Keep track of whether a valid ingredient
  @Input() position: number;
  @Input() quantity: string;
  @Input() addedIngredients: Ingredient[];
  @Input() formGroup: FormGroup; // Controls the quantity and ingredient the slot has.
  @Input() formArray: FormArray;
  @Output() removeIngredient = new EventEmitter<number>();
  @Output() updateIngredient = new EventEmitter<any>();
  @Output() updateQuantity = new EventEmitter<any>();

  ingredientIsValid: boolean = true;
  filteredOptions: Observable<Ingredient[]>;

  constructor(private ingredientService: IngredientService, private newIngredientDialog: MatDialog) { }

  ngOnInit(): void {
    this.filteredOptions = this.formGroup.get('name').valueChanges
      .pipe(
        map(value => {
          return this._filter(value)
        }),
      );
      this.formGroup.get('name').valueChanges.subscribe(x=> console.log(x));
  }

  addToList(newIngredient: Ingredient) {
    // Set the id of the ingredient that we get returned in the response.
    this.formGroup.controls.id.setValue(newIngredient.id)
    this.formGroup.get('name').setValue(newIngredient.name) // set the name manually because the selector passes in the whole ingredient.
    // Remove "ingredient does not exist message"
    this.formGroup.get('name').disable();
    this.ingredientIsValid = true;
  }

  private _filter(value: string): Ingredient[] {
    const filterValue = value.toString().toLowerCase();
    // If not an existing ingredient
    if(!this.ingredientService.getAllIngredients().some( elem => (elem.name.toLowerCase()===filterValue))) {
      // Update the ingredient for slot at this position
      this.ingredientIsValid = false;
    }

    if(filterValue)
      return filterValue==='' ? [] : this.ingredientService.getAllIngredients().filter(item => {
          return item.name.toLowerCase().startsWith(filterValue) && !this.addedIngredients.includes(item)
      });
  }

  // This is hacky, hopefully we can improve but I don't know how the auto selector emits an object when a form control cant.
  displayIngredient(ingredient: Ingredient): String {
    if (typeof ingredient === 'string') {
      return ingredient;
    }
    else {
      return ingredient?.name;
    }
  }

  openNewIngredientDialog() {
    this.newIngredientDialog.open(NewIngredientPopupComponent, {
      data: { inputString: this.formGroup.get('name').value }
    }).afterClosed()
    .subscribe( (newCreatedIngredient: Ingredient) => {
      // If not an ingredient being passed in
      // console.log(typeof newCreatedIngredient)
      if(typeof newCreatedIngredient === 'string') {
        console.log("Ingredient is a string", newCreatedIngredient);
      } else {
        this.addToList(newCreatedIngredient);
      }
    });
  }

  removeSelf() {
    this.removeIngredient.emit(this.position);
  }

}