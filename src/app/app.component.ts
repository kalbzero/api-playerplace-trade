import { Component } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { Menu } from './interfaces/menu';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  pages: Menu[] = [
    {title: 'Home', url: '/home'},
    {title: 'Perfil', url: '/perfil'},
    {title: 'Search', url: '/search'},
    {title: 'Havelist', url: '/havelist'},
    {title: 'Wantlist', url: '/wantlist'},
    {title: 'My Trades', url: '/trade'},
    // {title: 'Tutorials', url: '/tutorial'},
  ];

  selectedpath: string = '';
  
  constructor(private router: Router) {
    this.router.events.subscribe(
      (event: RouterEvent)=>{
        this.selectedpath = event.url;
      }
    );
  }
}
