import { Injectable } from '@angular/core';
import { Label } from '../../app/classes/Label';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ApiPictureService {
  labels: Label[];
   baseURL = environment.baseURL;
  fileToUpload: File;
  constructor(public httpClient: HttpClient) {}

  public GetLabels() {
    const res = this.httpClient.get(this.baseURL + 'clarifai/' + 'InsertImages');
    return new Promise(resolve => {
      res.subscribe(data => {
        resolve(data);
      });
    });
  }

  dataURLtoFile(dataurl, filename) {

    // https://stackoverflow.com/questions/35940290/how-to-convert-base64-string-to-javascript-file-object-like-as-from-file-input-f?noredirect=1&lq=1
    let arr = dataurl.split(','),
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
    const headers= new HttpHeaders({'Content-Type':'application/json'});
    return this.httpClient.post(
      this.baseURL + 'clarifai/InsertImages/',
      JSON.stringify(formData),{headers:headers}
    );

    // return new Promise(resolve => {
    //   res.subscribe(data => {
    //     resolve(data);
    //   });
    // });
  }
}
