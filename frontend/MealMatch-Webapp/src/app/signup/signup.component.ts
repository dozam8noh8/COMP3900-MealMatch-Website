import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  styleUrls: ['signup.component.scss'],
  template: `
    <div class="signup">
   <mat-card>
   <mat-card-title> Register Here </mat-card-title>

     <mat-card-content>
     <form [formGroup]="form" (ngSubmit)="onSubmit()">
     <p>

      <mat-form-field>
      <input matInput placeholder="Username" formControlName="username" required>
      <mat-error>
          Please provide a valid email username
      </mat-error>
    </mat-form-field>
</p>
    <p>

    <mat-form-field>
      <input matInput placeholder="Email" formControlName="email" required>
      <mat-error>
          Please provide a valid email address
      </mat-error>
    </mat-form-field>

    </p>

    <p>

    <mat-form-field>
      <input matInput type="password" placeholder="Password" formControlName="password" required>
      <mat-error>
          Password cannot be blank.
</mat-error>
    </mat-form-field>
    </p>

    <p>

    <mat-form-field>
      <input matInput type="password" placeholder="Confirm Password" formControlName="confirmPassword" required>
      <mat-error>
          Please confirm password.
      </mat-error>
    </mat-form-field>
    <button mat-raised-button color="primary">Sign Up</button>

</form>
</mat-card-content>
</mat-card>
</div>
<h1 *ngIf=showSuccessBanner> CONGRATULATIONS SIGN UP SUCCESS </h1>






  `
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  showSuccessBanner: boolean;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {}
  ngOnInit(): void {
    this.form = this.fb.group({  // This builds a reactive form with the given controls (like a big object)
      username: ['', Validators.required], // These connect to the mat-errors to provide validation error text.
      email: ['', Validators.email],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }
  async onSubmit() {
    console.log('Submitting form');
      if (this.form.valid) {
        try {
          const username = this.form.get('username').value; // Get the values entered in the form.
          const password = this.form.get('password').value;
          await this.authService.signup({username,password}); // send in an object with username and password to auth service
          this.showSuccessBanner = true;
        } catch (err) {
          console.log("An error occurred", err);
        }
      }
    }
}
