import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Label } from '../../app/classes/Label';
import { Observable } from 'rxjs/Observable';
/*
  Generated class for the ApiPictureProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiPictureProvider {

<<<<<<< HEAD

=======
labels: Label[];
>>>>>>> batsheva
  baseURL = "http://localhost:60829/api/"
  constructor(public http: HttpClient) {
    console.log('Hello ApiPictureProvider Provider');
  }

<<<<<<< HEAD
  GetLabels(){
    return new Promise(resolve=>{
      this.http.get(this.baseURL+ 'Clarifai/GetPath').subscribe(data=>{
        resolve(data);
      }, err=>{
        console.log(err);
      });
    });
  }
=======
  GetLabels(): Observable<Label[]> {
    console.log(this.http.get<Label[]>(this.baseURL + 'Clarifai/GetPath'));
    return this.http.get<Label[]>(this.baseURL + 'Clarifai/GetPath');
  }

  // GetLabels(){
  //   this.http.get(this.baseURL+ 'Clarifai/GetPath').subscribe((data) => {
  //     this.labels = data as Label[];
  //     console.log(data); // This will work
  // });
    // return new Promise(resolve=>{
    //   this.http.get(this.baseURL+ 'Clarifai/GetPath').subscribe(data=>{
    //     resolve(data);
    //   }, err=>{
    //     console.log(err);
    //   });
    // });
  //   console.log(this.labels);
  // }
>>>>>>> batsheva
  


  GetLabelsForPicture(path:string):Observable<Label[]>{
    
    return this.http.get<Label[]>(this.baseURL + "Clarifai/GetPath?path=" + path);
  }
}
