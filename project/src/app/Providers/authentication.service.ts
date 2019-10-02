import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  baseURL = 'http://localhost:51786/api/';
  authenticationState = new BehaviorSubject(false);

  constructor(private storage: Storage, private plt: Platform, public http: HttpClient) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  checkToken() {
    this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        this.authenticationState.next(true);
      }
    })
  }

  login() {
    this.checkToken();
    // return this.storage.set(TOKEN_KEY, 'Bearer 1234567').then(() => {
    //   debugger
    //   this.authenticationState.next(true);
    // });
  }

  logout() {
    return this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  signUp(name: string, password: string){
    //need to check local storage if user exists
    const formData = new FormData();
    formData.append('name', name);
    formData.append('pass', password);
    const res = this.http.post(this.baseURL + 'login/userlogin', formData);
    return new Promise(resolve => {
      res.subscribe(data => {
        this.storage.set(TOKEN_KEY, name + ',' + password).then(() => {
          this.authenticationState.next(true);
        });
        resolve(data);
      });
    });
  }
}
