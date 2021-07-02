import { Component, OnInit } from '@angular/core';
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

  public user: User;
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
    private firebaseService: FirebaseService
  ) { 
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();

    
    if(this.firebaseService.currentUser == null){
      this.user = {displayName:'', email: '', uid: '', photo: '../../../assets/gideon.png'}
    } else {
      this.user = this.firebaseService.currentUser;
    }
  }

  ngOnInit() {
    console.log(this.user);
  }

}
