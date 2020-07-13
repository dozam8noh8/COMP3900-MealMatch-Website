import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoginPopupComponent } from '../../building-components/login-popup/login-popup.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private router: Router, private authService: AuthService, public dialog: MatDialog) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(map( loggedIn => {
      if (!loggedIn) {
        this.dialog.open(LoginPopupComponent);
        //this.router.navigate(['/login'],  { queryParams: { returnUrl: state.url }});
        return false;
      }
      else {
        return true; // We let them access the route.
      }
    }));
    // Redirect to login but encode the returnUrl for when we successfully login.
   // This will not allow users who try to access the route this service activates on to go to the route. We may want to redirect them somewhere else.
  }

}
