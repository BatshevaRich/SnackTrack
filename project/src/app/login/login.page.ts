import { AuthenticationService } from '../Providers/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { RegisterPage } from '../register/register.page';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { SignupPage } from '../signup/signup.page';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  public loading: HTMLIonLoadingElement;
  constructor(private authService: AuthenticationService, public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private router: Router,
              private formBuilder: FormBuilder,
              public popoverCtrl: PopoverController) {
    this.loginForm = this.formBuilder.group({
      email: ['',
        Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });
  }

  async loginUser(loginForm: FormGroup): Promise<void> {
    if (!loginForm.valid) {
      console.log('Form is not valid yet, current value:', loginForm.value);
    } else {
      this.loading = await this.loadingCtrl.create();
      await this.loading.present();
      const email = loginForm.value.email;
      const password = loginForm.value.password;
      this.authService.loginUser(email, password).then(
        () => {
          this.loading.dismiss().then(() => {
            this.router.navigateByUrl('home');
          });
        },
        error => {
          this.loading.dismiss().then(async () => {
            const alert = await this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: 'Ok', role: 'cancel' }],
            });
            await alert.present();
          });
        }
      );
    }
  }
  ngOnInit() {
  }

  // login(){
  //   this.authService.login();
  //   this.router.navigate(['home']);
  // }
  async presentPopover() {

    const popover = await this.popoverCtrl.create({
      component: SignupPage,
      componentProps: {
      },
    });
    // popover.style.cssText = '--max-height:45%;--width:95%';
    popover.present();
  }
}
