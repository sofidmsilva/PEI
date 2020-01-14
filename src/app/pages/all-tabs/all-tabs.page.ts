import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PopoverController, IonTabs } from '@ionic/angular';
import { LanguagePopoverPage } from '../language-popover/language-popover.page';
import { NotificationsPage } from '../notifications/notifications.page';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { RegisterService } from 'src/app/services/register.service';
import { User } from 'src/app/interfaces/user';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ServicespetService } from 'src/app/services/servicespet.service';
import { RequestService } from 'src/app/interfaces/request-service';


@Component({
  selector: 'app-all-tabs',
  templateUrl: './all-tabs.page.html',
  styleUrls: ['./all-tabs.page.scss'],
})
export class AllTabsPage implements OnInit, OnDestroy {

  private userSubscription: Subscription;
  public userId: string;
  private datenow: string=new Date(Date.now()).toString();
  public startdate: string;
  private requestSubscription: Subscription;
  private requestservices: Array<RequestService>;
  private notificationacceptservice = [];
  private notificationresponseservice = [];
  private notificationfreeservice:number=0;
  private typeuser: number;
  private showpop: boolean;
  private shownotification: number;
  private numberofnotification: number;
  constructor(private authService: AuthService,
    private popoverCtr: PopoverController,
    private route: Router,
    private storage: Storage,
    private userServices: RegisterService,
    private servicespetServices: ServicespetService,
    private authServices: AuthService,
    private localNotifications: LocalNotifications) {

    this.userSubscription = this.userServices.getDataUser(this.authService.getAuth().currentUser.uid).subscribe(
      data => {
        this.typeuser = data[0].tipeuser;

      });


    this.requestSubscription = this.servicespetServices.getAllrequestservice().subscribe(
      data => {
      this.notificationacceptservice = [];
        this.notificationresponseservice = [];
        this.requestservices = data;
        for (let i = 0; i <= this.requestservices.length - 1; i++) {
          if (this.requestservices[i].to == this.authService.getAuth().currentUser.uid) {
            if (this.requestservices[i].accept == 0 ||
               (this.requestservices[i].accept == 5 && this.requestservices[i].confirmmessgeto==false)) {
              let eventCopy = {
                type: this.requestservices[i].type,
                startTime: this.requestservices[i].datebegin.split('T')[0],
                endTime: this.requestservices[i].dateend.split('T')[0],
                hoursbegin: this.requestservices[i].datebegin,
                hoursend: this.requestservices[i].dateend,
                location: this.requestservices[i].location,
                id: this.requestservices[i].id,
                userId: this.requestservices[i].from,
                accept: this.requestservices[i].accept,
                finish: this.requestservices[i].confirmmessgeto,
                shownotification: 1
              }
              this.notificationacceptservice.push(eventCopy);
            }
            this.startdate=this.requestservices[i].datebegin.split('T')[0];
            this.startdate=this.requestservices[i].datebegin.split('-')[0]
           if(this.startdate.split('-')[3]==this.datenow.split(' ')[3]){

           }
            
          }
          if (this.requestservices[i].from == this.authService.getAuth().currentUser.uid) {
            if (this.requestservices[i].accept == 1 || this.requestservices[i].accept == 2 ||
              (this.requestservices[i].accept == 5 && this.requestservices[i].confirmmessgefrom==false)) {
              let eventCopy = {
                type: this.requestservices[i].type,
                startTime: this.requestservices[i].datebegin.split('T')[0],
                endTime: this.requestservices[i].dateend.split('T')[0],
                location: this.requestservices[i].location,
                accept: this.requestservices[i].accept,
                id: this.requestservices[i].id,
                finish: this.requestservices[i].confirmmessgefrom,
                shownotification: 2
              }

              this.notificationresponseservice.push(eventCopy);
            }
            if(this.requestservices[i].done==true){
              this.notificationfreeservice++;
            }
          }

        }

        if (this.notificationacceptservice.length != 0) {
          this.showpop = true;
          this.numberofnotification = this.notificationacceptservice.length;
        } else {
          if (this.notificationresponseservice.length != 0) {
            this.showpop = true;
            this.numberofnotification = this.notificationresponseservice.length;
          } else {
            this.showpop = false;
            this.numberofnotification = 0;
          }
          if(this.notificationfreeservice==10){
            this.numberofnotification=this.numberofnotification + 1;
          }
        }
      });
      console.log(new Date(Date.now()))
      console.log(this.startdate)
   
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.requestSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  async notification(ev) {
    if (this.showpop == true) {
      const popover = await this.popoverCtr.create({
        component: NotificationsPage,
        event: ev,
        componentProps: { value: this.notificationacceptservice, value2: this.notificationresponseservice, 
          value3: this.notificationfreeservice }
      });
      await popover.present();
    }

    // Schedule a single notification
    this.localNotifications.schedule({
      id: 1,
      text: 'Single ILocalNotification',
      sound: 'file://sound.mp3',
      data: { secret: 'key_data' }
    });
  }
  searchuser() {
    this.userId = this.authService.getAuth().currentUser.uid;
    this.route.navigate(['/tabs/profile', this.userId]);
  }
  async logout() {
    try {
      await this.authService.logout();
      this.ngOnDestroy();
      this.storage.remove('currentActiveUser')

    } catch (error) {
      console.error(error);
    }
  }
  async openlanguages(ev) {
    const popover = await this.popoverCtr.create({
      component: LanguagePopoverPage,
      event: ev
    });
    await popover.present();
  }



}
