import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PopoverController, IonTabs } from '@ionic/angular';
import { LanguagePopoverPage } from '../language-popover/language-popover.page';
import { NotificationsPage } from '../notifications/notifications.page';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { RegisterService } from 'src/app/services/register.service';
import { User } from 'src/app/interfaces/user';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ServicespetService } from 'src/app/services/servicespet.service';
import { RequestService } from 'src/app/interfaces/request-service';
import { TranslateService } from '@ngx-translate/core';
import { SettingsPage } from '../settings/settings.page';


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
  private warningdateofservice =[];
  private NotificationRatings=[];
  private NotificationRatingsOwner=[];
  private notificationfreeservice:number=0;
  private typeuser: number;
  private showpop: boolean;
  private shownotification: number;
  private numberofnotification: number;
  constructor(private authService: AuthService,
    private popoverCtr: PopoverController,
    private route: Router,
    private router:ActivatedRoute,
    private storage: Storage,
    private userServices: RegisterService,
    private servicespetServices: ServicespetService,
    private authServices: AuthService,
    private localNotifications: LocalNotifications,private translationservice: TranslateService) {
      router.params.subscribe(val => {
    this.userSubscription = this.userServices.getDataUser(this.authService.getAuth().currentUser.uid).subscribe(
      data => {
        this.typeuser = data[0].tipeuser;

      });

    this.requestSubscription = this.servicespetServices.getAllrequestservice().subscribe(
      data => {
      this.notificationacceptservice = [];
        this.notificationresponseservice = [];
        this.warningdateofservice=[];
        this.NotificationRatings=[];
        this.NotificationRatingsOwner=[];
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
            var l = new Date;
           if((this.requestservices[i].accept == 1 ||this.requestservices[i].accept == 3) &&
           ((this.startdate.split('-')[2]==(l.getUTCDate()-1).toString()) || 
           (this.startdate.split('-')[2]==(l.getUTCDate()).toString())) &&
           (this.startdate.split('-')[1]==l.toLocaleDateString().split('/')[1]) &&
           (this.startdate.split('-')[0]==l.toLocaleDateString().split('/')[2])){
            let eventCopy = {
              type: this.requestservices[i].type,
              startTime: this.requestservices[i].datebegin.split('T')[0],
              location: this.requestservices[i].location,
              shownotification: 3
            }
            this.warningdateofservice.push(eventCopy);
           }
           
           if(this.requestservices[i].done==true && this.requestservices[i].ratingto==false){
            let eventCopy = {
              type: this.requestservices[i].type,
              id: this.requestservices[i].id,
              userId: this.requestservices[i].from,
              to: this.requestservices[i].to,
              rating: this.requestservices[i].ratingto,
              shownotification: 4
            }
            this.NotificationRatings.push(eventCopy);
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
            if(this.requestservices[i].done==true && this.requestservices[i].ratingfrom==false){
              let eventCopy = {
                type: this.requestservices[i].type,
                id: this.requestservices[i].id,
                userId: this.requestservices[i].from,
                to: this.requestservices[i].to,
                rating: this.requestservices[i].ratingfrom,
                shownotification: 5
              }
              this.NotificationRatingsOwner.push(eventCopy);
             }
            if(this.requestservices[i].done==true){
              this.notificationfreeservice++;
            }
          }
          
        }

        if (this.notificationacceptservice.length != 0 || this.warningdateofservice.length!=0 
          || this.NotificationRatings.length!=0 || this.NotificationRatingsOwner.length!=0) {
          this.showpop = true;
          this.numberofnotification = this.notificationacceptservice.length + this.warningdateofservice.length+this.NotificationRatings.length
          +this.NotificationRatingsOwner.length;
        // Schedule a single notification
         this.localNotifications.schedule({
          id: 1,
          text: this.translationservice.instant('Notification.notificationphone1'),
          sound: '/src/assets/sound/just-saying.mp3',
          icon: '/src/assets/img/Logo.png',
          led: 'FF0000',
          data: { secret: 'key_data' }
          });
        } else {
          if (this.notificationresponseservice.length != 0 || this.NotificationRatings.length!=0 
            || this.NotificationRatingsOwner.length!=0) {
            this.showpop = true;
            this.numberofnotification = this.notificationresponseservice.length + this.NotificationRatings.length+this.NotificationRatingsOwner.length;
            // Schedule a single notification
         this.localNotifications.schedule({
          id: 1,
          text:this.translationservice.instant('Notification.notificationphone1'),
          sound: '/src/assets/sound/just-saying.mp3',
          icon: '/src/assets/img/Logo.png',
              led: 'FF0000',
              data: { secret: 'key_data' }
              });
          } else {
              this.showpop = false;
              this.numberofnotification = 0;  
          } 
        }
          
        if((this.notificationfreeservice%10)==0 && this.notificationfreeservice!=0){
          this.numberofnotification=this.numberofnotification + 1;
          this.showpop=true;
             // Schedule a single notification
             this.localNotifications.schedule({
              id: 1,
              text:this.translationservice.instant('Notification.notificationphone2'),
              sound: '/src/assets/sound/just-saying.mp3',
              icon: '/src/assets/img/Logo.png',
              led: 'FF0000',
              data: { secret: 'key_data' }
              });
        }
      });    
    });
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
        value3: this.notificationfreeservice, value4: this.warningdateofservice, value5: this.NotificationRatings,
        value6: this.NotificationRatingsOwner, value7: this.typeuser }
      });
      await popover.present();
    }    

  }

  async settings(ev){
   
      const popover = await this.popoverCtr.create({
        component: SettingsPage,
        event: ev,
        componentProps: { value: this.notificationacceptservice, value2: this.notificationresponseservice, 
        value3: this.notificationfreeservice, value4: this.warningdateofservice, value5: this.NotificationRatings,
        value6: this.NotificationRatingsOwner, value7: this.typeuser }
      });
      await popover.present();
     
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
