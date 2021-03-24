import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  credentialForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private chatService: ChatService
  ) { }

  ngOnInit() {}

  async  signUp(){
    const loading = await this.loadingController.create();
    await loading.present();

    this.chatService.signUp(
      this.credentialForm.controls['email'].value,
      this.credentialForm.controls['password'].value
      ).then( 
      async user => {
        loading.dismiss();
        const alert = await this.alertController.create({
          header: 'SignUp Done! :)',
          message: "You got it! Go to Login page!",
          buttons: ['OK']
        });

        await alert.present();
        this.router.navigateByUrl('/home');
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
