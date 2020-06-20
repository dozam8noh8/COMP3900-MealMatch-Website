import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `<p>This is the login page</p>
  <mat-card>
  <mat-card-content>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <h2>Log In</h2>
      <mat-error *ngIf="loginInvalid">
        The username and password were not recognised
      </mat-error>
      <mat-form-field class="full-width-input">
        <input matInput placeholder="Email" formControlName="username" required>
        <mat-error>
          Please provide a valid email address
        </mat-error>
      </mat-form-field>
      <mat-form-field class="full-width-input">
        <input matInput type="password" placeholder="Password" formControlName="password" required>
        <mat-error>
          Please provide a valid password
        </mat-error>
      </mat-form-field>
      <button mat-raised-button color="primary">Login</button>
    </form>
  </mat-card-content>
</mat-card>  
  `
})
// Code from https://developer.okta.com/blog/2020/01/21/angular-material-login
export class LoginComponent implements OnInit {
  form: FormGroup;
  public loginInvalid: boolean;
  private formSubmitAttempt: boolean;
  private returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    //private authService: AuthService (we dont have yet)
  ) {
  }

  async ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/game';

    this.form = this.fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required]
    });

    // if (await this.authService.checkAuthenticated()) {
    //   await this.router.navigate([this.returnUrl]);
    // }
  }

  async onSubmit() {
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
    if (this.form.valid) {
      try {
        const username = this.form.get('username').value;
        const password = this.form.get('password').value;
        //await this.authService.login(username, password);
      } catch (err) {
        this.loginInvalid = true;
      }
    } else {
      this.formSubmitAttempt = true;
    }
  }
}
