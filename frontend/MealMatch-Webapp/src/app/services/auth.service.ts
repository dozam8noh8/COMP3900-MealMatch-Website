import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root' // means this provider is available all throughout the app.
                    // An alternative to putting auth service in the providers in app.module.
})

// Adapted from https://realpython.com/user-authentication-with-angular-4-and-flask/
export class AuthService {
  private BASE_URL = 'http://localhost:5000/api'; // Our api calls will go to this URL
  private headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient) {}

  // Sends request to log in a user and places json web token in session storage.
  login(user): Promise<any> {
    var authData = 'Basic ' + window.btoa(`${user.username}:${user.password}`); // Establish auth data from username and pw (required to get token from endpoint.).
    this.headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': authData}); //Make a new header from old header + auth data.
    let url = `${this.BASE_URL}/token`; // auth/login is the endpoint
    return this.http.get(url, {headers: this.headers})
    .toPromise()
    .then(response => {
      localStorage.setItem('currentUser', JSON.stringify(response)) // If the promise resolves, store the object with token in local storage!
      console.log("Storing details of response" + localStorage.getItem('currentUser'));
    }); // Send api POST request with user data.
  }

  // Sends the request to sign up a user given the details on the signup page.
  signup(user): Promise<any> {
    let url: string = `${this.BASE_URL}/users`;
    return this.http.post(url, user, {headers: this.headers}).toPromise();
  }

  // Checks if a user is logged in by seeing if they have a token in local storage.
  isLoggedIn(){
    if (localStorage.getItem('currentUser')){
      return true
    }
    else {
      return false;
    }
  }

  logout() {
    localStorage.clear();
  }
}
