import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  @ViewChild(IonSlides, { static: false }) slides: IonSlides;

  public animalsPosition: number = 0;
  public animalsDifference: number = 100;

  constructor( private translationservice:TranslateService) { }

  ngOnInit() {
  }

  segmentChanged(event: any) {
    if (event.detail.value === "profile") {
      console.log(event.detail.value);
      this.slides.slidePrev();
      this.animalsPosition += this.animalsDifference;
    }
    else {
      this.slides.slideNext();
      this.animalsPosition -= this.animalsDifference;
    }
  }

}
