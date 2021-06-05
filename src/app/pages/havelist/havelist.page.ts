import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-havelist',
  templateUrl: './havelist.page.html',
  styleUrls: ['./havelist.page.scss'],
})
export class HaveListPage implements OnInit {

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
    private alertController: AlertController
  ) { 

  }

  ngOnInit() {
    this.getMyHaveList();
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

  async onSearchCards($event){
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
