import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { ApiPictureProvider } from "../../providers/api-picture/api-picture";
import { ImageSnippet } from "../../app/classes/Image";
import { Label } from "../../app/classes/Label";
import { Observable } from "rxjs";
/**
 * Generated class for the CameraPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-camera",
  templateUrl: "camera.html",
  providers: [ApiPictureProvider]
})
export class CameraPage {
  selectedFile: ImageSnippet;
  // public apPic:ApiPictureProvider;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apPic: ApiPictureProvider
  ) {
    console.log(apPic);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad CameraPage");
  }
  loadedLabels: Label[];
  fileToUpload: File = null;
  urls: string[] = new Array();
  processFile($event): void {
    const file: File = $event.target.files[0];




    let _formData = new FormData();
    this.fileToUpload = file;
    _formData.append("file", this.fileToUpload);
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.urls.push(event.target.result);
      console.log(event.target.result);
    };
    reader.readAsDataURL(file);
    console.log(JSON.stringify(_formData));
    localStorage.setItem('loadedImage', JSON.stringify(_formData));

    // this.InsertImages(_formData); //send the images' url to the server = in order to init the table
  }
  // this.imageService.uploadImage(this.selectedFile.file).subscribe(
  //   (res) => {
  //     this.onSuccess();
  //   },
  //   (err) => {
  //     this.onError();
  //   })
  //     preview.src = reader.result;
  //   });

  //   reader.readAsDataURL(file);

  InsertImages(_formData: FormData) {
    debugger;
    this.apPic.InsertImages(_formData).subscribe((res: any) => {
      alert(res);
    });
  }

  getLabels() {
    // this.apPic.GetLabelsForPicture(this.selectedFile.src);
  }
  private onSuccess() {
    this.selectedFile.pending = false;
    this.selectedFile.status = "ok";
  }

  private onError() {
    this.selectedFile.pending = false;
    this.selectedFile.status = "fail";
    this.selectedFile.src = "";
  }
}
