import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {FilterPipe  } from './filter.pipe';  //our pipe which we generate


@NgModule({
  imports: [IonicModule],
  declarations: [FilterPipe],
  exports: [FilterPipe]
})
export class PipesModule { }