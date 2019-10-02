import { Component } from '@angular/core';

import { Platform, PopoverController, NavController, AlertController, ActionSheetController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { from } from 'rxjs';
import { AuthenticationService } from './Providers/authentication.service';
import { Router } from '@angular/router';
import { RegisterPage } from './register/register.page';
// import { AngularFire, FirebaseListObservable } from 'angularfire2';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AngularFireAuthModule } from 'angularfire2/auth';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    public af: AngularFireAuth, public actionSheetCtrl: ActionSheetController,
    private authenticationService: AuthenticationService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    public popoverCtrl: PopoverController
  ) {
    this.initializeApp();
  }

  isLoggedIn: boolean;
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    


    this.authenticationService.authenticationState.subscribe(state => {
      if (state) {
        this.router.navigate(['home']);
        this.isLoggedIn = true;
      } else {
        this.router.navigate(['login']);
      }
    });
  }
  logout() {
    this.authenticationService.logout();
    this.isLoggedIn = false;
  }
  async presentPopover() {

    const popover = await this.popoverCtrl.create({
      component: RegisterPage,
      componentProps: {
      },
    });
    // popover.style.cssText = '--max-height:45%;--width:95%';
    popover.present();
  }

}
