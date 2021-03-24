import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Message } from 'src/app/interfaces/message';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  messages: Observable<Message[]>;
  newMsg: string = '';

  constructor(
    private FirebaseService: FirebaseService,
    private router: Router
  ) { }

  ngOnInit() {
    this.messages = this.FirebaseService.getChatMessages();
  }

  sendMessage(){
    this.FirebaseService.addChatMessage(this.newMsg).then(
      () => {
        this.newMsg = '';
        this.content.scrollToBottom();
      }
    );
  }

  signOut(){
    this.FirebaseService.signOut().then(
      () => {
        this.router.navigateByUrl('/', {replaceUrl: true});
      }
    );
  }
}
