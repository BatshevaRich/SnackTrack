import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OptionsPage } from '../pages/options/options';
import { DayPage } from '../pages/day/day';
import { CameraPage } from '../pages/camera/camera';
import { HomePage } from '../pages/home/home';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make Calendar the root (or first) page
  rootPage = CameraPage;
  pages: Array<{title: string, component: any}>;
    private statusBar: StatusBar
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Options', component: OptionsPage},
      { title: 'Day', component:DayPage},
      { title: 'camera', component: CameraPage },
      { title: 'Calendar', component: HomePage}
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
