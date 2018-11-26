import { Component } from '@angular/core';

/**
 * Generated class for the UserlistComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'userlist',
  templateUrl: 'userlist.html'
})
export class UserlistComponent {

  text: string;
  public list = [];

  constructor() {
    console.log('Hello UserlistComponent Component');
    this.text = 'Hello World';
    this.list=['11111','22222222','333'];
  }

}
