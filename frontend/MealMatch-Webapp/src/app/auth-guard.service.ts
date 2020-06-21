import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private router: Router, private authService: AuthService) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {
    if (this.authService.isLoggedIn()) {
      return true; // We let them access the route.
    }

    // Redirect to login but encode the returnUrl for when we successfully login.
    this.router.navigate(['login'],  { queryParams: { returnUrl: state.url }});
    return false; // This will not allow users who try to access the route this service activates on to go to the route. We may want to redirect them somewhere else.
  }

}
