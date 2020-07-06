import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpRequest } from '@angular/common/http';
import { Observable, ReplaySubject, of} from 'rxjs';
import { map, delay, materialize, dematerialize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HelperFunctionsService } from '../helper-functions.service';
@Injectable({
  providedIn: 'root' // means this provider is available all throughout the app.
                    // An alternative to putting auth service in the providers in app.module.
})

// Adapted from https://realpython.com/user-authentication-with-angular-4-and-flask/
export class AuthService {
  private BASE_URL = 'http://localhost:5000/api'; // Our api calls will go to this URL
  private headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  private isLoggedInSubject: ReplaySubject<any> = new ReplaySubject(1); // This replays the last emitted thing to subscribers which means
  constructor(private http: HttpClient, private router: Router, private helper: HelperFunctionsService) {
    if (localStorage.getItem('currentUser')) {
      this.isLoggedInSubject.next(true)
    }
    else {
      this.isLoggedInSubject.next(false)

    }
  }

  // Sends request to log in a user and places json web token in session storage.
  login(user): Observable<any> {
    var authData = 'Basic ' + window.btoa(`${user.username}:${user.password}`); // Establish auth data from username and pw (required to get token from endpoint.).
    this.headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': authData}); //Make a new header from old header + auth data.
    let url = `${this.BASE_URL}/token`; // auth/login is the endpoint

    return this.http.get(url, {headers: this.headers})
    // Do the following, then return the response (So we can log things if we need.)
    .pipe(map(response => {
        localStorage.setItem('currentUser', JSON.stringify(response)) // If the promise resolves, store the object with token in local storage!
        console.log("Storing details of response" + localStorage.getItem('currentUser'));
        this.isLoggedInSubject.next(true) // could also just send in true while we're not using things from here.
        return response;
      }),
    );
  }

  // Sends the request to sign up a user given the details on the signup page.
  signup(user): Promise<any> {
    let url: string = `${this.BASE_URL}/users`;
    return this.http.post(url, user, {headers: this.headers}).toPromise();

  }

  // Checks if a user is logged in by seeing if they have a token in local storage.
  isLoggedIn(): Observable<boolean>{
    console.log("Calling islogged in in auth service.")
    return this.isLoggedInSubject.asObservable().pipe(map( state => !!state)); //cast state to boolean (it already is)
  }

  // Should we log out of the backend aswell?
  logout() {
    localStorage.clear();
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login'])
  }

}

/* This function can be used to add a delay to a promise
  Use it like
  delay2(100).then(original promise here) */
function delay2(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}