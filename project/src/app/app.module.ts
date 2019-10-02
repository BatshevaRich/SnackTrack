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
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ZoomImagePageModule } from './Zoom-image/Zoom-image.module';
import { RegisterPageModule } from './register/register.module';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
const firebaseConfig = {
  apiKey: 'AIzaSyChoQJnU3L4rVfQYEUp3tBhclNY_mQ9bV8',
  authDomain: 'dietdiary.firebaseapp.com',
  databaseURL: 'https://dietdiary.firebaseio.com',
  projectId: 'dietdiary',
  storageBucket: 'dietdiary.appspot.com',
  messagingSenderId: '577220905399',
  appId: '1:577220905399:web:27a67f7c9b5a525b02c032',
  measurementId: 'G-MJLDVK73E9'
}
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [ AngularFireModule.initializeApp(firebaseConfig), AngularFireAuthModule,
    NgbModule, PipesModule,
    BrowserModule, BrowserAnimationsModule, HttpClientModule, CommonModule, IonicModule.forRoot(),IonicStorageModule.forRoot(),
    AppRoutingModule,ViewDayMealPageModule, RegisterPageModule,ZoomImagePageModule],
  providers: [GooglePlus,
    StatusBar,
    SplashScreen, HttpClientModule, Camera,NativeStorage,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
