import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MainDetailPage } from './main-detail';

@NgModule({
  declarations: [
    MainDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(MainDetailPage),
  ],
})
export class MainDetailPageModule {}
