import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.page.html',
  styleUrls: ['./trade.page.scss'],
})
export class TradePage implements OnInit {

  myTrades: any[] = [];
  myTradesBK: any[] = [
    {
      cardName: 'Gideon',
      status: 'Completed',
      otherUser: 'Fulano',
    },
    {
      cardName: 'Liliana',
      status: 'Completed',
      otherUser: 'Ciclano',
    },
    {
      cardName: 'Jace',
      status: 'In Progress',
      otherUser: 'Beltrano',
    },
    {
      cardName: 'Karn',
      status: 'Completed',
      otherUser: 'Outroano',
    },
    {
      cardName: 'Nicol Bolas',
      status: 'Canceled',
      otherUser: 'Doutorano',
    },
    {
      cardName: 'Ajani',
      status: 'Completed',
      otherUser: 'Mestrano',
    },
    {
      cardName: 'Nissa',
      status: 'Completed',
      otherUser: 'Rataiano',
    },
  ];

  constructor() { 
    
  }

  ngOnInit() {
    this.getMyTradesList();
  }

  async onSearchCards($event){
    const searchTerm = $event.target.value;
    this.myTrades = this.myTradesBK;

    // Termo em branco, não busca no banco
    if(!searchTerm) {
      return;
    }

    this.myTrades = this.myTrades.filter((filteredCard)=>{
      if(filteredCard.cardName && searchTerm) {
        return (filteredCard.cardName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || filteredCard.otherUser.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
      }
    });
  }

  private getMyTradesList() {
    // My id_user
    this.myTrades = this.myTradesBK;
  }
}
