import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavParams, PopoverController, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ServicespetService } from 'src/app/services/servicespet.service';
import { Calendar } from 'src/app/interfaces/calendar';
import { RequestService } from 'src/app/interfaces/request-service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit,OnDestroy {


  private notificationacceptservice=[];
  private notificationresponseservice=[];
  private notificationfreeservice:number;
  private requestservice: RequestService={};
  private showpop: boolean=true;
  private showfreeservice:boolean=false;
  private unlockmessageboth=[];
  private event: Calendar = {startTime: '',endTime:''};
  constructor(private navParams: NavParams,private route: Router,private authServices: AuthService,
    private popoverCtr:PopoverController,private translationservice: TranslateService,
    private servicespetServices: ServicespetService, private alertController: AlertController,
    private toastCrt: ToastController) {
    this.notificationacceptservice= this.navParams.get('value');
    this.notificationresponseservice= this.navParams.get('value2');
    this.unlockmessageboth = this.notificationacceptservice.concat(this.notificationresponseservice);
    this.notificationfreeservice= this.navParams.get('value3');
    if(this.notificationfreeservice==10){
        this.showfreeservice=true;
    }
  
   }

  ngOnInit() {
    
  }
  ngOnDestroy(): void {
   this.notificationresponseservice=[];
   this.notificationacceptservice=[];
  }
  async calendar(){
    const popover=await this.popoverCtr.dismiss({
      component: NotificationsPage,
    });
 
    this.route.navigate(['/tabs/profile', this.authServices.getAuth().currentUser.uid]);
  }
  
  async acceptrequestservice(ev){
    this.requestservice.id=ev.id;
    this.requestservice.accept=1;
    this.event.title=ev.type+' '+ ev.location;
    this.event.startTime=new Date(ev.hoursbegin).toString();
   this.event.endTime=new Date(ev.hoursend).toString();
   this.event.userID=this.authServices.getAuth().currentUser.uid;
    await this.servicespetServices.addevents(this.event);
    await this.servicespetServices.updateRequestservice(this.requestservice,this.requestservice.id);
    for (let i = 0; i <= this.notificationacceptservice.length - 1; i++) {
      if(this.notificationacceptservice[i].id==this.requestservice.id){
           this.notificationacceptservice.splice(i,1);
      
      }
    }
    if(this.notificationacceptservice.length==0){
      this.showpop=false;
    }

  }
 
  async recuserequestservice(ev){
    const alert = await this.alertController.create({
      header:  this.translationservice.instant('Profile.Service.title'),
      message: this.translationservice.instant('Notification.alert.message'),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Ok',
          handler:async  () => {
            try {
              this.requestservice.id=ev.id;
              this.requestservice.accept=2;
              await this.servicespetServices.updateRequestservice(this.requestservice,this.requestservice.id);
              for (let i = 0; i <= this.notificationacceptservice.length - 1; i++) {
                if(this.notificationacceptservice[i].id==this.requestservice.id){
                     this.notificationacceptservice.splice(i,1);
                
                }
              }
              if(this.notificationacceptservice.length==0){
                this.showpop=false;
              }
            }
            catch (error) {
              this.presentToast('erro ao apagar');
            } finally {
              
            }
          }
        }
      ]
    });
    await alert.present();
  }
  async confirmationmessage(ev,num){
    this.requestservice.id=ev.id;
    if(num==1){
      this.requestservice.confirmmessgeto=true;
    }else{
      this.requestservice.confirmmessgefrom=true;
    }
    await this.servicespetServices.updateRequestservice(this.requestservice,this.requestservice.id);
    for (let i = 0; i <= this.unlockmessageboth.length - 1; i++) {
      if(this.unlockmessageboth[i].accept==5){
           this.unlockmessageboth.slice(i,1);
      }
    }
    if(num=1){
      if(this.notificationacceptservice.length==0){
        this.showpop=false;
      }
      else{
        if(this.notificationresponseservice.length==0){
          this.showpop=false;
        }
      }
    }
    

  }
 async confirmation(ev){
    this.requestservice.id=ev.id;
    this.requestservice.accept=3;
    await this.servicespetServices.updateRequestservice(this.requestservice,this.requestservice.id);
      for (let i = 0; i <= this.notificationresponseservice.length - 1; i++) {
        if(this.notificationresponseservice[i].id==this.requestservice.id){
             this.notificationresponseservice.splice(i,1);
        }
      }
      if(this.notificationresponseservice.length==0){
        this.showpop=false;
      }
   
  }
  async cancelservice(ev){
    const alert = await this.alertController.create({
      header:  this.translationservice.instant('Profile.Service.title'),
      message: this.translationservice.instant('Notification.alert.message'),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Ok',
          handler:async  () => {
            try {
              this.requestservice.id=ev.id;
              this.requestservice.accept=4;
              await this.servicespetServices.updateRequestservice(this.requestservice,this.requestservice.id);
              for (let i = 0; i <= this.notificationresponseservice.length - 1; i++) {
                if(this.notificationresponseservice[i].id==this.requestservice.id){
                     this.notificationresponseservice.splice(i,1);
                
                }
              }
              if(this.notificationresponseservice.length==0){
                this.showpop=false;
              }
            }
            catch (error) {
              this.presentToast('erro ao apagar');
            } finally {
              
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async confirmfreeservice(){
    this.showfreeservice=false;
   
  }
  async presentToast(message: string) {
    const toast = await this.toastCrt.create({ message, duration: 2000 });
    toast.present();
  }
}
