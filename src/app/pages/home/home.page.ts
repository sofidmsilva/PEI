import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TouchSequence } from 'selenium-webdriver';
import { TranslateService } from '@ngx-translate/core';
import { LanguagePopoverPage } from '../language-popover/language-popover.page';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RegisterService } from 'src/app/services/register.service';
import {Chart} from 'chart.js';
import { staticViewQueryIds } from '@angular/compiler';
import { ServicespetService } from 'src/app/services/servicespet.service';
import { RequestService } from 'src/app/interfaces/request-service';

declare var google;
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

requestS=[];
  private userSubscription: Subscription;
  private requestSubscription: Subscription;
  private showuser: number;
  private requestservices: Array<RequestService>;

  constructor(private translateService: TranslateService,
    private router: Router,
    private userServices: RegisterService,
    private authServices: AuthService,
    private translationservice: TranslateService,
    private servicespetServices: ServicespetService ) {

      this.userSubscription = this.userServices.getDataUser(this.authServices.getAuth().currentUser.uid).subscribe(
        data => {
          this.showuser = data[0].tipeuser;
          console.log(this.showuser)
          if(this.showuser==2){
            this.getPieChart();
          }
        });
        
        this.requestSubscription = this.servicespetServices.getrequestservice(this.authServices.getAuth().currentUser.uid).subscribe(
          data => {
            for(let i = 0; i <= data.length-1; i++){
              data[i].datebegin = data[i].datebegin.split('T')[0];
              data[i].dateend = data[i].dateend.split('T')[0];
            }

            this.requestservices = data;

          });
     }  

  ngOnInit() {
console.log("ola")
  }

  ngOnDestroy() {
    this.requestSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  slidesDidLoad(slides) {
    slides.startAutoplay();
  }

  searchServices(){
    this.router.navigate(['tabs/home/search-services']);
  }

  getPieChart(){
      var data = google.visualization.arrayToDataTable([
        [this.translationservice.instant('Home.months'), this.translationservice.instant('Home.numberservices'),{ role: "style" }],
        [this.translationservice.instant('Home.january'), 3,"#f4c430"],
          [this.translationservice.instant('Home.february'),2,"#5d8aa8"],
          [this.translationservice.instant('Home.march'), 13,"red"],
          [this.translationservice.instant('Home.april'), 12,"black"],
          [this.translationservice.instant('Home.may'), 1,"blue"],
          [this.translationservice.instant('Home.june'), 7,"yellow"],
          [this.translationservice.instant('Home.july'), 6,"orange"],
          [this.translationservice.instant('Home.august'), 15,"#702641"],
          [this.translationservice.instant('Home.september'),8,"green"],
          [this.translationservice.instant('Home.october'), 4,"violet"],
          [this.translationservice.instant('Home.november'), 2,"#e36461"],
          [this.translationservice.instant('Home.december'), 10,"#bdb76b"]
      ]);

      var view = new google.visualization.DataView(data);
      view.setColumns([0, 1,
                       { calc: "stringify",
                         sourceColumn: 1,
                         type: "string",
                         role: "annotation" },
                       2]);

      var options = {
        title: this.translationservice.instant('Home.totalservices'),
        width: 380,
        height: 350,
        bar: {groupWidth: "80%"},
        legend: { position: "none" },
      };
      var chart = new google.visualization.BarChart(document.getElementById("barchart_values"));
      chart.draw(view, options);
    }
  test(){
    console.log("yes");
  }
}
