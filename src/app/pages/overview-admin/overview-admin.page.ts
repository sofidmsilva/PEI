import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RegisterService } from 'src/app/services/register.service';
import { User } from 'src/app/interfaces/user';
import { Numberusers } from 'src/app/interfaces/numberusers';
declare var google;

@Component({
  selector: 'app-overview-admin',
  templateUrl: './overview-admin.page.html',
  styleUrls: ['./overview-admin.page.scss'],
})
export class OverviewAdminPage implements OnInit {
  private userSubscription: Subscription;
  public datauser = new Array<User>();
  private numberpetsiitersowner: Numberusers={};



  constructor(private userServices: RegisterService) {
    
    this.userSubscription = this.userServices.getAllUser().subscribe(
      data => {this.numberpetsiitersowner.numberowneranimal=0;
        this.numberpetsiitersowner.numberpetsitter=0;
        this.datauser=data;   

        for(let i =0; i<this.datauser.length; i++){
         if(data[i].tipeuser==1){
           
           this.numberpetsiitersowner.numberowneranimal++;
         }
         else{
          if(data[i].tipeuser==2){
            this.numberpetsiitersowner.numberpetsitter++;
          }
         }
        }  
       
        google.charts.setOnLoadCallback(this.drawChart);
      google.charts.setOnLoadCallback(this.drawChartLine); 
      });
      console.log(this.numberpetsiitersowner)
   
 
   }

  ngOnInit() {
  }
   drawChart() {
   console.log(this.numberpetsiitersowner,2)
    var data = google.visualization.arrayToDataTable([
      ['Tipo', 'numero de users'],
      ['Pet Sitter',     4],
      ['DOno',      5]
    ]);

    var options = {
      title: 'tipo de users registados'
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);
  }
  async drawChartLine() {

    var data = google.visualization.arrayToDataTable([
      ["Element", "Density", { role: "style" } ],
      ["Copper", 8.94, "#b87333"],
      ["Silver", 10.49, "silver"],
      ["Gold", 19.30, "gold"],
      ["Platinum", 21.45, "color: #e5e4e2"]
    ]);

    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1,
                     { calc: "stringify",
                       sourceColumn: 1,
                       type: "string",
                       role: "annotation" },
                     2]);

    var options = {
      title: "Density of Precious Metals, in g/cm^3",
      width: 350,
      height: 400,
      bar: {groupWidth: "95%"},
      legend: { position: "none" },
    };
    var chart = new google.visualization.BarChart(document.getElementById("barchart_values"));
    chart.draw(view, options);
  }
}
