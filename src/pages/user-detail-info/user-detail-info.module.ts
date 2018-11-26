import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserDetailInfoPage } from './user-detail-info';

@NgModule({
  declarations: [
    UserDetailInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(UserDetailInfoPage),
  ],
})
export class UserDetailInfoPageModule {}
