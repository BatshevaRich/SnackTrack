import { BrowserModule } from "@angular/platform-browser";
import { NgModule, ErrorHandler } from "@angular/core";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { MyApp } from "./app.component";
import { ItemDetailsPage } from "../pages/item-details/item-details";
import { OptionsPage } from "../pages/options/options";
import { DayPage } from "../pages/day/day";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { CameraPage } from "../pages/camera/camera";
import { ApiPictureProvider } from "../providers/api-picture/api-picture";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { LoadPicProvider } from "../providers/load-pic/load-pic";
import { SpinnerDialog } from "@ionic-native/spinner-dialog/ngx";
import { MealProvider } from '../providers/meal/meal';
@NgModule({
  declarations: [
    MyApp,
    ItemDetailsPage,
    OptionsPage,
    DayPage,
    CameraPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    CommonModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ItemDetailsPage,
    OptionsPage,
    DayPage,
    CameraPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ApiPictureProvider,
    HttpClientModule,
    CommonModule,
    LoadPicProvider,
    SpinnerDialog,
    MealProvider
  ]
})
export class AppModule {}
