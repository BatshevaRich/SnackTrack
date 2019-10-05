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
import { Observable } from 'rxjs/Observable';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from './login/login.page';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private storage: Storage,
    private afAuth: AngularFireAuth,
    private gplus: GooglePlus, public actionSheetCtrl: ActionSheetController,
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
      if (!this.authenticationService.isAuthenticated) {
      this.authenticationService.authenticationState.subscribe(state => {
        
        if (state) {
          this.router.navigate(['home']);
          this.isLoggedIn = true;
        } else {
          this.router.navigate(['login']);
          this.isLoggedIn = false;
        }
      })};
    });
  }
  signOut(){
    this.storage.clear().then(data=>{
      this.afAuth.auth.signOut();
    });
    this.isLoggedIn = false;
    // if(this.platform.is('cordova')){
    //   this.gplus.logout();
    // }
  }

}
