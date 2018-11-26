import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CityChoosePage } from './city-choose';

@NgModule({
  declarations: [
    CityChoosePage,
  ],
  imports: [
    IonicPageModule.forChild(CityChoosePage),
  ],
})
export class CityChoosePageModule {}
