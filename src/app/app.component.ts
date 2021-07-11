import { Component } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { Menu } from './interfaces/menu';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  pages: Menu[] = [
    {title: 'Home', url: '/home'},
    {title: 'Perfil', url: '/perfil/'},
    {title: 'Search', url: '/search'},
    {title: 'Havelist', url: '/havelist'},
    {title: 'Wantlist', url: '/wantlist'},
    {title: 'My Trades', url: '/trade'},
  ];

  selectedpath: string = '';
  
  constructor(private router: Router, private firebaseService: FirebaseService) {
    if(firebaseService.currentUser == null){
      this.router.navigateByUrl('/');
    } else {
      this.router.events.subscribe(
        (event: RouterEvent)=>{
          this.selectedpath = event.url;
        }
      );
    }
    
  }

  signOut(){
    this.firebaseService.signOut().then(
      ()=>{this.router.navigateByUrl('/');}
    );

  }
}
