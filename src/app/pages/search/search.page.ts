import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  cards: any[] = [];
  cardsBk: any[] = [];
  
  constructor(
    private loadingController: LoadingController,
    private firebaseService: FirebaseService, 
    private router: Router,
    private alertController: AlertController,
    ) { 
    
  }

  ngOnInit() {
    this.getCardsList();
  }

  async onSearchCards($event){
    const searchTerm = $event.target.value;
    this.cards = this.cardsBk;

    

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

    this.firebaseService.getSearchCardsByCity().subscribe({
      next: (cardsCity)=>{
        this.cards = [];
        this.cardsBk = [];
        if(cardsCity.length == 0){
          this.firebaseService.getSearchCardsByState().subscribe({
            next: (cardsState)=>{
              this.cards = [];
              this.cardsBk = [];
              if(cardsState.length == 0){
                this.firebaseService.getSearchCardsByCountry().subscribe({
                  next: (cardsCountry)=>{
                    this.cards = [];
                    this.cardsBk = [];
                    cardsCountry.forEach( (card: any) => {
                      this.cards.push({
                        id_card: card.id_card,
                        uid: card.uid,
                        name: card.name,
                        collection: card.collection,
                        quality: card.quality,
                        language: card.language,
                        type_list: card.type_list,
                        id_user: card.id_user,
                        city: card.city,
                        state: card.state,
                        country: card.country,
                        longitude: card.longitude,
                        latitude: card.latitude,
                        hash: card.hash,
                        location: card.state == '' ? '': card.state + '/'+ card.city,
                      });
                    });
                  }
                });
              } else {
                cardsState.forEach( (card: any) => {
                  this.cards.push({
                    id_card: card.id_card,
                    uid: card.uid,
                    name: card.name,
                    collection: card.collection,
                    quality: card.quality,
                    language: card.language,
                    type_list: card.type_list,
                    id_user: card.id_user,
                    city: card.city,
                    state: card.state,
                    country: card.country,
                    longitude: card.longitude,
                    latitude: card.latitude,
                    hash: card.hash,
                    location: card.state == '' ? '': card.state + '/'+ card.city,
                  });
                });
              }
            }
          });
        } else {
          cardsCity.forEach( (card: any) => {
            this.cards.push({
              id_card: card.id_card,
              uid: card.uid,
              name: card.name,
              collection: card.collection,
              quality: card.quality,
              language: card.language,
              type_list: card.type_list,
              id_user: card.id_user,
              city: card.city,
              state: card.state,
              country: card.country,
              longitude: card.longitude,
              latitude: card.latitude,
              hash: card.hash,
              location: card.state == '' ? '': card.state + '/'+ card.city,
            });
          });
        }
        
        this.cardsBk = this.cards;
      }
    });
  }

  async createTrade(card: any){
    if(card.id_user == this.firebaseService.currentUser.uid){
      const alert = await this.alertController.create({
        header: 'Alert',
        message: "You can't create a trade with yourself!",
        buttons: [
          {
            text: 'OK',
            handler: () => {
              alert.dismiss();
            }
          },
        ]
      });
      await alert.present();
    } else {
      this.router.navigateByUrl('search/search-form/'+card.uid);
    }
    
  }
}
