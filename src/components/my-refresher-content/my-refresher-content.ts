import { Component } from '@angular/core';

/**
 * Generated class for the MyRefresherContentComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'my-refresher-content',
  templateUrl: 'my-refresher-content.html'
})
export class MyRefresherContentComponent {

  text: string;

  constructor() {
    console.log('Hello MyRefresherContentComponent Component');
    this.text = 'Hello World';
  }

}
