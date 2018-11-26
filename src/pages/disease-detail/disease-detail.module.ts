import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DiseaseDetailPage } from './disease-detail';

@NgModule({
  declarations: [
    DiseaseDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(DiseaseDetailPage),
  ],
})
export class DiseaseDetailPageModule {}
