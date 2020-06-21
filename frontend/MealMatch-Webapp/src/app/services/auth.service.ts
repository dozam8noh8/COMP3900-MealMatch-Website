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

  login(user): Promise<any> {
    console.log(user.username)
    var authData = 'Basic ' + window.btoa(`${user.username}:${user.password}`); // Establish auth data from username and pw.
    this.headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': authData}); //Make a new header from old header + auth data.
    console.log("Attempting to login from auth service.");
    let url = `${this.BASE_URL}/token`; // auth/login is the endpoint
    return this.http.get(url, {headers: this.headers}).toPromise(); // Send api POST request with user data.
    // STORE AUTH RESPONSE HERE
  }

  signup(user): Promise<any> {
    let url: string = `${this.BASE_URL}/users`;
    return this.http.post(url, user, {headers: this.headers}).toPromise();
  }

  test() {
    console.log('Auth service connected');
  }
}
