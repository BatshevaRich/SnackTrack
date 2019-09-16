import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Camera } from '@ionic-native/camera/ngx';
import { PipesModule } from './pipes/pipes.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';;
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewDayMealPageModule } from './view-day-meal/view-day-meal.module';
import {IonicStorageModule} from '@ionic/storage';
// import { FilterPipe } from './pipes/filter.pipe';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    NgbModule, PipesModule,
    BrowserModule, BrowserAnimationsModule, HttpClientModule, CommonModule, IonicModule.forRoot(),IonicStorageModule.forRoot(),AppRoutingModule,ViewDayMealPageModule],
  providers: [
    StatusBar,
    SplashScreen, HttpClientModule, Camera,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
