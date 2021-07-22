import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Message } from 'src/app/interfaces/message';
import { User } from 'src/app/interfaces/user';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  user: User;
  messages: Observable<Message[]>;
  newMsg: string = '';
  chatRoom: string = '';

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
  ) { 
    if(this.firebaseService.currentUser == null){
      this.user = {displayName:'', email: '', uid: '', photo: '../../../assets/gideon.png'}
    } else {
      this.user = this.firebaseService.currentUser;
    }
  }

  ngOnInit() {
    console.log('chat',this.user.uid);
    if(this.user.uid != ''){
      this.getMessages();
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

  getMessages(){
    if(this.route.snapshot.params.id){
      this.chatRoom = this.route.snapshot.params.id;
      this.messages = this.firebaseService.getChatMessages(this.chatRoom);
    } else {
      this.doLogin();
    }
    
  }

  sendMessage(){
    this.firebaseService.addChatMessage(this.newMsg, this.chatRoom).then(
      () => {
        this.newMsg = '';
        this.content.scrollToBottom();
      }
    );
  }
}
