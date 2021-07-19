import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { TradePageRoutingModule } from './trade-routing.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.page.html',
  styleUrls: ['./trade.page.scss'],
})
export class TradePage implements OnInit {

  myTrades: any[] = [];
  myTradesBK: any[] = [];

  constructor(private firebaseService: FirebaseService, private router: Router,) { 
    
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
    this.firebaseService.getMyTradesBuyer(this.firebaseService.currentUser.uid).subscribe({
      next: (trades: any) => { 
        trades.forEach( trade => {
          const otherUser = trade.seller_name === this.firebaseService.currentUser.displayName ? trade.buyer_name : trade.seller_name;
          console.log(otherUser, trade.buyer_name , trade.seller_name, trade);
           this.myTrades.push({
             id: trade.uid,
             cardName: trade.card_name,
             otherUser: otherUser,
             status:trade.id_trade_status
           })
         })
         
       }
     });
    this.firebaseService.getMyTradesSeller(this.firebaseService.currentUser.uid).subscribe({
      next: (trades: any)=>{
        trades.forEach( trade => {
          const otherUser = trade.seller_name === this.firebaseService.currentUser.displayName ? trade.buyer_name : trade.seller_name;
          this.myTrades.push({
            uid: trade.uid,
            cardName: trade.card_name,
            otherUser,
            status: trade.status,
          })
        })
      }
    });
    this.myTradesBK = this.myTrades;
    console.log(this.myTradesBK);
  }

  openTrade(uid: string){
    this.router.navigateByUrl('trade/trade-form/'+uid);
  }
}
