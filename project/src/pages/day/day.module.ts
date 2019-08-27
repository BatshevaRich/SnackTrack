import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DayPage } from './day';

@NgModule({
  declarations: [
    DayPage,
  ],
  imports: [
    IonicPageModule.forChild(DayPage),
  ],
})
export class DayPageModule {}
