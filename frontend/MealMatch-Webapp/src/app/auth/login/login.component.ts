import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, Route } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import * as rx from 'rxjs/operators';

@Component({
  selector: 'app-login',
  styleUrls: ['login.component.scss'],
  template: `
  <div class="main-div">
    <mat-card style="text-align: center; margin: 2em;">
    <mat-card-content>
      <div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-card-title>Welcome Back!</mat-card-title>
          <div>
          <mat-error *ngIf="loginInvalid">
            The username and password were not recognised
          </mat-error>
          <mat-form-field class="inputFields">
            <input matInput placeholder="Username" formControlName="username" required>
            <mat-error>
              Please provide a valid username
            </mat-error>
          </mat-form-field>
          </div>

          <mat-form-field class="inputFields">
            <input matInput type="password" placeholder="Password" formControlName="password" required>
            <mat-error>
              Please provide a valid password
            </mat-error>
          </mat-form-field>
          <button mat-raised-button color="primary" class="submitButton" [disabled]="loading">Login</button>
        </form>
      </div>
      <div>
      <!-- You need the / here for an absolute link rather than an relative link (without, its login/signup) -->
      <a class="signupLink" style="text-decoration: none; color: #007399" routerLink="/signup"> Dont have an account? Sign up </a>
      </div>
      <!-- Maybe make this mat-card-footer? -->
    </mat-card-content>
    <h1 *ngIf=showSuccessBanner> CONGRATULATIONS LOG IN SUCCESS </h1>
  <!-- <mat-spinner *ngIf=loading> Showing spinner </mat-spinner> -->
  <mat-error style="font-weight: lighter; font-size: 20px" *ngIf=!!error> {{ error }} </mat-error>
  </mat-card>
  </div>

  `
})
// Code adapted from https://developer.okta.com/blog/2020/01/21/angular-material-login
/* The login component provides the interface to users to login, it interacts with the auth service
to complete the actual logging in communication with the backend. */
export class LoginComponent implements OnInit {
  // The whole login form
  form: FormGroup;
  // Shown on login success
  showSuccessBanner: boolean;
  // Represents loading state of page
  loading: boolean;

  // Error handling
  showFailBanner: boolean;
  error: String;
  // If the login fails, it is most likely due to incorrect username or password.
  loginInvalid: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {
  }

  async ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  }
  // When the form is submitted, validations are run, then we submit to backend.
  async onSubmit() {
    if (this.form.valid) {
        this.loading = true;
        this.showSuccessBanner = false;
        this.error = '';
        const username = this.form.get('username').value;
        const password = this.form.get('password').value;

        // Login backend through authService.
        this.authService.login({username,password})
        .pipe(rx.take(1)) // take the first emission of login.
        .subscribe(response => {
          this.showSuccessBanner = true; // successful login
          this.loading = false;
          let returnUrl = this.route.snapshot.queryParams?.returnUrl;
          // If we preserved a url from redirecting from login popup component, we want to return.
          if (returnUrl){
            console.log("Return url is!?", returnUrl)
            this.router.navigate([returnUrl]);
          }
          else {
            this.router.navigate(['home']);
          }
        }, error => {
          this.error = "Incorrect username or password, please try again!";
          this.loading = false;
        });
    }
  }
}
