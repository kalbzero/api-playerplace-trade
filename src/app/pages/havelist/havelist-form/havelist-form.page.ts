import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { CardService } from 'src/app/services/card.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-havelist-form',
  templateUrl: './havelist-form.page.html',
  styleUrls: ['./havelist-form.page.scss'],
})
export class HavelistFormPage implements OnInit {

  searchForm: FormGroup = new FormGroup({
    searchCard: new FormControl('', [Validators.required, ])
  });
  cardForm: FormGroup = new FormGroup({
    id_card: new FormControl({value: '', disabled: true}, [Validators.required, ]),
    name: new FormControl({value: '', disabled: true}, [Validators.required, ]),
    setName: new FormControl({value: '', disabled: true}, [Validators.required, ]),
    quality: new FormControl({value: ''}, [Validators.required, ]),
    language: new FormControl({value: ''}, [Validators.required, ]),
  });
  cards: any[] = [];
  card: any = {};
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
    
    this.card = card;
    this.isList = false;
    this.showFormAdd = true;

    this.cardForm.patchValue({
      id_card: card.multiverseid,
      name: card.name,
      setName: card.setName,
    });
  }

  onEnableButton(){
    if(this.cardForm.get('quality').value != '' && this.cardForm.get('language').value != ''){
      this.enableButton = true;
    }
  }

  async addCard(){
    const loading = await this.loadingController.create();
    await loading.present();

    let obj = {
      id_card: this.cardForm.get('id_card').value,
      name: this.cardForm.get('name').value,
      setName: this.cardForm.get('setName').value,
      id_quality: this.cardForm.get('quality').value,
      id_language: this.cardForm.get('language').value,
      type_list: '1',
      id_user: this.firebaseService.currentUser.uid
    }
    let response = this.firebaseService.addCardInList(obj);
    console.log(response);
    loading.dismiss();

    const alert = await this.alertController.create({
      header: 'Alert',
      message: "Card Added!",
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.card = {};
            this.isList = false;
            this.showFormAdd = false;
            this.enableButton = false;
          }
        },
      ]
    });
    await alert.present();
  }
}
