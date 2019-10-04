import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AutoCompleteService } from 'ionic4-auto-complete';
import { Label } from '../classes/Label';
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
export class AutoCompleteLabelsService implements AutoCompleteService {
  labelAttribute = 'name';
  private labels: any[] = [];
  baseURL = 'http://34.90.143.154/api/';
  params: HttpParams;
  userName: string;
  userPass: string;
  user1: string;

  constructor(private storage: Storage, private http: HttpClient) {
    this.initialization();
  }

  initialization() {
    this.storage.get('auth-token').then(res => {
      const user = res as string;
      this.user1 = user;
      this.userName = user.substring(0, user.indexOf(','));
      this.userPass = user.substring(user.indexOf(',') + 1, user.length);
      this.params = new HttpParams();
      this.params = this.params.append('user', this.user1);
      this.params = this.params.append('name', this.userName);
      this.params = this.params.append('pass', this.userPass);
      console.log(res);
      this.http.get<string[]>(this.baseURL + 'label/all', { params: this.params }).subscribe(allLabel => {
        this.labels = allLabel;
      },
        err => { console.log(err); }
      )
    });
  }
  public addLabels(labels: string[]) {
    for (const i in labels) {
      this.labels.push(i);
    }
  }
  getResults(keyword: string): Observable<any[]> {
    let observable: Observable<any[]>;
    this.storage.get('auth-token').then(res => {
      const user = res as string;
      this.user1 = user;
      this.userName = user.substring(0, user.indexOf(','));
      this.userPass = user.substring(user.indexOf(',') + 1, user.length);
      this.params = new HttpParams();
      this.params = this.params.append('user', this.user1);
      this.params = this.params.append('name', this.userName);
      this.params = this.params.append('pass', this.userPass);
      console.log(res);
    });
    if (this.labels.length === 0) {
      observable = this.http.get<string[]>(this.baseURL + 'label/all', { params: this.params });
    } else {
      observable = of(this.labels);
    }

    return observable.pipe(
      map((result) => {
        return result.filter((item) => {
          return item.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
        });
      }
      ));

    // return observable;
    // this.params = new HttpParams();
    // this.params = this.params.append('user', this.user1);
    // this.params = this.params.append('name', this.userName);
    // this.params = this.params.append('pass', this.userPass);
    // if (this.labels.length === 0) {
    //   observable = this.http.get(this.baseURL + 'label?all', { params: this.params });
    // } else {
    //   observable = of(this.labels);
    // }
    // return observable.pipe(
    //   map((result) => {
    //     return result.filter((item) => {
    //       return item.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
    //     });
    //   }
    //   ));
  }
}
