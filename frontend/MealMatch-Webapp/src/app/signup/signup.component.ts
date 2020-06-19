import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

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
      <input matInput placeholder="Password" formControlName="password" required>
      <mat-error>
          Password cannot be blank.
</mat-error>
    </mat-form-field>
    </p>

    <p>

    <mat-form-field>
      <input matInput placeholder="Confirm Password" formControlName="confirmPassword" required>
      <mat-error>
          Please confirm password.
      </mat-error>
    </mat-form-field>
    <button mat-raised-button color="primary">Sign Up</button>

</form>
</mat-card-content>
</mat-card>
</div>






  `
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  private formSubmitAttempt: boolean;

  constructor(
    private fb: FormBuilder,
  ) {}
  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.email],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }
  async onSubmit() {
    console.log('Submitting form');
  }
}
