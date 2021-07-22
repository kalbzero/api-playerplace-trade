import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
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

  public countComp = 0; 
  public countProg = 0; 
  public countCanc = 0;
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [['Completed:' +0], ['In Progress: '+0], 'Canceled: '+0];
  public pieChartData: SingleDataSet = [0, 0, 0];
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
                if(trade.id_trade_status == '1'){
                  this.countProg++;
                } else if(trade.id_trade_status == '2'){
                  this.countComp++;
                } else if(trade.id_trade_status == '3') {
                  this.countCanc++;
                }
              })
            }
          });
          this.firebaseService.getMyTradesSeller(this.user.uid).subscribe({
            next: (trades: any) => {
              trades.forEach( trade => { 
                this.myTrade.push({
                  id: trade.uid,
                  status:trade.id_trade_status
                })
                if(trade.id_trade_status == '1'){
                  this.countProg++;
                } else if(trade.id_trade_status == '2'){
                  this.countComp++;
                } else if(trade.id_trade_status == '3') {
                  this.countCanc++;
                }
              })
              this.updateGraphs();
            }
          });
       }
     });
  }

  private updateGraphs(){
    this.pieChartData = [this.countComp, this.countProg, this.countCanc];
    this.pieChartLabels = [['Completed:' +this.countComp], ['In Progress: '+this.countProg], 'Canceled: '+this.countCanc];
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  openChat(){
    this.firebaseService.getUserByUid(this.firebaseService.currentUser.uid).subscribe({
      next: async (user)=>{
        this.loggedUser = user;
        
        // logout destroi a sessao, ai o listener chama essa funcao, então verifico se o user existe ou não
        if(user != undefined){
          if(this.loggedUser.uid > this.anotherUser.uid){
            this.chatRoomName = this.loggedUser.uid + this.anotherUser.uid;
            this.openRoomChat();
          } else if(this.loggedUser.uid < this.anotherUser.uid) {
            this.chatRoomName = this.anotherUser.uid + this.loggedUser.uid;
            this.openRoomChat();
          } else {
            const alert = await this.alertController.create({
              header: "You don't have friends to talk?",
              message: "You can't create a room chat with yourself!",
              buttons: [
                {
                  text: 'OK',
                  handler: () => {
                    alert.dismiss();
                  }
                },
              ]
            });
            await alert.present();
          }
        }
      }
    });
  }
  openRoomChat(){
    this.firebaseService.getChatRoomById(this.chatRoomName).subscribe({
      next: (chatRoom: any)=>{
        console.log('Aqui:',chatRoom);
        if(chatRoom == undefined){
          const obj = {
            name: this.chatRoomName,
            uid: '',
            anotherUser: this.anotherUser.displayName,
            loggedUser: this.loggedUser.displayName,
            id_anotherUser: this.anotherUser.uid,
            id_loggedUser: this.loggedUser.uid,
            messages: [{msg: 'Oi', from: this.anotherUser.uid, createdAt: ''}]
          };
          this.firebaseService.createChatRoom(obj).then(
            (uid)=>{ this.router.navigateByUrl('chat/'+uid)}
          );
        } else {
          this.router.navigateByUrl('chat/'+chatRoom.uid)
        }
        
      }
    });
  }
}
