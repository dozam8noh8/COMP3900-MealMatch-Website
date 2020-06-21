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
    console.log("Attempting to login from auth service.")
    let url = `${this.BASE_URL}/users`; // auth/login is the endpoint
    return this.http.post(url, user, {headers: this.headers}).toPromise(); // Send api POST request with user data.
  }

  signup(user): Promise<any> {
    let url: string = `${this.BASE_URL}/signup`;
    return this.http.post(url, user, {headers: this.headers}).toPromise();
  }

  test() {
    console.log('Auth service connected');
  }
}
