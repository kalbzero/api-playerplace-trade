import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Trade } from 'src/app/interfaces/trade';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-trade-form',
  templateUrl: './trade-form.page.html',
  styleUrls: ['./trade-form.page.scss'],
})
export class TradeFormPage implements OnInit {

  trade: Trade = {buyer_name:'', buyer_status: '',card_name: '',id_buyer: '', id_seller: '',id_trades_type: '',quality: '',seller_name: '',seller_status: '',status: '', id_trade_status: '',trades_type: '',uid: '',collection: '',id_card: '',localization: '',obs: '',security_postal_code_buyer: '',security_postal_code_seller: '', buyer_id_status: '', seller_id_status: ''};
  userStatus: string = '';
  useridStatus: string = '';
  userObs: string = '';
  userPostalCode: string = '';
  userLocalization: string = '';
  userIdTradeType: string = '';
  userTradeType: string = '';
  isComplete: boolean = false;
  
  constructor(
    private firebaseService: FirebaseService,
    private loadingController: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    if(this.route.snapshot.params.id){
      this.getInfosTrade();
    } else {
      this.doLogin();
    }
  }

  private async doLogin(){
    const alert = await this.alertController.create({
      header: 'You are not logged in!',
      message: "Comeback to login page!",
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
  }

  private getInfosTrade(){
    this.firebaseService.getInfosTrade(this.route.snapshot.params.id).subscribe({
      next: (trade: Trade)=>{
        this.trade = trade;
        this.isComplete = trade.status == 'complete' ? true : false;
      }
    });
  }

  async editStatus(){
    const alert = await this.alertController.create({
      header: 'Edit Status',
      inputs: [
        {
          name: 'status1',
          type: 'radio',
          label: 'In Progress',
          value: '1',
          handler: (event$) => {
            this.useridStatus = event$.value;
            this.userStatus = 'progress';
          }
        },
        {
          name: 'status2',
          type: 'radio',
          label: 'Complete',
          value: '2',
          handler: (event$) => {
            this.useridStatus = event$.value;
            this.userStatus = 'complete';
          }
        },
        {
          name: 'status3',
          type: 'radio',
          label: 'Canceled',
          value: '3',
          handler: (event$) => {
            this.useridStatus = event$.value;
            this.userStatus = 'canceled';
          }
        }        
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.alertController.dismiss();
          }
        },
        {
          text: 'OK',
          handler: () => {
            this.alertController.dismiss();
            this.updateTrade();
          }
        },
      ]
    });

    await alert.present();
  }

  async editInfos(){
    if(this.trade.id_seller == this.firebaseService.currentUser.uid){
      this.userPostalCode = this.trade.security_postal_code_seller;
    } else {
      this.userPostalCode = this.trade.security_postal_code_buyer;
    }
    const alert = await this.alertController.create({
      header: 'Edit Infos',
      inputs: [
        {
          name: 'postalCode',
          type: 'text',
          label: 'Postal Code',
          placeholder: "Postal Code",
          value: this.userPostalCode,
        },
        {
          name: 'obs',
          type: 'textarea',
          label: 'Observation',
          placeholder: "Observations",
          value: this.trade.obs,
        }    
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.alertController.dismiss();
          }
        },
        {
          text: 'OK',
          handler: (event$) => {
            this.alertController.dismiss();
            this.userPostalCode = event$.postalCode;
            this.userObs = event$.obs;
            this.updateTrade();
          }
        },
      ]
    });

    await alert.present();
  }

  async editInfos2(){
    const alert = await this.alertController.create({
      header: 'Edit Infos',
      inputs: [
        {
          name: 'localization',
          type: 'text',
          label: 'Localization',
          placeholder: "Location",
          value: this.userLocalization,
        },
        {
          name: 'obs',
          type: 'textarea',
          label: 'Observation',
          placeholder: "Observations",
          value: this.trade.obs,
        }    
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.alertController.dismiss();
          }
        },
        {
          text: 'OK',
          handler: (event$) => {
            this.alertController.dismiss();
            this.userPostalCode = event$.postalCode;
            this.userObs = event$.obs;
            this.userLocalization = event$.localization;
            this.updateTrade();
          }
        },
      ]
    });

    await alert.present();
  }

  async editInfos3(){
    const alert = await this.alertController.create({
      header: 'Edit Infos',
      inputs: [
        {
          name: 'type1',
          type: 'radio',
          label: 'Postal',
          value: '1',
          handler: (event$) => {
            this.userIdTradeType = event$.value;
            this.userTradeType = 'postal';
          }
        },
        {
          name: 'type2',
          type: 'radio',
          label: 'Presencial',
          value: '2',
          handler: (event$) => {
            this.userIdTradeType = event$.value;
            this.userTradeType = 'presencial';
          }
        }       
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.alertController.dismiss();
          }
        },
        {
          text: 'OK',
          handler: () => {
            this.alertController.dismiss();
            this.updateTrade();
          }
        },
      ]
    });

    await alert.present();
  }

  openPerfil(uid: string){
    this.router.navigateByUrl('perfil/'+uid);
  }

  private async updateTrade(){
    const loading = await this.loadingController.create();
    await loading.present();
    const alert = await this.alertController.create({
      header: 'Update Trade',
      message: 'Trade updated!',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.alertController.dismiss();
          }
        }
      ]
    });

    if(this.trade.id_seller == this.firebaseService.currentUser.uid){
      this.trade.seller_status = this.userStatus == '' ? this.trade.seller_status : this.userStatus;
      this.trade.seller_id_status = this.useridStatus == '' ? this.trade.seller_id_status : this.useridStatus;
      this.trade.security_postal_code_seller = this.userPostalCode == '' ? this.trade.security_postal_code_seller : this.userPostalCode;
    } else {
      this.trade.buyer_status = this.userStatus == '' ? this.trade.buyer_status : this.userStatus;
      this.trade.buyer_id_status = this.useridStatus == '' ? this.trade.buyer_id_status : this.useridStatus;
      this.trade.security_postal_code_buyer = this.userPostalCode == '' ? this.trade.security_postal_code_buyer : this.userPostalCode;
    }
    if(this.trade.security_postal_code_buyer == undefined){
      this.trade.security_postal_code_buyer = '';
    }
    if(this.trade.security_postal_code_seller == undefined){
      this.trade.security_postal_code_seller = '';
    }
    if(this.trade.buyer_status == this.trade.seller_status){
      this.trade.status = this.userStatus;
    }
    if(this.trade.status == 'progress'){
      this.trade.id_trade_status = '1';
    } else if (this.trade.status == 'complete'){
      this.trade.id_trade_status = '2';
    } else {
      this.trade.id_trade_status = '3';
    }
    this.trade.obs = this.userObs == '' ? this.trade.obs : this.userObs;
    this.trade.trades_type = this.userTradeType == '' ? this.trade.trades_type : this.userTradeType;
    this.trade.id_trades_type = this.userIdTradeType == '' ? this.trade.id_trades_type : this.userIdTradeType;
    this.trade.localization = this.userLocalization == '' ? this.trade.localization : this.userLocalization;
    this.isComplete = this.trade.status == 'complete' ? true : false;

    console.log(this.trade);

    this.firebaseService.updateTrade(this.trade).then(
      (response)=>{ 
        loading.dismiss(); 
        alert.present();
      }
    );
    
  }
}
