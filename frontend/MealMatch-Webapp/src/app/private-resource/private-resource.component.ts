import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-private-resource',
  template: `<h1> This is a private resource!! </h1>`
})
export class PrivateResourceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
