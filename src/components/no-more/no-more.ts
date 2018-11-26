import { Component,Input } from '@angular/core';

/**
 * Generated class for the NoMoreComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'no-more',
  templateUrl: 'no-more.html'
})
export class NoMoreComponent {

  @Input() hasMore: boolean;

}
