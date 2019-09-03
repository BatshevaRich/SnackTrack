import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { ApiPictureProvider } from "../../providers/api-picture/api-picture";
import { ImageSnippet } from "../../app/classes/Image";
import { Label } from "../../app/classes/Label";
import { Observable } from "rxjs";
import { OptionsPage } from "../options/options";
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
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apPic: ApiPictureProvider
  ) {}
  selectedFile: ImageSnippet;
  loadedLabels: Label[];
  fileToUpload: File = null;
  urls: string[] = new Array();
/**
 * processes the file, saves a base64 string in the local storage, and opens options page
 * @param $event the input file html object
 */
  sendImage($event): void {
    const file: File = $event.target.files[0];
    var reader = new FileReader();
    reader.onload = (event: any) => {
      localStorage.setItem("loadedImage", event.target.result);
    };
    reader.readAsDataURL(file);
    this.navCtrl.setRoot(OptionsPage);//go to next page
  }

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
    localStorage.setItem("loadedImage", JSON.stringify(_formData));

    this.InsertImages(_formData); //send the images' url to the server = in order to init the table
  }
  InsertImages(_formData: FormData) {
    debugger;
    this.apPic.InsertImages(_formData).subscribe((res: any) => {
      alert(res);
    });
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

  processing: boolean;
  uploadImage: string;
  presentActionSheet(fileLoader) {
    fileLoader.click();
    var that = this;
    fileLoader.onchange = function() {
      var file = fileLoader.files[0];
      var reader = new FileReader();

      reader.addEventListener(
        "load",
        function() {
          that.processing = true;
          that.getOrientation(fileLoader.files[0], function(orientation) {
            if (orientation > 1) {
              that.resetOrientation(reader.result, orientation, function(
                resetBase64Image
              ) {
                that.uploadImage = resetBase64Image;
              });
            } else {
              that.uploadImage = reader.result;
            }
          });
        },
        false
      );

      if (file) {
        reader.readAsDataURL(file);
      }
    };
  }
  imageLoaded() {
    this.processing = false;
  }
  getOrientation(file, callback) {
    var reader = new FileReader();
    reader.onload = function(e: any) {
      var view = new DataView(e.target.result);
      if (view.getUint16(0, false) != 0xffd8) return callback(-2);
      var length = view.byteLength,
        offset = 2;
      while (offset < length) {
        var marker = view.getUint16(offset, false);
        offset += 2;
        if (marker == 0xffe1) {
          if (view.getUint32((offset += 2), false) != 0x45786966)
            return callback(-1);
          var little = view.getUint16((offset += 6), false) == 0x4949;
          offset += view.getUint32(offset + 4, little);
          var tags = view.getUint16(offset, little);
          offset += 2;
          for (var i = 0; i < tags; i++)
            if (view.getUint16(offset + i * 12, little) == 0x0112)
              return callback(view.getUint16(offset + i * 12 + 8, little));
        } else if ((marker & 0xff00) != 0xff00) break;
        else offset += view.getUint16(offset, false);
      }
      return callback(-1);
    };
    reader.readAsArrayBuffer(file);
  }
  resetOrientation(srcBase64, srcOrientation, callback) {
    var img = new Image();

    img.onload = function() {
      var width = img.width,
        height = img.height,
        canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d");

      // set proper canvas dimensions before transform & export
      if (4 < srcOrientation && srcOrientation < 9) {
        canvas.width = height;
        canvas.height = width;
      } else {
        canvas.width = width;
        canvas.height = height;
      }

      // transform context before drawing image
      switch (srcOrientation) {
        case 2:
          ctx.transform(-1, 0, 0, 1, width, 0);
          break;
        case 3:
          ctx.transform(-1, 0, 0, -1, width, height);
          break;
        case 4:
          ctx.transform(1, 0, 0, -1, 0, height);
          break;
        case 5:
          ctx.transform(0, 1, 1, 0, 0, 0);
          break;
        case 6:
          ctx.transform(0, 1, -1, 0, height, 0);
          break;
        case 7:
          ctx.transform(0, -1, -1, 0, height, width);
          break;
        case 8:
          ctx.transform(0, -1, 1, 0, 0, width);
          break;
        default:
          break;
      }

      // draw image
      ctx.drawImage(img, 0, 0);

      // export base64
      callback(canvas.toDataURL());
    };

    img.src = srcBase64;
  }
  removePic() {
    this.uploadImage = null;
  }
}
