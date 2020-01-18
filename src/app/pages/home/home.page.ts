import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TouchSequence } from 'selenium-webdriver';
import { TranslateService } from '@ngx-translate/core';
import { LanguagePopoverPage } from '../language-popover/language-popover.page';
import { PopoverController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { RegisterService } from 'src/app/services/register.service';
import { Chart } from 'chart.js';
import { staticViewQueryIds } from '@angular/compiler';
import { ServicespetService } from 'src/app/services/servicespet.service';
import { RequestService } from 'src/app/interfaces/request-service';
import { Servicespermonths } from 'src/app/interfaces/servicespermonths';
import { User } from 'src/app/interfaces/user';
import { Services } from 'src/app/interfaces/services';

declare var google;
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  private userSubscription: Subscription;
  private requestSubscription: Subscription;
  private ServicespetSubscription: Subscription;
  private showuser: number;
  private filterUsers: Array<User>;
  private filterServicesPet = new Array<Services>();
  private requestservices: Array<RequestService>;
  private requestserviceowner: Array<RequestService>;
  private loading: any;
  public lengthrequest: number;
  public servicepermonth: Servicespermonths={};
  public requestservice: RequestService = {};
  private numberservicetodo: number;
  private numberservicetodoowner: number;
  constructor(private translateService: TranslateService,
    private router: Router,
    private userServices: RegisterService,
    private authServices: AuthService,
    private translationservice: TranslateService,
    private servicespetServices: ServicespetService,
    private loadingCtrl: LoadingController,
    private toastCrt: ToastController, private route:ActivatedRoute,private alertController: AlertController) {
      route.params.subscribe(val => {
        this.showuser = null;
        this.userSubscription = this.userServices.getDataUser(this.authServices.getAuth().currentUser.uid).subscribe(
          data => {
            this.showuser = data[0].tipeuser;
            this.userServices.setCurrentUser(data); 
          });
          this.requestSubscription = this.servicespetServices.getrequestservice(this.authServices.getAuth().currentUser.uid).subscribe(
            data => {this.numberservicetodo=0;
              this.lengthrequest = data.length;
              for (let i = 0; i <= data.length - 1; i++) {
                data[i].datebegin = data[i].datebegin.split('T')[0];
                data[i].dateend = data[i].dateend.split('T')[0];
               if(data[i].done==false){
                 this.numberservicetodo++;
               }
                if (data[i].datedone != null) {
                  data[i].datedone = data[i].datedone.split(' ')[1];
                }
              }
              this.requestservices = data;  
              if (this.showuser == 2) {      
                this.getPieChart();          
              }   
            });
            this.requestSubscription = this.servicespetServices.getrequestserviceforowner(this.authServices.getAuth().currentUser.uid).subscribe(
              data => {this.numberservicetodoowner=0;
                this.lengthrequest = data.length;
                for (let i = 0; i <= data.length - 1; i++) {
                  data[i].datebegin = data[i].datebegin.split('T')[0];
                  data[i].dateend = data[i].dateend.split('T')[0];
                 if(data[i].done==false){
                   this.numberservicetodoowner++;
                 }
                  if (data[i].datedone != null) {
                    data[i].datedone = data[i].datedone.split(' ')[1];
                  }
                }
                this.requestserviceowner = data; 
              });  
      });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.requestSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.showuser = null;
    console.log("ola")
  }

  slidesDidLoad(slides) {
    slides.startAutoplay();
  }

  searchServices(typeservice) {
    this.userSubscription = this.userServices.getAllUser().subscribe(
      data => {
        this.filterUsers = data;
        this.ServicespetSubscription = this.servicespetServices.getAllServices().subscribe(
          data => {
            this.filterServicesPet = data;
            this.filterServicesPet = this.filterServicesPet.filter(X => X.typeservice == typeservice);
            var exist = false;
        
            for(let i =this.filterUsers.length - 1; i>=0;i--){
              exist= false;
              for(let j=0; j < this.filterServicesPet.length;j++){
                if(this.filterUsers[i].id == this.filterServicesPet[j].userID){
                  exist= true;
                  break;
                }
              }
              if(!exist){
              this.filterUsers.splice(i,1);
              }
            }
            this.userServices.setUsersCollection(this.filterUsers);
            this.servicespetServices.setServiceType(typeservice);
            this.servicespetServices.setFilterServicesCollection(this.filterServicesPet);
            this.router.navigate(['tabs/home/search-services']);
          });
      });
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
   
    for (let i = 0; i <= this.lengthrequest - 1; i++) {
      console.log(this.requestservices)
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

  getPieChart() {
    this.getnumbermonths();
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
      {
        calc: "stringify",
        sourceColumn: 1,
        type: "string",
        role: "annotation"
      },
      2]);

    var options = {
      title: this.translationservice.instant('Home.totalservices') + ' ' + (new Date(Date.now()).getUTCFullYear()),
      width: 380,
      height: 350,
      bar: { groupWidth: "80%" },
      legend: { position: "none" },
    };
    var chart = new google.visualization.BarChart(document.getElementById("barchart_values"));
    chart.draw(view, options);
  }

  async servicedone(id: string) {
    await this.presentLoading();
    this.requestservice.done = true;
    this.requestservice.datedone = new Date(Date.now()).toString();
    try {
      await this.servicespetServices.updateRequestservice(this.requestservice, id);

    }
    catch (error) {
      console.error(error);
      this.presentToast(error);
    } finally {
      this.loading.dismiss();
    }

    this.loading.dismiss();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde' });
    return this.loading.present();
  }
  async presentToast(message: string) {
    const toast = await this.toastCrt.create({ message, duration: 2000 });
    toast.present();
  }
}
