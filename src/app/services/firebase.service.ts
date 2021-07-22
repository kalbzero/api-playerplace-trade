import { Injectable } from '@angular/core';
import { AngularFireAuth} from '@angular/fire/auth';
import { AngularFirestore} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import * as firebase from 'firebase/app';

import { User } from '../interfaces/user';
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

  // Login, Logout, Cadastro e Recuperação de Senha
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

  // User
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
  
  // Chat
  // https://stackoverflow.com/questions/33540479/best-way-to-manage-chat-channels-in-firebase
  getMyChatRooms1(uid: string){
    const collection = this.afs.collection('chat', (ref) => ref.where('loggedUser','==',uid));
    const chatRooms$ = collection.valueChanges().pipe(
      map( (chatRooms) => {
        return chatRooms
      })
    )
    return chatRooms$;
  }

  getMyChatRooms2(uid: string){
    const collection = this.afs.collection('chat', (ref) => ref.where('anotherUser','==',uid));
    const chatRooms$ = collection.valueChanges().pipe(
      map( (chatRooms) => {
        return chatRooms
      })
    )
    return chatRooms$;
  }

  getChatRoomById(name: string){
    const collection = this.afs.collection('chatroom', (ref) => ref.where('name','==',name));
    const chatRoom$ = collection.valueChanges().pipe(
      map( (chatRoom) => {
        return chatRoom[0]
      })
    )
    return chatRoom$;
  }

  async createChatRoom(chatRoom: any){
    const { id } = await this.afs.collection('chatroom').add(chatRoom);
    this.afs.collection('chatroom').doc(id).update({uid: id});
    return id;
  }

  getUsersForMsg(msgFromId, users: any[]): string {
    for(let usr of users){
      if(usr.uid == msgFromId){
        return usr.displayName;
      }
    }
  }

  getChatMessages(uid: string) { //mudar para pegar só a sala 1-1
    const collection = this.afs.collection('chatroom', (ref) => ref.where('uid','==',uid));
    const messages$ = collection.valueChanges().pipe(
      map( (chatroom: any) => {
        const anotherUser = {uid: chatroom[0].id_anotherUser, displayName: chatroom[0].anotherUser};
        const loggedUser = {uid: chatroom[0].id_loggedUser, displayName: chatroom[0].loggedUser};

        for(let m of chatroom[0].messages){
          m.fromName = this.getUsersForMsg(m.from, [anotherUser,loggedUser]);
          m.myMsg = this.currentUser.uid === m.from;
        }
        return chatroom[0].messages;
      })
    )
    return messages$;
    // let users: User[];
    // return this.getUsers().pipe(
    //   switchMap(res => {
    //     users = res;
    //     return this.afs.collection<Message>('messages', ref => ref.orderBy('createdAt')).valueChanges({ idField: 'id'});
    //   }),
    //   map(messages => {
    //     for(let m of messages){ 
    //       m.fromName = this.getUsersForMsg(m.from, users);
    //       m.myMsg = this.currentUser.uid === m.from;
    //     }
    //     return messages;
    //   })
    // );
  }

  addChatMessage(msg: string, chatRoom: string){
    return this.afs.collection('chatroom').doc(chatRoom).update({
      messages: firebase.default.firestore.FieldValue.arrayUnion({
        msg: msg,
        from: this.currentUser.uid,
        createdAt: firebase.default.firestore.Timestamp.now(),
      })
    });
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
    return this.afs.collection('havelist').doc(uid).delete();
  }

  async deleteCardInWantList(uid: string){
    return this.afs.collection('wantlist').doc(uid).delete();
  }

  // Search
  /**
   * Algolia - https://stackoverflow.com/questions/22506531/how-to-perform-sql-like-operation-on-firebase
   * @param cardName Nome da carta a ser procurada no banco de dados, só que o firebase não tem 'like' na consulta, a solução é usar um app terceiro como Algolia ou ElasticSearch
   * @returns lista de cartas filtradas por cidade, estado ou pais
   */
  getSearchCardsByCity(cardName: string = ''){
    const collection = this.afs.collection('havelist', (ref) => ref.where('city','==',this.currentUser.city).limit(100));
    const cards$ = collection.valueChanges().pipe(
      map( cards => {
        return cards
      })
    )
    return cards$;
  }

  getSearchCardsByState(){
    const collection = this.afs.collection('havelist', (ref) => ref.where('state','==',this.currentUser.state).limit(100));
    const cards$ = collection.valueChanges().pipe(
      map( cards => {
        return cards
      })
    )
    return cards$;
  }

  getSearchCardsByCountry(){
    const collection = this.afs.collection('havelist', (ref) => ref.where('country','==',this.currentUser.country).limit(100));
    const cards$ = collection.valueChanges().pipe(
      map( cards => {
        return cards
      })
    )
    return cards$;
  }

  getSearchCardInfosToCreateTrade(uid: string){
    const collection = this.afs.collection('havelist', (ref) => ref.where('uid','==',uid));
    const cards$ = collection.valueChanges().pipe(
      map( cards => {
        return cards[0]
      })
    )
    return cards$;
  }

  async createTrade(trade: any){
    const { id } = await this.afs.collection('trades').add(trade);
    return this.afs.collection('trades').doc(id).update({uid: id});
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

  updateTrade(trade: Trade){
    return this.afs.collection('trades').doc(trade.uid).update({
      status: trade.status,
      id_trade_status: trade.id_trade_status,
      obs: trade.obs, 
      security_postal_code_buyer: trade.security_postal_code_buyer, 
      security_postal_code_seller: trade.security_postal_code_seller,
      buyer_status: trade.buyer_status,
      seller_status: trade.seller_status,
      buyer_id_status: trade.buyer_id_status,
      seller_id_status: trade.seller_id_status,
      localization: trade.localization,
      trades_type: trade.trades_type,
      id_trades_type: trade.id_trades_type,
    });
  }
}
