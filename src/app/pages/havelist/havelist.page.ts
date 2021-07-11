import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-havelist',
  templateUrl: './havelist.page.html',
  styleUrls: ['./havelist.page.scss'],
})
export class HaveListPage implements OnInit {

  user: User;
  cards: any[] = [];
  cardsBK: any[] = [];

  constructor(
    private alertController: AlertController,
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
    console.log("init!!!");
    if(this.user.uid != ''){
      this.getMyHaveList();
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

  async onModalDelete(uid: string) {
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
            this.alertController.dismiss();
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.onDelete(uid);
          }
        }
      ]
    });
    await alert.present();
  }

  private onDelete(uid:string) {
    this.firebaseService.deleteCardInHaveList(uid).then(
      (resp)=>{this.getMyHaveList(); console.log(resp)}
    );
  }

  private async getMyHaveList() {
    this.cards = [];
    this.cardsBK = [];
    const loading = await this.loadingController.create();
    await loading.present();

    this.firebaseService.getHavelist(this.user.uid).subscribe(
        (response: any)=>{
          console.log(response);
          response.forEach( card => {
            this.cards.push({
              name: card.name,
              status: this.getStatusCard(card.id_quality),
              id_card: card.id_card,
              uid: card.uid
            })
            this.cardsBK.push({
              name: card.name,
              status: this.getStatusCard(card.id_quality),
              id_card: card.id_card,
              uid: card.uid
            })
          });
          loading.dismiss();
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
