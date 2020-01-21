import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { MessagestoTeam } from 'src/app/interfaces/messagesto-team';
import { AuthService } from 'src/app/services/auth.service';
import { MessageSupportTeamService } from 'src/app/services/message-support-team.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  private messagetoTeam: MessagestoTeam={};
  private loading: any;

  constructor(private translationservice: TranslateService, 
    private alertController: AlertController,
    private authServices: AuthService,private messageTeamSuport: MessageSupportTeamService,
    private toastCrt: ToastController,private loadingCtrl: LoadingController,private autg: AngularFireAuth) { }

  ngOnInit() {
  }
  async contactteam(){
    const alert = await this.alertController.create({
      header: this.translationservice.instant('Notification.messageconctteam'),
      subHeader:this.translationservice.instant('Notification.messageconctteam2'),
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: this.translationservice.instant('Notification.messageconctteam3')
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
         
          }
        }, {
          text: this.translationservice.instant('All.send'),
          handler:async data => {
            await this.presentLoading();
            try {
              var l= new Date();
              var b=[];
              this.messagetoTeam.from=this.authServices.getAuth().currentUser.uid;
              this.messagetoTeam.DateSend=b.concat(l.toLocaleDateString(),l.toLocaleTimeString()).toString();
              this.messagetoTeam.content= data.name1;
              await this.messageTeamSuport.addmessageTeamSuport(this.messagetoTeam);
              this.messagetoTeam={};
            }
            catch (error) {
              console.error(error);
              this.presentToast(error);
            } finally {
              this.loading.dismiss();
            }
  

          }
        }
      ]
    });

    await alert.present();
  }

  async CancelAccount(){
    const alert = await this.alertController.create({
      header: this.translationservice.instant('All.cancelAccount'),
      message: this.translationservice.instant('All.messageCancelAccount'),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Ok',
          handler: async () => {
            try {
   
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

async help(){
  const alert = await this.alertController.create({
    header: this.translationservice.instant('All.help'),
    subHeader:"Colocar aqui a informação da app",
    buttons: [
  {
        text: "Ok",
        handler:async data => {
        
        

        }
      }
    ]
  });

  await alert.present(); 
}

async changepassword(){
  this.autg.authState.subscribe(user=>{
    if(user)
         this.autg.auth.currentUser.updatePassword;
        console.log(user.emailVerified)
  });
}

async presentToast(message: string) {
    const toast = await this.toastCrt.create({ message, duration: 2000 });
    toast.present();
  }
async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde' });
    return this.loading.present();
  }
}
