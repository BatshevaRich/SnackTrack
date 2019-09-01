import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Label } from '../../app/classes/Label';
import { ApiPictureProvider } from '../api-picture/api-picture';

/*
  Generated class for the LoadPicProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoadPicProvider {

  constructor(public http: HttpClient, public apPic: ApiPictureProvider) {
    console.log('Hello LoadPicProvider Provider');
  }

  labels: Label[];
  baseURL = "http://localhost:54640/api/";
  public GetLabelForPicture(){
    this.apPic.GetLabels('');
  }
  
}
