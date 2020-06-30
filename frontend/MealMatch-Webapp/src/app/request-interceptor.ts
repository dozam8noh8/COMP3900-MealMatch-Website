import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { delay, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class RequestLogInterceptor implements HttpInterceptor {


    intercept(request: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
        console.log("A request was made to ", request.url);
        return next.handle(request).pipe(
            materialize(), // Add artificial 1 second delay to all network requests so we can design loading things responsively.
            delay(1000),
            dematerialize(),
        );
  }
}