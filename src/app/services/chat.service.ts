import { Injectable } from '@angular/core';
import { AngularFireAuth} from '@angular/fire/auth';
import { AngularFirestore} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { User } from '../interfaces/user';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  currentUser: User = null;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) { 
    this.afAuth.onAuthStateChanged(
      (user) => { 
        console.log(user);
        this.currentUser = user;
      }
    );
  }

  async signUp(email: string, password: string){
    const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);

    console.log(credential);

    return this.afs.doc(`users/${credential.user.uid}`).set({ uid: credential.user.uid, email: credential.user.email});
  }

  signIn(email: string, password: string){
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  signOut(){
    return this.afAuth.signOut();
  }
}
