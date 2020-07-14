import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IngredientService } from 'src/app/services/ingredient.service';
import { Observable } from 'rxjs';
import { Ingredient } from 'src/app/models/ingredient';
import { FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-add-ingredient',
  styleUrls: ['./add-ingredient.component.scss'],
  template: `
              <div *ngIf="!ingredientIsValid"> 
                <em>This ingredient does not exist</em>
              </div>
              <input type="text" placeholder="quantity" 
              (keyup)="changeQuantity($event)"/>
              <mat-form-field style="width: 50%;">
                  <input type="text"
                  placeholder="Input an ingredient"
                  matInput
                  [formControl]="ingredientControl"
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
            `
})
export class AddIngredientComponent implements OnInit {

  // Keep track of whether a valid ingredient
  @Input() position: number;
  @Input() quantity: string;  

  @Input() addedIngredients: Ingredient[];
  @Output() removeFromList = new EventEmitter<Ingredient>();
  @Output() updateIngredient = new EventEmitter<any>();
  @Output() updateQuantity = new EventEmitter<any>();

  ingredientIsValid: boolean = true;

  filteredOptions: Observable<Ingredient[]>;
  ingredientControl = new FormControl()

  constructor(private ingredientService: IngredientService) { }

  ngOnInit(): void {
    this.filteredOptions = this.ingredientControl.valueChanges
      .pipe(
        map(value => this._filter(value)),
      );
  }

  addToList(newIngredient: Ingredient) {
    this.updateIngredient.emit( {index: this.position, newIngredient: newIngredient} );
    this.ingredientIsValid = true;
    // Add ingredient to parent's list ingredients for the recipe
    this.addedIngredients.push(newIngredient);
  }

  private _filter(value: string): Ingredient[] {
    const filterValue = value.toString().toLowerCase();

    // If not an existing ingredient
    if(!this.ingredientService.getAllIngredients().some( elem => (elem.name.toLowerCase()===filterValue))) {
      // Update the ingredient for slot at this position
      this.updateIngredient.emit( {index: this.position, newIngredient: null} );
      this.ingredientIsValid = false;
    }

    if(filterValue)
      return filterValue==='' ? [] : this.ingredientService.getAllIngredients().filter(item => {
          return item.name.toLowerCase().startsWith(filterValue) && !this.addedIngredients.includes(item)
      });
  }

  changeQuantity(keyboardEvent) {
    this.updateQuantity.emit( {index: this.position, newQuantity: keyboardEvent.target.value} );
  }

  displayIngredient(ingredient: Ingredient): String {
    return ingredient?.name;
  }

}
