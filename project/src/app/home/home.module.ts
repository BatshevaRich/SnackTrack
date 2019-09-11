import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgCalendarModule  } from 'ionic2-calendar';
import { HomePage } from './home.page';
import{PipesModule}from '../pipes/pipes.module'
import { AutoCompleteModule } from 'ionic4-auto-complete';


import { from } from 'rxjs';

@NgModule({
  imports: [
    CommonModule,
    AutoCompleteModule,
    FormsModule,
    IonicModule,
    NgCalendarModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
PipesModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
