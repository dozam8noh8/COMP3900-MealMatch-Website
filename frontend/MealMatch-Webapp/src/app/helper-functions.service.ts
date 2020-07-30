import { Injectable } from '@angular/core';
import { FormGroup, AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class HelperFunctionsService {

  constructor() { }

  // Delays an action using a promise
  delay (time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
  }


}

// Unused but potentially useful functions.
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
   // validator will fail here with the message passwords dont match.
  return { 'NoPasswordMatch': true };

}
/* Checks if two form controls have the same input */
export function controlNotSameAs(otherControl: AbstractControl): ValidatorFn {
  return function inner (control: AbstractControl) {
    if (!control.value || !otherControl.value) {
      return null;
    }
    if (control.value === otherControl.value){
      return null;
    }
     // validator fails here with the message controls dont match.
    return { 'NoPasswordMatch': true };
  }