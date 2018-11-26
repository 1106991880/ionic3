import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckVersionPage } from './check-version';

@NgModule({
  declarations: [
    CheckVersionPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckVersionPage),
  ],
})
export class CheckVersionPageModule {}
