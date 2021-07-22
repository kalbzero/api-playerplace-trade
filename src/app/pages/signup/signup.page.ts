import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service'; //AddressService
import { AddressService } from 'src/app/services/address.service';
// const geofire = require('geofire-common');
import * as GeoFire from "geofire-common";

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
    sex: new FormControl('', [Validators.required]),
    photo: new FormControl({value: ''}),
    street: new FormControl({value: '', disabled: true}, [Validators.required]),
    number: new FormControl({value: '', disabled: false}, [Validators.required]),
    complement: new FormControl({value: '', disabled: false}),
    cep: new FormControl({value: '', disabled: false}, [Validators.required]),
    neighboardhood: new FormControl({value: '', disabled: true}, [Validators.required]),
    city:new FormControl({value: '', disabled: true}, [Validators.required]),
    state: new FormControl({value: '', disabled: true}, [Validators.required]),
    country: new FormControl({value: '', disabled: true}, [Validators.required]),
    latitude: new FormControl({value: '', disabled: true}, [Validators.required]),
    longitude: new FormControl({value: '', disabled: true}, [Validators.required]),
    hash: new FormControl({value: ''}),
  });

  public showAddress: boolean = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private FirebaseService: FirebaseService,
    private addressService: AddressService,
  ) { }

  ngOnInit() {}

  async  signUp(){
    const loading = await this.loadingController.create();
    await loading.present();

    if(this.credentialForm.controls['photo'].value === "1"){
      this.credentialForm.patchValue({photo: "../../../assets/liliana.png"});
    } else {
      this.credentialForm.patchValue({photo: "../../../assets/gideon.png"});
    }

    this.FirebaseService.signUp(
      this.credentialForm.controls['email'].value,
      this.credentialForm.controls['password'].value,
      this.credentialForm.controls['name'].value,
      this.credentialForm.controls['sex'].value,
      this.credentialForm.controls['photo'].value,
      this.credentialForm.controls['street'].value,
      this.credentialForm.controls['number'].value,
      this.credentialForm.controls['complement'].value,
      this.credentialForm.controls['cep'].value,
      this.credentialForm.controls['neighboardhood'].value,
      this.credentialForm.controls['city'].value,
      this.credentialForm.controls['state'].value,
      this.credentialForm.controls['country'].value,
      this.credentialForm.controls['latitude'].value,
      this.credentialForm.controls['longitude'].value,
      this.credentialForm.controls['hash'].value,
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

  getCEP(){
    let cep = this.credentialForm.get('cep').value;

    if(cep.length == 8){
      this.addressService.getAddress(cep).subscribe(
        (response)=>{
          this.credentialForm.patchValue({
            street: response.logradouro,
            cep: response.cep,
            neighboardhood: response.bairro,
            city: response.localidade,
            state: response.uf,
            country: 'Brasil',
          });
        }
      );
      
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition( pos => {
          this.credentialForm.patchValue({
            latitude: ""+pos.coords.latitude,
            longitude: ""+pos.coords.longitude,
            hash: GeoFire.geohashForLocation([pos.coords.latitude, pos.coords.longitude])
          });
        });
      }
      
      this.showAddress = true;
    }
  }
}
