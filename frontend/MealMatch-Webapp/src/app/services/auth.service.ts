import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, of} from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root' // means this provider is available all throughout the app.
                    // An alternative to putting auth service in the providers in app.module.
})

// Adapted from https://realpython.com/user-authentication-with-angular-4-and-flask/
export class AuthService {
   // The base of all our api calls.
  private BASE_URL = 'http://localhost:5000/api';
  // Set some default headers of the request.
  private headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  // This replays the last emitted thing to new subscribers which means
  // we can find out if a user is logged in just by subscribing without any
  // external events occuring.
  private isLoggedInSubject: ReplaySubject<any> = new ReplaySubject(1);


  constructor(private http: HttpClient, private router: Router) {
    // If the browser localstorage has information about the user
    // This means we haven't logged out. Since we clear stored information on logout.
    if (localStorage.getItem('currentUser')) {
      // Since constructor is run on app start, we should make sure our users token hasnt expired through a dummy request
      // All subscriptions to isLoggedIn will return true.
      this.isLoggedInSubject.next(true)
    }
    else {
      this.isLoggedInSubject.next(false)
    }
  }

  // Checks if the web token used for network requests has expired
  isTokenExpired() {
    let userDetails = this.getLocalStorageUser();
    // If there are no details in local storage, the token might aswell be expired.
    if (!userDetails) {
      return true;
    }
    // Create a date from the string date stored in localstorage.
    let expiryDate = new Date(userDetails.expiry);
    let currDate = new Date();
    if (currDate > expiryDate){
      return true;
    }
    return false;


  }
  // Sends request to log in a user and places json web token in session storage.
  login(user): Observable<any> {

    // Establish auth data from username and pw (required to get token from endpoint.)
    var authData = 'Basic ' + window.btoa(`${user.username}:${user.password}`);
    // Add the data to the request headers
    let authHeaders = this.headers.append('Authorization', authData); //Make a new header from old header + auth data.

    return this.http.get<any>(`${this.BASE_URL}/token`, {headers: authHeaders})
    // Do the following side effects, then return the response of the request
    .pipe(map(response => {
      // If we get back a login success, we set the user details with its token and expiry in localStorage.
      if (response.status === "success") {

        // Calculate the expiry date as token duration + time now.
        let expiryDate = new Date();
        expiryDate.setSeconds(expiryDate.getSeconds() + response.duration)
        // Create the storage item with the response and the expiry time.
        let userStorageDetails = {
          ...response,
          expiry: expiryDate
        }
        // If the request resolves, store the object with token in local storage!
        localStorage.setItem('currentUser', JSON.stringify(userStorageDetails))
        // Set the loggedInSubject to emit true until further changes (representing the user is logged in)
        this.isLoggedInSubject.next(true)
      }
        return response;
      }),
    );
  }

  // Sends the request to sign up a user given the details on the signup page.
  signup(user): Promise<any> {
    return this.http.post(`${this.BASE_URL}/users`, user, {headers: this.headers}).toPromise();
  }

  // Checks if a user is logged in through the loggedInSubject, the emitted value changes from true to false when we log out.
  isLoggedIn(): Observable<boolean>{
    return this.isLoggedInSubject.asObservable();
  }
  // Get the json webtoken from browser storage if there is one, we use this to append to our network requests to add authentication
  getJWTToken(): string | undefined {
    if (this.isTokenExpired()) {
      return undefined;
    }
    return JSON.parse(localStorage.getItem('currentUser'))?.token;
  }

  // Log the user out by clearing localStorage and changing isLoggedIn subject to return false.
  logout(expired=false) {
    localStorage.removeItem('currentUser'); // just clear what we have added, we don't want to clear users other things!
    this.isLoggedInSubject.next(false);

    // Show that the session is expired in the url (if the JSON token has expired)
    if (expired) {
      this.router.navigate(['/login'], {queryParams: {session: "expired"}})
    }
    else {
      this.router.navigate(['/login'])
    }
  }

  // Returns the user id of the user based on what is in browser localStorage, if there is no user we just return undefined
  getLoggedInUserId() : number | undefined {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return user?.user_id;
  }
  // Get the details associated with a user (name, profile_photo, contributed recipes, etc) from the backend.
  getUserDetails(recipePageNumber?: number, recipesPerPage?: number) : Observable<any> {
    const userId = this.getLoggedInUserId();
    return this.http.get(
      `${this.BASE_URL}/users/${userId}`
      , {
        headers: this.headers,
        params: {
          page_num: recipePageNumber?.toString() || "1",
          page_size: recipesPerPage?.toString() || "10",
        }
      },
);
  }

  // Return the details associated with a user that are stored in localstorage as an object.
  getLocalStorageUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }
}
