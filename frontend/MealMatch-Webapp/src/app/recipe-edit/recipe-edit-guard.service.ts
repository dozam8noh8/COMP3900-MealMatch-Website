import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { isNumber } from 'util';

@Injectable({
  providedIn: 'root'
})
/* This guard checks the route associated with /edit/<id> to make sure it is a valid recipe.
  It also checks that the user attempting to edit the recipe is the recipe creator.
  Returning false in both these cases, blocking the routing to the view. */
export class RecipeEditGuardService implements CanActivate {

  constructor(private recipeService: RecipeService, private router: Router, private authService: AuthService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    let recipeId = route.params?.id
    // If user has typed a route like /edit/notarealrecipe, redirect to notfound
    if (!recipeId || isNaN(+recipeId)) {
      this.router.navigate(['/notfound'])
      return false;
    }
    let userId = this.authService.getLoggedInUserId()
    return this.recipeService.getRecipeDetails(recipeId).pipe(map((res: any) => {
      // Check the current user is the owner of the recipe
      if (res.user_id === userId) {
        return true;
      }
      // If not the owner, redirect to home, unpermitted action.
      else {
        this.router.navigate(['/home'])
        return false;
      }
    }));
  }
}
