import { Injectable } from '@angular/core';
import { AngularFireAuth} from '@angular/fire/auth';
import { AngularFirestore} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import * as firebase from 'firebase/app';

import { User } from '../interfaces/user';
import { Message } from '../interfaces/message';
// https://firebase.google.com/docs/auth/web/manage-users?hl=pt-br

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  currentUser: User = null;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
  ) { 
    this.afAuth.onAuthStateChanged(
      (user) => { 
        // console.log(user);
        this.currentUser = user;
      }
    );
  }

  async signUp(email: string, password: string, displayName: string, sex: string,
    street: string, number: string, complement: string, neighboardhood: string, city: string, state: string, country: string, 
    cep: string, latitude: string, longitude: string){

    const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);

    console.log(credential);
    var user = this.afAuth.currentUser;
    (await user).updateProfile({
      displayName: displayName,
    }).then(
      (response)=>{
        return this.afs.doc(`users/${credential.user.uid}`).set({ 
          uid: credential.user.uid, 
          email: credential.user.email, 
          displayName: credential.user.displayName,
          street,
          number,
          sex,
          complement,
          cep,
          neighboardhood,
          city,
          state,
          country,
          latitude,
          longitude
        });
      }
    ).catch(
      (error)=>{console.log(error)}
    );
    
  }

  signIn(email: string, password: string){
    this.signOut();
    return this.afAuth.signInWithEmailAndPassword(email, password).then(
      (userCredential) => {
        this.currentUser = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName
        };
        // console.log(this.currentUser);
      }
    );
  }

  signOut(){
    return this.afAuth.signOut();
  }

  recoverPassword(email: string){
    return this.afAuth.sendPasswordResetEmail(email);
  }
  
  // Chat
  addChatMessage(msg){
    return this.afs.collection('messages').add({
      msg: msg,
      from: this.currentUser.uid,
      createdAt: firebase.default.firestore.FieldValue.serverTimestamp()
    });
  }

  getUsers() {
    return this.afs.collection('users').valueChanges({ idField: 'uid'}) as Observable<User[]>
  }

  getUsersForMsg(msgFromId, users: User[]): string {
    for(let usr of users){
      if(usr.uid == msgFromId){
        return usr.email;
      }
    }
  }

  getChatMessages() { //mudar para pegar só a sala 1-1
    let users: User[];
    return this.getUsers().pipe(
      switchMap(res => {
        users = res;
        return this.afs.collection<Message>('messages', ref => ref.orderBy('createdAt')).valueChanges({ idField: 'id'});
      }),
      map(messages => {
        for(let m of messages){ 
          m.fromName = this.getUsersForMsg(m.from, users);
          m.myMsg = this.currentUser.uid === m.from;
        }
        return messages;
      })
    );
  }

  // Havelist & Wantlist
  addCardInList(card: any){
    return this.afs.collection('user-cards').add(card);
  }

  getHavelist(){
    return this.afs.collection('user-cards')
  }

  getWantlist(){
    return this.afs.collection('user-cards', (ref) => ref.where('id_user','==',''))
  }
}
