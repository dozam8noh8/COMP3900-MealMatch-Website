import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { delay, materialize, dematerialize } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';

@Injectable()
export class RequestLogInterceptor implements HttpInterceptor {
    private loggedIn: boolean;
    constructor(private authService: AuthService, private router: Router) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
        // We only want to check if there is a current user on the http request. Otherwise, we allow a logged out request.
        let JWTToken = this.authService.getJWTToken();
        this.authService.isLoggedIn().subscribe(isLoggedIn => {this.loggedIn = isLoggedIn});

        // The user's JSON Token has expired. Log them out and clear their storage.
        if (this.loggedIn && !JWTToken ){
            console.log("Expired token");
            this.authService.logout(true);
            return EMPTY; // still need to return an observable stream but we want to early exit
        }
        // If we do have a JWTToken, we should use it to authenticate our api call.
        if (JWTToken) {
            JWTToken = window.btoa(JWTToken+ ':unused');
            let authHeader = request.headers.append('Authorization', 'Basic ' + JWTToken);
            request = request.clone({headers: authHeader});
        }

        return next.handle(request).pipe(
            materialize(), // Add artificial 1 second delay to all network requests so we can design loading things responsively.
            delay(1000),
            dematerialize(),
        );
  }
}