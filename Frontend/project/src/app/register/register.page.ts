import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../Providers/authentication.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  constructor(
    private modalController: ModalController,
    public storage: Storage,
    private authService: AuthenticationService,
    private navCtrl: NavController,
    private router: Router
  ) { }

  ngOnInit() {
  }


  // On Register button tap, dismiss login modal and open register modal

  // login(form: NgForm) {
  //   this.authService.signUp(form.value.email, form.value.password).then(data=>{
  //     this.router.navigate(['home']);});
  // }
}
