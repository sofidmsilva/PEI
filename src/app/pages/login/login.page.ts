import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController, ToastController } from '@ionic/angular';
import { NativeKeyboard } from '@ionic-native/native-keyboard/ngx';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';


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
  private loading: any;

  constructor(
    public nativekeyboard: NativeKeyboard,
    private loadingCtrl: LoadingController,
    private toastCrt: ToastController,
    private authServices: AuthService) { }

  ngOnInit() { }

  segmentChanged(event: any) {
    if (event.detail.value === "login") {
      this.slides.slidePrev();
      this.allanimalsPosition += this.allanimalsDifference;
    }
    else {
      this.slides.slideNext();
      this.allanimalsPosition -= this.allanimalsDifference;
    }
  }

 async login() {
  await this.presentLoading();

  
    try {
      await this.authServices.login(this.userLogin);
    }
    catch (error) {
      this.presentToast(error.message);
    } finally {
      this.loading.dismiss();
    }
  }

  async register() {
    await this.presentLoading();

    try {
      await this.authServices.register(this.userRegister);
    }
    catch (error) {
      let message: string;
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'Esse E-mail já está a ser usado!';
          break;

        case 'auth/invalid-email':
          message = 'E-mail inválido!';
          break;
      }
      this.presentToast(message);
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
