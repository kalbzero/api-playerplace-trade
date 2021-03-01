import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credentialForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.credentialForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  async  signUp(){
    const loading = await this.loadingController.create();
    await loading.present();

    this.chatService.signUp(
      this.credentialForm.controls['email'].value,
      this.credentialForm.controls['password'].value
      ).then( 
      user => {
        loading.dismiss();
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

  async  signIn(){
    const loading = await this.loadingController.create();
    await loading.present();

    this.chatService.signIn(
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
}
