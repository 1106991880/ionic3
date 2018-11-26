import { NgModule } from '@angular/core';
import { ActionsheetComponent } from './actionsheet/actionsheet';
import { BrowserModule } from '@angular/platform-browser';
//引入，因为在组建MyInfiniteScrollContentComponent中使用了ion-infinite-scroll-content
import { IonicModule } from 'ionic-angular';
import { UserlistComponent } from './userlist/userlist';
import { NoMoreComponent } from './no-more/no-more';
import { MyInfiniteScrollContentComponent } from './my-infinite-scroll-content/my-infinite-scroll-content';
import { MyRefresherContentComponent } from './my-refresher-content/my-refresher-content';




@NgModule({
	declarations: [ActionsheetComponent,
    UserlistComponent,
    NoMoreComponent,
    MyInfiniteScrollContentComponent,
    MyRefresherContentComponent],
	imports: [BrowserModule,IonicModule],
	exports: [ActionsheetComponent,
    UserlistComponent,
    NoMoreComponent,
    MyInfiniteScrollContentComponent,
    MyRefresherContentComponent]
})
export class ComponentsModule {}
