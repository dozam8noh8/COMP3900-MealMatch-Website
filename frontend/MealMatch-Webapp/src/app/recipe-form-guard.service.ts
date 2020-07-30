import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanDeactivate, ActivatedRoute } from '@angular/router';
import { RecipeFormComponent } from './recipe-form/recipe-form.component';
import { MatDialog } from '@angular/material/dialog';
import { DangerousActionPopupComponent } from 'src/building-components/dangerous-action-popup/dangerous-action-popup.component';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
/* This class stops away navigation for routes, it is currently disabled because
there doesn't seem to be a way to cancel logout in a user clicks that. */
export class RecipeFormGuardService implements CanDeactivate<RecipeFormComponent> {

  constructor(private dialog: MatDialog) { }
    canDeactivate(component: RecipeFormComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot){
      // Allow navigation only to the page associated with logout or the save button.
      // These are unlikely to be misclicks.
      if (nextState.url.includes('login') || nextState.url.includes('/recipe')) {
        return true;
      }
      // Make sure user confirms navigation away.
      let dialogRef = this.dialog.open(DangerousActionPopupComponent);
        dialogRef.componentInstance.description ="Wait!";
        dialogRef.componentInstance.question = "Are you sure you want to navigate away, your changes will not be saved!"

        // Return observable which is subscribed to by guard.
        return dialogRef.afterClosed().pipe(map(emission => {
          // If yes, we navigate away.
          if (emission?.behaviour === "Yes") {
              return true;
          }
          else {
            // Block navigation
            return false;
          }
        }));

    }
}
