import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

import { Menu } from '../../interfaces/menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  pages: Menu[] = [
    {title: 'Home', url: '/menu/home'},
    {title: 'Perfil', url: '/menu/perfil'},
    {title: 'Search', url: '/menu/search'},
    // {title: 'Havelist', url: '/menu/home'},
    // {title: 'Wantlist', url: '/menu/home'},
    {title: 'Lists', url: '/menu/home'},
    {title: 'Trades', url: '/menu/trade'},
    {title: 'Tutorials', url: '/menu/tutorial'},
  ];

  selectedpath: string = '';

  constructor(private router: Router) { 
    this.router.events.subscribe(
      (event: RouterEvent)=>{
        this.selectedpath = event.url;
      }
    );
  }

  ngOnInit() {
  }

}
