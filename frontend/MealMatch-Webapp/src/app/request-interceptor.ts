import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { delay, materialize, dematerialize } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Injectable()
export class RequestLogInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
        let JWTToken = this.authService.getJWTToken();
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