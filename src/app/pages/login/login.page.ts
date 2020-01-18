import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController, ToastController, PopoverController, NavController } from '@ionic/angular';
import { NativeKeyboard } from '@ionic-native/native-keyboard/ngx';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { LanguagePopoverPage } from '../language-popover/language-popover.page';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, VirtualTimeScheduler } from 'rxjs';
import { RegisterService } from 'src/app/services/register.service';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { send } from 'q';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
declare var H: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(IonSlides, { static: false }) slides: IonSlides;
  public allanimalsPosition: number = 0;
  public allanimalsDifference: number = 100;
  public userLogin: User = {};
  public userRegister: User = {};
  public confirmpassword: string = "";
  private loading: any;
  public position: number = 0;
  public guardposition: number = 0;
  platform: any;
  private _appId: string = 'cZhsObl98cbkEcgYHrwn';  
  private _appCode: string = 'JAkuOIaFZ4x_Zer-IbR0noK9ma5MO3BAQLfXC8wbz7s';  
  search: any;


  constructor(
    public nativekeyboard: NativeKeyboard,
    private loadingCtrl: LoadingController,
    private toastCrt: ToastController,
    private authServices: AuthService,
    private popoverCtr: PopoverController,
    private translationservice: TranslateService,
    private registerServices: RegisterService,
    public composer: EmailComposer,
    private router: Router,
    private storage: Storage,  public navCtrl: NavController ) {
    
     }
  ngOnInit() { }

  segmentChanged(event: any) {
    if (event.detail.value === 'login') {
      if (this.guardposition === 2) {
        this.slides.slidePrev();
      } else {
        this.slides.slidePrev();
        this.slides.slidePrev();
      }

      this.allanimalsPosition += this.allanimalsDifference;
    }
    else {
      this.slides.slideNext();
      this.allanimalsPosition -= this.allanimalsDifference;
    }
  }
  NextChanged(position) {
    this.guardposition = position;
    this.slides.slideNext();
  }
  PrevChanged() {
    this.slides.slidePrev();
  }
  async login() {
    await this.presentLoading();

    try {
      await this.authServices.login(this.userLogin).then((res)=>{
        this.storage.set('currentActiveUser', this.authServices.getAuth().currentUser.uid);
    });
}
    catch (error) {
    
      let message: string;
      switch (error.code) {
        case 'auth/argument-error':
          message = this.translationservice.instant('Login.errormessage.argument-error');
          break;

        case 'auth/invalid-email':
          message = this.translationservice.instant('Login.errormessage.invalidemail');
          break;
      }
      console.log(error);
      this.presentToast(error);
    } finally {
      this.loading.dismiss();
    }
  }

  async register() {
    await this.presentLoading();

    try {
      if (this.confirmpassword !== this.userRegister.password) {
        this.presentToast(this.translationservice.instant('Login.errormessage.differentpasswords'));
        return console.error("Passwords diferentes!");

      } else {
        const NewUser = await this.authServices.register(this.userRegister);
        this.userRegister.verifycode = Math.floor(Math.random() * 3000);
        if(this.userRegister.tipoutilizador==2){
          this.userRegister.premium=false;
        }
        await this.registerServices.addUser(this.userRegister, NewUser);


      }

    }
    catch (error) {
      let message: string;

      switch (error.code) {
        case 'auth/email-already-in-use':
          message = this.translationservice.instant('Login.errormessage.emailalreadyinuse');
          break;

        case 'auth/invalid-email':
          message = this.translationservice.instant('Login.errormessage.invalidemail');
          break;
      }
      this.presentToast(message);
    } finally {
      this.loading.dismiss();
    }

    this.loading.dismiss();
    this.router.navigate(['tabs/userregister']);
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde' });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCrt.create({ message, duration: 2000 });
    toast.present();
  }

  async openlanguages(ev) {
    const popover = await this.popoverCtr.create({
      component: LanguagePopoverPage,
      event: ev
    });
    await popover.present();
  }

}
