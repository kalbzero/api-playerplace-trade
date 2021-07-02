import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credentialForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {}

  async  signIn(){
    const loading = await this.loadingController.create();
    await loading.present();

    this.firebaseService.signIn(
      this.credentialForm.controls['email'].value,
      this.credentialForm.controls['password'].value
      ).then(
      user => {
        loading.dismiss();
        this.router.navigateByUrl('/home');
      }, async err => {
        loading.dismiss();
        const alert = await this.alertController.create({
          header: 'SignIn Fail :(',
          message: err.message,
          buttons: ['OK']
        });

        await alert.present();
      }
    );
  }

  onRegister() {
    this.router.navigateByUrl('/signup');
  }

  onRecover() {
    this.router.navigateByUrl('/recover');
  }
}
