import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanDeactivate } from '@angular/router';
import { RecipeFormComponent } from './recipe-form/recipe-form.component';

@Injectable({
  providedIn: 'root'
})
export class RecipeFormGuardService implements CanDeactivate<RecipeFormComponent> {

  constructor() { }
    canDeactivate(component: RecipeFormComponent){
      if (confirm("Are you sure you want to navigate away, your changes will not be saved")){
        return true;
      }
      return false;
    }
}
