import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.page.html',
  styleUrls: ['./recover.page.scss'],
})
export class RecoverPage implements OnInit {

  credentialForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private FirebaseService: FirebaseService
  ) { }

  ngOnInit() {
  }

  async recover(){
    const loading = await this.loadingController.create();
    await loading.present();

    this.FirebaseService.recoverPassword(
      this.credentialForm.controls['email'].value
      ).then( 
      async user => {
        loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Recover Done! :)',
          message: "An email has been sent to reset your password. Check your inbox or span!",
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
          header: 'Recover Fail :(',
          message: err.message,
          buttons: ['OK']
        });

        await alert.present();
      }
    );
  }
}
