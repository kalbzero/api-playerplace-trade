import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { Trade } from 'src/app/interfaces/trade';
import { User } from 'src/app/interfaces/user';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  public user: User = {displayName:'', email: '', uid: '', photo: '../../../assets/gideon.png'};
  public loggedUser: User = {displayName:'', email: '', uid: '', photo: '../../../assets/gideon.png'};
  public anotherUser: User = {displayName:'', email: '', uid: '', photo: '../../../assets/gideon.png'};
  private myTrade: any[] = [];
  public showChatButton: boolean = true;
  public chatRoomName: string = "";

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [['Completed:' +1], ['In Progress: '+0], 'Canceled: '+0];
  public pieChartData: SingleDataSet = [1, 0, 0];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartColors: Array<any> = [{
    backgroundColor: ['#00733d', 'yellow', '#e2192c'],
    borderColor: ['#00733d', 'yellow', '#e2192c']
  }]

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
  ) { 
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    
  }

  ngOnInit() {
    this.setCurrentPerfil();
  }

  async doLogin(){
    const alert = await this.alertController.create({
      header: 'You are not logged in!',
      message: "Comeback to login page!",
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigateByUrl('/');
          }
        },
      ]
    });

    await alert.present();
  }
  
  setCurrentPerfil(){
    if(this.firebaseService.currentUser == null){
      this.doLogin();
    } else {

      // Verificar se é o perfil do usuario logado ou do perfil do outro usuário
      if(this.route.snapshot.params.id == undefined){
        this.getUserInfos(this.firebaseService.currentUser.uid, 1);
        this.showChatButton = false;
      } else {
        this.getUserInfos(this.route.snapshot.params.id, 2);
        this.showChatButton = true;
      }
    }
  }

  getUserInfos(uid: string, type: number){
     return this.firebaseService.getUserByUid(uid).subscribe({
       next: (user)=>{
         if(type === 1){
          this.loggedUser = user;
         } else {
          this.anotherUser = user;
         }
         this.user = user;
         this.firebaseService.getMyTradesBuyer(this.user.uid).subscribe({
           next: (trades: any) => { 
             trades.forEach( trade => { 
               this.myTrade.push({
                id: trade.uid,
                status:trade.id_trade_status
               })
              })
              console.log(this.myTrade);
            }
         });
       }
     });
  }
}
