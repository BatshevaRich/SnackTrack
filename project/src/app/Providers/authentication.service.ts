import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import {environment} from '../../environments/environment';
const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  baseURL = environment.baseURL;
  authenticationState = new BehaviorSubject(false);
  userName: string;
  userPass: string;

  constructor(private afAuth: AngularFireAuth,
              private gplus: GooglePlus,
              private storage: Storage,
              private plt: Platform,
              public http: HttpClient) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  GetParams(): Observable<HttpParams> {
    let params = new HttpParams();
    this.storage.get('auth-token').then(res => {
      const user = res as string;
      this.userName = user.substring(0, user.indexOf(','));
      this.userPass = user.substring(user.indexOf(',') + 1, user.length);
      params = params.append('user', user);
      params = params.append('name', this.userName);
      params = params.append('pass', this.userPass);
      console.log(res);
      debugger;
      return of(params);
      },
        err => { console.log(err); }
      );
    return of(params);
  }


  loginUser(email: string, password: string
  ): Promise<firebase.auth.UserCredential> {
    this.storage.set(TOKEN_KEY, email + ',' + password).then(data => {
      this.authenticationState.next(true);
    });
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string): Promise<void> {
    this.storage.set(TOKEN_KEY, email + ',' + password).then(() => { this.authenticationState.next(true); });
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((newUserCredential: firebase.auth.UserCredential) => {
        const formData = new FormData();
        formData.append('name', email);
        formData.append('pass', password);
        this.http.post(this.baseURL + 'login/userlogin', formData);
      })
      .catch(error => {
        console.error(error);
        throw new Error(error);
      });

  }

  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<void> {
    this.storage.clear().then(data => {
      this.authenticationState.next(false);
      return firebase.auth().signOut();
    });
    return null;
  }


  checkToken() {
    this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        this.authenticationState.next(true);
      }
    });
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }


}
