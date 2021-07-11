import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-wantlist',
  templateUrl: './wantlist.page.html',
  styleUrls: ['./wantlist.page.scss'],
})
export class WantlistPage implements OnInit {

  user: User;
  cards: any[] = [];
  cardsBK: any[] = [];

  constructor(
    private alertController: AlertController,
    private firebaseService: FirebaseService,
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
      this.getMyWantList();
    } else {
      this.doLogin();
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

  private getMyWantList() {
   this.firebaseService.getWantlist(this.user.uid).subscribe(
        (response: any)=>{
          console.log(response);
          response.forEach( card => {
            this.cards.push({
              name: card.name,
              status: this.getStatusCard(card.id_quality),
              id_card: card.id_card,
            })
            this.cardsBK.push({
              name: card.name,
              status: this.getStatusCard(card.id_quality),
              id_card: card.id_card,
            })
          });
          
        }
      )
  }

  private getStatusCard(status: string){
    if(status == '1'){
      return 'M';
    } else if(status == '2'){
      return 'MN';
    } else if(status == '3'){
      return 'LP';
    } else if(status == '4'){
      return 'MP';
    } else if(status == '5') {
      return 'HP';
    } else if(status == '6') {
      return 'D';
    } else {
      return '';
    }
  }

  onAddForm() {
    this.router.navigateByUrl('wantlist/wantlist-form');
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
