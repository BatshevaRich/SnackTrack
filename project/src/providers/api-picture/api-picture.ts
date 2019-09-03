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
  fileToUpload: File;
  constructor(public httpClient: HttpClient, public http: Http) {}

  public GetLabels() {
    var res = this.http.get(this.baseURL + "clarifai/" + "InsertImages");
    return new Promise(resolve => {
      res.subscribe(data => {
        resolve(data.json());
      });
    });
  }

  dataURLtoFile(dataurl, filename) {
    //https://stackoverflow.com/questions/35940290/how-to-convert-base64-string-to-javascript-file-object-like-as-from-file-input-f?noredirect=1&lq=1
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  InsertImages(formData): any {
    var file = this.dataURLtoFile(formData, "img.jpg");
    let _formData = new FormData();
    this.fileToUpload = file;
    _formData.append("file", file);
    console.log(file);
    var res = this.http.post(
      this.baseURL + "clarifai/InsertImages/",
      _formData
    );
    return new Promise(resolve => {
      res.subscribe(data => {
        resolve(data.json());
      });
    });
  }
}
