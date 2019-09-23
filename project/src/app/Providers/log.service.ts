import { Injectable } from '@angular/core';
import { EmailValidator } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  baseURL = 'http://localhost:54640/api/';

  constructor(public httpClient: HttpClient) { }
  toSinIn(name:string,pass:string){

    
    const headers= new HttpHeaders({'Content-Type':'application/json'});
    const res = this.httpClient.post(
      this.baseURL + 'login/sinIn/',
      JSON.stringify(name+','+pass),{headers:headers}
    );
    return new Promise(resolve => {
      res.subscribe(data => {
        resolve(data);
      });
    });
  }
  

toSinUp(){

}


}
