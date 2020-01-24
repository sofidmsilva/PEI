import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RegisterService } from 'src/app/services/register.service';
import { User } from 'src/app/interfaces/user';
import { Numberusers } from 'src/app/interfaces/numberusers';
import { AngularFireAuth } from '@angular/fire/auth';
import { Servicespermonths } from 'src/app/interfaces/servicespermonths';
import { ServicespetService } from 'src/app/services/servicespet.service';
import { RequestService } from 'src/app/interfaces/request-service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
declare var google;

@Component({
  selector: 'app-overview-admin',
  templateUrl: './overview-admin.page.html',
  styleUrls: ['./overview-admin.page.scss'],
})
export class OverviewAdminPage implements OnInit {
  private userSubscription: Subscription;
  private requestSubscription: Subscription;
  public datauser = new Array<User>();
  private requestservices: Array<RequestService>;
  private numberpetsiitersowner: Numberusers={};
  public servicepermonth: Servicespermonths={};
  public lengthrequest: number;
  private showmessagepie:boolean=true;

  constructor(private userServices: RegisterService,private autg: AngularFireAuth, 
    private servicespetServices: ServicespetService,private route:ActivatedRoute,
    private translationservice: TranslateService) {
    
      route.params.subscribe(val => {
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

        this.drawChart();
      });
      this.requestSubscription = this.servicespetServices.getAllrequestservice().subscribe(
        data => {   
          this.lengthrequest = data.length;
          for (let i = 0; i <= data.length - 1; i++) {
            if (data[i].datedone != null) {
              data[i].datedone = data[i].datedone.split(' ')[1];
            }
          }
       
          this.requestservices=data;
          this.drawChartLine();
        });  
         
      });
   }

  ngOnInit() {
  }

   drawChart() {

    var data = google.visualization.arrayToDataTable([
      ['Tipo', 'numero de users'],
      ['Pet Sitter', this.numberpetsiitersowner.numberpetsitter],
      [this.translationservice.instant('Admin.owner'), this.numberpetsiitersowner.numberowneranimal]
    ]);

    var options = {
      title: this.translationservice.instant('Admin.titlepichart')
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);
  }

  getnumbermonths() {
    this.servicepermonth.Jan=0;
    this.servicepermonth.Fev=0;
    this.servicepermonth.March=0;
    this.servicepermonth.April=0;
    this.servicepermonth.May=0;
    this.servicepermonth.June=0;
    this.servicepermonth.July=0;
    this.servicepermonth.August=0;
    this.servicepermonth.September=0;
    this.servicepermonth.October=0;
    this.servicepermonth.November=0;
    this.servicepermonth.December=0;
    console.log(this.requestservices)
    for (let i = 0; i <= this.lengthrequest - 1; i++) {
      if(this.requestservices[i].done==true){
      
        switch (this.requestservices[i].datedone) {
          case 'Jan':
          this.servicepermonth.Jan++;
            break;
          case 'Fev':
            this.servicepermonth.Fev++;
            break;
          case 'Mar':
            this.servicepermonth.March++;
            break;
          case 'Apr':
            this.servicepermonth.April++;
            break;
          case 'May':
            this.servicepermonth.May++;
            break;
          case 'Jun':
            this.servicepermonth.June++;
            break;
          case 'Jul':
            this.servicepermonth.July++;
            break;
          case 'Aug':
            this.servicepermonth.August++;
            break;
          case 'Set':
            this.servicepermonth.September++;
            break;
          case 'Oct':
            this.servicepermonth.October++;
            break;
          case 'Nov':
            this.servicepermonth.November++;
            break;
          case 'Dec':
            this.servicepermonth.December++;
            break;
          default:
  
        }
      }

    }
  }
  async drawChartLine() {
    this.getnumbermonths();
    if(this.servicepermonth.Jan==0 && this.servicepermonth.Fev==0 && this.servicepermonth.March==0 && this.servicepermonth.April==0
      && this.servicepermonth.May==0 && this.servicepermonth.June==0 && this.servicepermonth.July==0 && this.servicepermonth.August==0
      && this.servicepermonth.September==0 && this.servicepermonth.October==0 && this.servicepermonth.November==0
       && this.servicepermonth.December==0){
        this.showmessagepie=false;
    }
    else{
      this.showmessagepie=true;
      var data = google.visualization.arrayToDataTable([
        [this.translationservice.instant('Home.months'), this.translationservice.instant('Home.numberservices'), { role: "style" }],
        [this.translationservice.instant('Home.january'), this.servicepermonth.Jan, "#f4c430"],
        [this.translationservice.instant('Home.february'), this.servicepermonth.Fev, "#5d8aa8"],
        [this.translationservice.instant('Home.march'), this.servicepermonth.March, "red"],
        [this.translationservice.instant('Home.april'), this.servicepermonth.April, "black"],
        [this.translationservice.instant('Home.may'), this.servicepermonth.May, "blue"],
        [this.translationservice.instant('Home.june'), this.servicepermonth.June, "yellow"],
        [this.translationservice.instant('Home.july'), this.servicepermonth.July, "orange"],
        [this.translationservice.instant('Home.august'), this.servicepermonth.August, "#702641"],
        [this.translationservice.instant('Home.september'), this.servicepermonth.September, "green"],
        [this.translationservice.instant('Home.october'), this.servicepermonth.October, "violet"],
        [this.translationservice.instant('Home.november'), this.servicepermonth.November, "#e36461"],
        [this.translationservice.instant('Home.december'), this.servicepermonth.December, "#bdb76b"]
      ]);
  
      var view = new google.visualization.DataView(data);
      view.setColumns([0, 1,
                       { calc: "stringify",
                         sourceColumn: 1,
                         type: "string",
                         role: "annotation" },
                       2]);
  
      var options = {
        title:this.translationservice.instant('Home.totalservices') + ' ' + (new Date(Date.now()).getUTCFullYear()),
        width: 350,
        height: 300,
        bar: {groupWidth: "95%"},
        legend: { position: "none" },
      };
      var chart = new google.visualization.BarChart(document.getElementById("barchart_values"));
      chart.draw(view, options);
    }
    }
   
}
