import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, AbstractControl, ValidatorFn } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  styleUrls: ['signup.component.scss'],
  template: `
  <div class="main-div">
   <mat-card>
     <div>
   <mat-card-title> Register Here! </mat-card-title>

     <mat-card-content>
     <form [formGroup]="form" (ngSubmit)="onSubmit()">
     <p>

      <mat-form-field class="inputFields">
      <input matInput placeholder="Username" formControlName="username" required>
      <mat-error>
          Please provide a valid username
      </mat-error>
    </mat-form-field>
    </p>
    <p>

    <mat-form-field class="inputFields">
      <input matInput placeholder="Email" formControlName="email" required>
      <mat-error>
          Please provide a valid email address.
      </mat-error>
    </mat-form-field>

    </p>

    <p>

    <mat-form-field class="inputFields">
      <input matInput type="password" placeholder="Password" formControlName="password" required>
      <mat-error>
          Password cannot be blank.
</mat-error>
    </mat-form-field>
    </p>

    <p>

    <mat-form-field class="inputFields">
      <input matInput type="password" placeholder="Confirm Password" formControlName="confirmPassword" required>
      <mat-error>
          Please confirm password.
      </mat-error>
    </mat-form-field>
    <mat-error class="submitError" *ngIf=error> {{error}} </mat-error>
    <h1 *ngIf=showSuccessBanner> Sign up successful, redirecting to login </h1>
    <button mat-raised-button class="submitButton" [disabled]="loading" color="primary">Sign Up</button>
    <mat-spinner *ngIf=loading> </mat-spinner>


</form>
</mat-card-content>
</div>

</mat-card>
</div>
  `
})
/* The signup component is where a user can register their details in the system to create an account.
  it uses reactive forms for validating inputs such as passwords must match and no empty fields. */
export class SignupComponent implements OnInit {
  form: FormGroup;
  loading: boolean;
  error: String;
  passwordMatchError: boolean;
  showSuccessBanner: boolean;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
     // Build the reactive form using form builder, add validations to all inputs.
     // If a form control is invalid, the mat-errors will be displayed.
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.email],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },

    )}
  async onSubmit() {
    // Only submit the form if there are no validation errors.
    if (this.form.valid) {
      // Double check that confirm password matches the initial password.
      if (this.form.get('password').value !== this.form.get('confirmPassword').value) {
        this.error = 'Please make sure password fields match.';
        return;
      }
        // While we are waiting for the response, set loading to true so we can display a loading spinner
        this.loading = true;
        this.error = '';

        // Submit form details to backend.
        const username = this.form.get('username').value;
        const password = this.form.get('password').value;
        await this.authService.signup({username,password})
        // On success, show user login was successful then navigate to home page.
        .then(() => {
          this.showSuccessBanner = true;
          setTimeout(() => this.router.navigate(['/login']), 1000);
        })
        // On error, indicate that the username is already taken.
        .catch(error => {
          this.error = 'This username is already taken, please try another.';
          console.log("An error occurred", error);
        })
        // Regardless, stop the loading of the page so the user can try again.
        .finally(() => {
          this.loading = false;
        });
      }
    }
}
