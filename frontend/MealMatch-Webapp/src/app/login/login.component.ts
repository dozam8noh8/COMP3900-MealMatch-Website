import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  styleUrls: ['login.component.scss'],
  template: `
  <mat-card>
  <mat-card-content>
    <div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-card-title>Log In</mat-card-title>
        <div>
        <mat-error *ngIf="loginInvalid">
          The username and password were not recognised
        </mat-error>
        <mat-form-field class="full-width-input">
          <input matInput placeholder="Username or Email" formControlName="username" required>
          <mat-error>
            Please provide a valid username or email address
          </mat-error>
        </mat-form-field>
        </div>

        <mat-form-field class="full-width-input">
          <input matInput type="password" placeholder="Password" formControlName="password" required>
          <mat-error>
            Please provide a valid password
          </mat-error>
        </mat-form-field>
        <button mat-raised-button color="primary">Login</button>
      </form>
    </div>
    <div>
    <!-- You need the / here for an absolute link rather than an relative link (without, its login/signup) -->
    <a class="signupLink" routerLink="/signup"> Dont have an account? Sign up </a>
    </div>
    <!-- Maybe make this mat-card-footer? -->
  </mat-card-content>
  <h1 *ngIf=showSuccessBanner> CONGRATULATIONS SIGN UP SUCCESS </h1>

</mat-card>

  `
})
// Code adapted from https://developer.okta.com/blog/2020/01/21/angular-material-login
export class LoginComponent implements OnInit {
  form: FormGroup;
  public loginInvalid: boolean;
  private formSubmitAttempt: boolean;
  private returnUrl: string;
  showSuccessBanner: boolean;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
  }

  async ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/game';

    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // if (await this.authService.checkAuthenticated()) {
    //   await this.router.navigate([this.returnUrl]);
    // }
  }

  async onSubmit() {
    console.log("Submitting?")
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
    this.showSuccessBanner = false;
    if (this.form.valid) {
      try {
        const username = this.form.get('username').value;
        const password = this.form.get('password').value;
        this.authService.login({username,password}).subscribe(response => {
          console.log(response);
          this.router.navigate(['home']);
        }); // send in an object with username and password to auth service
        this.showSuccessBanner = true;
      } catch (err) {
        this.loginInvalid = true;
      }
    } else {
      this.formSubmitAttempt = true;
    }
  }
}
