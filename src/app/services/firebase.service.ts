import { Injectable } from '@angular/core';
import { AngularFireAuth} from '@angular/fire/auth';
import { AngularFirestore} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import * as firebase from 'firebase/app';

import { User } from '../interfaces/user';
import { Message } from '../interfaces/message';
import { Trade } from '../interfaces/trade';
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
        this.currentUser = user;
      }
    );
  }

  // Login, Logout, Cadastro e Recuepração de Senha
  async signUp(email: string, password: string, displayName: string, sex: string, photo: string,
    street: string, number: string, complement: string, neighboardhood: string, city: string, state: string, country: string, 
    cep: string, latitude: string, longitude: string, hash: string){

    const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);

    var user = this.afAuth.currentUser;
    (await user).updateProfile({
      displayName: displayName,
    }).then(
      (response)=>{
        return this.afs.doc(`users/${credential.user.uid}`).set({ 
          uid: credential.user.uid, 
          email: credential.user.email, 
          displayName: credential.user.displayName,
          sex,
          photo,
          street,
          number,
          complement,
          cep,
          neighboardhood,
          city,
          state,
          country,
          latitude,
          longitude,
          hash
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
        this.getUserByUid(userCredential.user.uid).subscribe({
          next: (user)=>{this.currentUser = user}
        });
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

  getUserByUid(uid: string){
    const collection = this.afs.collection('users', (ref) => ref.where('uid','==',uid));
    const user$ = collection.valueChanges().pipe(
      map( (user: {}) => {
        let aux: User = user[0];
        return aux;
      })
    )
    return user$;
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
  async addCardInHavelist(card: any){
    const { id } = await this.afs.collection('havelist').add(card);
    return this.afs.collection('havelist').doc(id).update({uid: id});
  }

  async addCardInWantlist(card: any){
    const { id } = await this.afs.collection('wantlist').add(card);
    return this.afs.collection('wantlist').doc(id).update({uid: id});
  }

  getHavelist(uid: string){
    const collection = this.afs.collection('havelist', (ref) => ref.where('id_user','==',uid));
    const cards$ = collection.valueChanges().pipe(
      map( cards => {
        return cards;
      })
    )
    return cards$;
  }

  getWantlist(uid: string){
    const collection = this.afs.collection('wantlist', (ref) => ref.where('id_user','==',uid));
    const cards$ = collection.valueChanges().pipe(
      map( cards => {
        return cards;
      })
    )
    return cards$;
  }

  async deleteCardInHaveList(uid: string){
    // return this.afs.collection('havelist').doc(uid).delete();
    return await this.afs.doc(`havelist/${uid}`).delete();
  }

  async deleteCardInWantList(uid: string){
    // return this.afs.collection('wantlist').doc(uid).delete();
    return await this.afs.doc(`wantlist/${uid}`).delete();
  }

  // https://firebase.google.com/docs/firestore/solutions/geoqueries
  getSearchCards(city: string, state: string){
    const collection = this.afs.collection('havelist', (ref) => ref.where('city','==',city));
    const cards$ = collection.valueChanges().pipe(
      map( cards => {
        if(cards.length > 0){
          // Se nao tiver cartas na cidade, busca no estado
          const collection = this.afs.collection('havelist', (ref) => ref.where('state','==',state));
          const cards$ = collection.valueChanges().pipe(
            map( cards => {
              return cards;
            })
          );
          return cards$;
        }
      })
    )
    return cards$;
  }

  // Trades
  getMyTradesBuyer(uid){
    const collectionBuyer = this.afs.collection('trades', (ref) => ref.where('id_buyer','==',uid));
    const trades$ = collectionBuyer.valueChanges().pipe(
      map( tradesBuyer => {
        return tradesBuyer;
      })
    )
    return trades$;
  }

  getMyTradesSeller(uid: string){
    const collectionBuyer = this.afs.collection('trades', (ref) => ref.where('id_seller','==',uid));
    const trades$ = collectionBuyer.valueChanges().pipe(
      map( tradesSeller => {
        return tradesSeller;
      })
    )
    return trades$;
  }

  getInfosTrade(uid: string){
    const collection = this.afs.collection('trades', (ref) => ref.where('uid','==',uid));
    const trade$ = collection.valueChanges().pipe(
      map( (trade: {}) => {
        let aux: Trade = trade[0];
        return aux;
      })
    )
    return trade$;
  }

  addTrade(){

  }

  updateTrade(trade: Trade){
    return this.afs.collection('trades').doc(trade.uid).update({
      status: trade.status, 
      obs: trade.obs, 
      security_postal_code_buyer: trade.security_postal_code_buyer, 
      security_postal_code_seller: trade.security_postal_code_seller,
      buyer_status: trade.buyer_status,
      seller_status: trade.seller_status,
      buyer_id_status: trade.buyer_id_status,
      seller_id_status: trade.seller_id_status,
    });
  }
}
