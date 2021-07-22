import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { CardService } from 'src/app/services/card.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-wantlist-form',
  templateUrl: './wantlist-form.page.html',
  styleUrls: ['./wantlist-form.page.scss'],
})
export class WantlistFormPage implements OnInit {

  searchForm: FormGroup = new FormGroup({
    searchCard: new FormControl('', [Validators.required, ])
  });
  cardForm: FormGroup = new FormGroup({
    quality: new FormControl('', [Validators.required, ]),
    language: new FormControl('', [Validators.required, ]),
  });
  cards: any[] = [];
  card: any = { id_card: '', name: '', collection: '', quality: '', language: '', type_list: '', id_user: '', username: '', city: '', state: '', longitude: '', latitude: '', hash: ''};
  isList: boolean = false;
  showFormAdd: boolean = false;
  enableButton: boolean = false;

  constructor(
    private alertController: AlertController,
    private cardService: CardService,
    private firebaseService: FirebaseService,
    private loadingController: LoadingController,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  async onSearchCardsToAdd(){
    const searchTerm = this.searchForm.get('searchCard').value;
    const loading = await this.loadingController.create();
    await loading.present();

    if(searchTerm == ''){
      loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Alert',
        message: "Card name is blank! Insert a name!",
        buttons: ['OK']
      });
      await alert.present();
    } else {
      this.cardService.searchCard(searchTerm).subscribe(
        (response: any)=>{
          this.cards = response.cards;

          this.isList = true;
          loading.dismiss();
        }
      );
    }
  }

  onGetCardInfos(card: any){
    
    this.isList = false;
    this.showFormAdd = true;

    this.card.id_card = card.multiverseid;
    this.card.name = card.name;
    this.card.collection = card.setName;
  }

  onEnableButton(){
    const quality: string = this.cardForm.controls['quality'].value;
    const language: string = this.cardForm.controls['language'].value;
    console.log(quality, language);
    if( quality != '' && language != ''){
      this.enableButton = true;
    }
  }

  async addCard(){
    const loading = await this.loadingController.create();
    await loading.present();

    
    this.card.quality = this.cardForm.get('quality').value;
    this.card.language = this.cardForm.get('language').value;
    this.card.type_list = '2';
    this.card.id_user = this.firebaseService.currentUser.uid;
    this.card.username = this.firebaseService.currentUser.displayName;
    this.card.city = this.firebaseService.currentUser.city;
    this.card.state = this.firebaseService.currentUser.state;
    this.card.country = this.firebaseService.currentUser.country;
    this.card.longitude = this.firebaseService.currentUser.longitude;
    this.card.latitude = this.firebaseService.currentUser.latitude;
    this.card.hash = this.firebaseService.currentUser.hash;
    console.log(this.card);
    this.firebaseService.addCardInWantlist(this.card);
    loading.dismiss();

    const alert = await this.alertController.create({
      header: 'Alert',
      message: "Card Added!",
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigateByUrl('wantlist');
          }
        },
      ]
    });
    await alert.present();
  }
}
