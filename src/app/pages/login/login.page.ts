import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { NativeKeyboard } from '@ionic-native/native-keyboard/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(IonSlides, { static: false }) slides: IonSlides;
  public allanimalsPosition: number = 0;
  public allanimalsDifference:number = 100;

  constructor(public nativekeyboard: NativeKeyboard) { }

  ngOnInit() {   }

  segmentChanged(event: any) {
    if (event.detail.value === "login") {
      this.slides.slidePrev();
      this.allanimalsPosition += this.allanimalsDifference;
    }
    else {
      this.slides.slideNext();
      this.allanimalsPosition -=this.allanimalsDifference;
    }

  }
}
