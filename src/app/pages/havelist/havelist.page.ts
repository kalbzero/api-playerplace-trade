import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { CardService } from 'src/app/services/card.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-havelist',
  templateUrl: './havelist.page.html',
  styleUrls: ['./havelist.page.scss'],
})
export class HaveListPage implements OnInit {

  user: User;
  cards: any[] = [];
  cardsBK: any[] = [
    {
      name: 'Gideon',
      status: 'NM',
      id_card: 1
    },
    {
      name: 'Liliana',
      status: 'NM',
      id_card: 1
    },
    {
      name: 'Jace',
      status: 'HP',
      id_card: 1
    },
    {
      name: 'Karn',
      status: 'LP',
      id_card: 1
    },
    {
      name: 'Nicol Bolas',
      status: 'MP',
      id_card: 1
    },
    {
      name: 'Ajani',
      status: 'LP',
      id_card: 1
    },
    {
      name: 'Nissa',
      status: 'NM',
      id_card: 1
    }
  ];

  constructor(
    private alertController: AlertController,
    private cardService: CardService,
    private firebaseService: FirebaseService,
    private loadingController: LoadingController,
    private router: Router,
  ) { 
    if(this.firebaseService.currentUser == null){
      this.user = {displayName:'', email: '', uid: '', photo: '../../../assets/gideon.png'}
    } else {
      this.user = this.firebaseService.currentUser;
    }
  }

  ngOnInit() {
    if(this.user.uid != ''){
      this.getMyHaveList();
    } else {
      // this.doLogin();
    }
    
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

  async onModalDelete(id: number) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Deletar Carta da Lista',
      message: 'Tem certeza que quer deletar carta da lista?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelou!');
            this.alertController.dismiss();
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.onDelete(id);
          }
        }
      ]
    });
    await alert.present();
  }

  private onDelete(id:number) {
    console.log('Deletou!: '+id);
  }

  private getMyHaveList() {
    // get the id_user and do request. The return is a array<card>, put in this.cardsBk
    this.cards = this.cardsBK;
  }

  onAddForm() {
    this.router.navigateByUrl('havelist/havelist-form');
  }

  async onSearchCardsIntheList($event){
    const searchTerm = $event.target.value;
    this.cards = this.cardsBK;

    // Termo em branco, não busca no banco
    if(!searchTerm) {
      return;
    }

    this.cards = this.cards.filter((filteredCard)=>{
      if(filteredCard.name && searchTerm) {
        return (filteredCard.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
      }
    });
  }
}
