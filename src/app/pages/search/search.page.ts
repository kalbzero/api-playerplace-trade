import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  cards: any[] = [];
  cardsBk: any[] = [
    {
      name: 'Gideon',
      status: 'NM',
      location: 'Porto Alegre/RS',
      id_owner: '2',
    },
    {
      name: 'Liliana',
      status: 'NM',
      location: 'Canoas/RS',
      id_owner: '2',
    },
    {
      name: 'Jace',
      status: 'HP',
      location: 'Esteio/RS',
      id_owner: '2',
    },
    {
      name: 'Karn',
      status: 'LP',
      location: 'Sapucaia do Sul/RS',
      id_owner: '2',
    },
    {
      name: 'Nicol Bolas',
      status: 'MP',
      location: 'São Leopoldo/RS',
      id_owner: '2',
    },
    {
      name: 'Ajani',
      status: 'LP',
      location: 'Novo Hamburgo/RS',
      id_owner: '',
    },
    {
      name: 'Nissa',
      status: 'NM',
      location: 'Nova Santa Rita/RS',
      id_owner: '',
    },
  ];
  
  constructor(
    private firestore: AngularFirestore,
    private loadingController: LoadingController,
    ) { 
    
  }

  ngOnInit() {
    this.getCardsList();
  }

  async onSearchCards($event){
    const searchTerm = $event.target.value;
    this.cards = this.cardsBk;

    // loading
    // const loading = await this.loadingController.create({
    //   cssClass: 'my-custom-class',
    //   message: 'Procurando carta...',
    //   duration: 2000
    // });
    // await loading.present();
    // loading.dismiss();

    // Termo em branco, não busca no banco
    if(!searchTerm) {
      return;
    }

    this.cards = this.cards.filter((filteredCard)=>{
      if(filteredCard.name && searchTerm) {
        return (filteredCard.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || filteredCard.location.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
      }
    });
    
  }

  private getCardsList() {
    // get id_user, do request and put the array<trade> in 
    this.cards = this.cardsBk;
  }
}
