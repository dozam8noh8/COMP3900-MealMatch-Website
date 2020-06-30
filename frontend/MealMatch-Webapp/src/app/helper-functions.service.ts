import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperFunctionsService {

  constructor() { }


  delay (time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

}
