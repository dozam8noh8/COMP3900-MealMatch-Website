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
export class RecipeEditGuardService implements CanActivate {

  constructor(private recipeService: RecipeService, private router: Router, private authService: AuthService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    let recipeId = route.params?.id
    // If user has typed a route like /edit/glkjfg, redirect to notfound
    if (!recipeId || !isNumber(recipeId)) {
      this.router.navigate(['/notfound'])
      return false;
    }
    let userId = this.authService.getLoggedInUserId()
    return this.recipeService.getRecipeDetails(recipeId).pipe(map((res: any) => {
      if (res.user_id === userId) {
        return true;
      }
      else {
        this.router.navigate(['/home'])
        return false;
      }
    }));
  }
}
