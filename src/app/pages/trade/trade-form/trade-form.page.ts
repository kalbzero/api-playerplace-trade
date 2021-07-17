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

  trade: Trade = {buyer_name:'', buyer_status: '',card_name: '',id_buyer: '', id_seller: '',id_trades_type: '',quality: '',seller_name: '',seller_status: '',status: '',trades_type: '',uid: '',collection: '',id_card: '',localization: '',obs: '',security_postal_code_buyer: '',security_postal_code_seller: ''};

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
      }
    });
  }

  async editTrade(){
    const alert = await this.alertController.create({
      header: 'Edit Status and Infos',
      inputs: [
        {
          name: 'status1',
          type: 'radio',
          label: 'In Progress',
          value: '1',
          handler: (event$) => {
            this.updateStatus(event$.value);
          }
        },
        {
          name: 'status2',
          type: 'radio',
          label: 'Complete',
          value: '2',
          handler: (event$) => {
            this.updateStatus(event$.value);
          }
        },
        {
          name: 'status3',
          type: 'radio',
          label: 'Canceled',
          value: '3',
          handler: (event$) => {
            this.updateStatus(event$.value);
          }
        },

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
            console.log(event$);
          }
        },
      ]
    });

    await alert.present();
  }

  private updateStatus(status: string){
    if(this.trade.id_seller == this.firebaseService.currentUser.uid){
      this.trade.seller_status = status;
    } else {
      this.trade.buyer_status = status;
    }
  }

  private updateTrade(){
    // this.firebaseService
  }
}
