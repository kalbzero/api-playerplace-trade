import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Trade } from 'src/app/interfaces/trade';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.page.html',
  styleUrls: ['./search-form.page.scss'],
})
export class SearchFormPage implements OnInit {

  card: any = {};
  tradeForm: FormGroup = new FormGroup({
    trades_type: new FormControl(''),
    id_trades_type: new FormControl(''),
  });
  enableButton: boolean = false;

  constructor(
    private firebaseService: FirebaseService,
    private loadingController: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    if(this.route.snapshot.params.id){
      this.getInfosCardToTrade();
    } else {
      this.doLogin();
    }
  }

  private getInfosCardToTrade(){
    this.firebaseService.getSearchCardInfosToCreateTrade(this.route.snapshot.params.id).subscribe({
      next: (card)=>{
        this.card = card;
      }
    });
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

  onEnableButton(){
    if(this.tradeForm.get('id_trades_type').value == '1'){
      this.tradeForm.patchValue({
        trades_type: 'Postal'
      });
    } else {
      this.tradeForm.patchValue({
        trades_type: 'Presencial'
      });
    }
    this.enableButton = true;
  }

  async createTrade(){
    const loading = await this.loadingController.create();
    await loading.present();

    const obj = {
      id_card: this.card.id_card,
      card_name: this.card.name,
      collection: this.card.collection,
      quality: this.card.quality,
      trades_type: this.tradeForm.get('trades_type').value,
      id_trades_type: this.tradeForm.get('id_trades_type').value,
      status: 'progress',
      id_trade_status: '1',
      localization: '',
      obs: '',
      id_buyer: this.firebaseService.currentUser.uid,
      buyer_name: this.firebaseService.currentUser.displayName,
      buyer_status: 'progress',
      buyer_id_status: '1',
      security_postal_code_buyer: '',
      id_seller: this.card.id_user,
      seller_name: this.card.username,
      seller_status: 'progress',
      seller_id_status: '1',
      security_postal_code_seller: '',
      uid:''
    }
    
    this.firebaseService.createTrade(obj);
    loading.dismiss();

    const alert = await this.alertController.create({
      header: 'Alert',
      message: "Trade Create! Now chat with the card's owner about the trade!",
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigateByUrl('trade');
          }
        },
      ]
    });
    await alert.present();
  }
}
