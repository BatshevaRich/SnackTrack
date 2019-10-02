import { AuthenticationService } from '../Providers/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { RegisterPage } from '../register/register.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private authService: AuthenticationService, private router: Router,
              public popoverCtrl: PopoverController) { }

  ngOnInit() {
  }

  login(){
    this.authService.login();
    this.router.navigate(['home']);
  }
  async presentPopover() {

    const popover = await this.popoverCtrl.create({
      component: RegisterPage,
      componentProps: {
      },
    });
    // popover.style.cssText = '--max-height:45%;--width:95%';
    popover.present();
  }
}
