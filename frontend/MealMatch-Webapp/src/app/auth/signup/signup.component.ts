import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, AbstractControl, ValidatorFn } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  styleUrls: ['signup.component.scss'],
  template: `
  <div class="main-div">
   <mat-card style="text-align: center; margin: 2em;">
     <div>
   <mat-card-title style="font-weight:lighter; font-size: 3em; margin-top: 35px; padding-bottom: 10px;"> Register Here! </mat-card-title>

     <mat-card-content style="padding-top: 30px;">
     <form [formGroup]="form" (ngSubmit)="onSubmit()">
     <p>

      <mat-form-field class="inputFields">
      <input matInput placeholder="Username" formControlName="username" required>
      <mat-error>
          Please provide a valid email username
      </mat-error>
    </mat-form-field>
</p>
    <p>

    <mat-form-field class="inputFields">
      <input matInput style="font-weight: lighter;" placeholder="Email" formControlName="email" required>
      <mat-error>
          Please provide a valid email address
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
    <p>
    <button mat-raised-button class="submitButton" [disabled]="loading" color="primary">Sign Up</button>
    <mat-spinner *ngIf=loading> </mat-spinner>
    <mat-error class="submitError" *ngIf=error> {{error}} </mat-error>
    <h1 *ngIf=showSuccessBanner> Sign up successful, redirecting to login </h1>


</form>
</mat-card-content>
</div>

</mat-card>
</div>
  `
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  loading: boolean;
  error: String; // Refactor errors!
  passwordMatchError: boolean;
  showSuccessBanner: boolean;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.form = this.fb.group({  // This builds a reactive form with the given controls (like a big object)
      username: ['', Validators.required], // These connect to the mat-errors to provide validation error text.
      email: ['', Validators.email],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
//{    updateOn: 'submit', validators: bothPasswordFieldsMatch,} );
    )}
  async onSubmit() {
    if (this.form.valid) {
      // Extra validation. FIX THE USE OF SET TIMEOUT.
      if (this.form.get('password').value !== this.form.get('confirmPassword').value) {
        this.error = 'Please make sure the confirm password field matches the password field.';
        //setTimeout(() => this.error = '', 4000);
        return;
      }
        this.loading = true;
        this.error = '';
        const username = this.form.get('username').value; // Get the values entered in the form.
        const password = this.form.get('password').value;
        await this.authService.signup({username,password})
        .then(() => {
          this.showSuccessBanner = true;
          // FIX THIS SO YOU CAN'T CLICK IT MULTIPLE TIMES!
          setTimeout(() => this.router.navigate(['/login']), 1000);
        })
        .catch(error => {
          this.error = 'This username is already taken, please try another.';
          console.log("An error occurred", error);
        })
        .finally(() => {
          this.loading = false;
        });
      }
    }
}
export function bothPasswordFieldsMatch(f: FormGroup) {
  let password = f.get('password').value ;
  let confirmPassword = f.get('confirmPassword').value;
  console.log("Password = ", password, confirmPassword)
  if (!password || !confirmPassword) {
    return null;
  }
  if (password === confirmPassword) {
    return null; // Validator will passs
  }
  return { 'NoPasswordMatch': true }; // validator fails here with the message passwords dont match.

}
/* Haven't got this working yet but might be useful at some stage */
export function controlNotSameAs(otherControl: AbstractControl): ValidatorFn {
  return function inner (control: AbstractControl) {
    if (!control.value || !otherControl.value) {
      return null;
    }
    if (control.value === otherControl.value){
      return null;
    }
    return { 'NoPasswordMatch': true }; // validator fails here with the message passwords dont match.
  }
}