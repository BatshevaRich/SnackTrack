import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController} from '@ionic/angular';
import { from } from 'rxjs';


@Component({
  selector: 'app-zoom-image',
  templateUrl: './zoom-image.page.html',
  styleUrls: ['./zoom-image.page.scss'],
})
export class ZoomImagePage implements OnInit {
srcImage: string;
  constructor(public navParams: NavParams, public PopoverCtrl: PopoverController) { }

  ngOnInit() {
    this.srcImage = this.navParams.get('img');
  }
  close() {
    this.PopoverCtrl.dismiss();
  }
}
