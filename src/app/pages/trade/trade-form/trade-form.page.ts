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

  trade: Trade;

  constructor(
    private firebaseService: FirebaseService,
    private loadingController: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
  ) { }

  ngOnInit() {

  }

  async doLogin(){
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

  getInfosTrade(){
    this.firebaseService.getInfosTrade(this.route.snapshot.params.id).subscribe({
      next: (trade: Trade)=>{
        this.trade = trade;
      }
    });
  }

  updateTrade(){
    this.router.navigateByUrl('/');
  }
}
