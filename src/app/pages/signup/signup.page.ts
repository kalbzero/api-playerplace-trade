import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  credentialForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    name: new FormControl('', [Validators.required]),
  });

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private FirebaseService: FirebaseService
  ) { }

  ngOnInit() {}

  async  signUp(){
    const loading = await this.loadingController.create();
    await loading.present();

    this.FirebaseService.signUp(
      this.credentialForm.controls['email'].value,
      this.credentialForm.controls['password'].value,
      this.credentialForm.controls['name'].value
      ).then( 
      async user => {
        loading.dismiss();
        const alert = await this.alertController.create({
          header: 'SignUp Done! :)',
          message: "You got it! Go to Login page or check your email!",
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.router.navigateByUrl('/');
              }
            },
          ]
        });

        await alert.present();
      }, async err => {
        loading.dismiss();
        const alert = await this.alertController.create({
          header: 'SignUp Fail :(',
          message: err.message,
          buttons: ['OK']
        });

        await alert.present();
      }
    );
  }
}
