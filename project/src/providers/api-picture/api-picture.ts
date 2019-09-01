import { Injectable } from "@angular/core";
import { Label } from "../../app/classes/Label";
import { Observable } from "rxjs";
import {
  Http,
  Response,
  RequestOptions,
  ResponseContentType
} from "@angular/http";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/map";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse
} from "@angular/common/http";
import { Body } from "@angular/http/src/body";
/*
  Generated class for the ApiPictureProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiPictureProvider {
  labels: Label[];
  baseURL = "http://localhost:54640/api/";
  constructor(public httpClient: HttpClient, public http: Http) {
    console.log("Hello ApiPictureProvider Provider");
  }

  public GetLabels(picpath: string) {
    const params = new HttpParams().set("path", picpath);
    var res = this.http.get(this.baseURL + "clarifai/");

    return new Promise(resolve => {
      res.subscribe(data => {
        // console.log(data);
        resolve(data.json());
      });
    });
  }

  // public GetLabels() { works august 29, except for returning asyn
  //   console.log();
  //   let header = new HttpHeaders();
  //   let params = new HttpParams();
  //   var res = this.http.get(this.baseURL + "clarifai/");
  //   return res;
  //   // return this.http.get(this.baseURL + "clarifai/getpathAsync").subscribe(res=>{
  //   //   this.labels = res as Label[];
  //   // });
  //   // console.log(this.http.get<Label[]>(this.baseURL + "clarifai"));
  //   // return this.http.get(this.baseURL + "clarifai").map((res: Response) => res.json());
  // }

  // async GetLabels(): Promise<Label[]> {
  //   try {
  //     let response = await this.http
  //       .get(this.baseURL + "Clarifai/GetPath")
  //       .toPromise();
  //     return response as Hero[];
  //   } catch (error) {
  //     await this.handleError(error);
  //   }
  // }
  // async GetLabelsSlow(): Promise<Label[]> {
  //   await new Promise<Label[]>(resolve =>
  //     setTimeout(resolve, 2000));
  //   return await this.getHeroes();
  // }
  // public  GetLabels(){
  //     return new Promise(resolve=>{
  //     this.http.get(this.baseURL+ 'Clarifai/GetPath').subscribe(data=>{
  //       resolve(data);
  //       this.labels = data as Label[];
  //       console.log(this.labels);
  //     }, err=>{
  //       console.log(err);
  //     });
  //   });

  // }
  // console.log(this.http.get<Label[]>(this.baseURL +'Clarifai/'));
  //     return this.http.get<Label[]>(this.baseURL + 'Clarifai/');
  // GetLabels(){
  //   return new Promise(resolve=>{
  //     this.http.get(this.baseURL+ 'Clarifai/GetPath').subscribe(data=>{
  //       resolve(data);
  //     }, err=>{
  //       console.log(err);
  //     });
  //   });
  // }
  // GetLabels(){
  //   return new Promise(resolve => {
  //     this.http.get(this.baseURL + 'Clarifai/GetPath')
  //       .subscribe(data => {
  //         // we've got back the raw data, now generate the core schedule data
  //         // and save the data for later reference
  //         this.labels = data as Label[];
  //         resolve(this.labels);
  //   });
  // });
  //   // console.log(this.http.get<Label[]>(this.baseURL + 'Clarifai/GetPath'));
  //   // return this.http.get<Label[]>(this.baseURL + 'Clarifai/GetPath');
  // }

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

  // GetLabelsForPicture(path: string): Observable<Label[]> {
  //   return this.http.get<Label[]>(
  //     this.baseURL + "Clarifai/GetPath?path=" + path
  //   );
  // }
}
