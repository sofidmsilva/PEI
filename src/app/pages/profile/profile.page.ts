import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';
import { Animals } from 'src/app/interfaces/animals';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  @ViewChild(IonSlides, { static: false }) slides: IonSlides;

  public animalsPosition: number = 0;
  public animalsDifference: number = 100;
  private showaddanimals: number = 0;
  private typeanimals: Array<string>=["TypeAnimals.cat","TypeAnimals.dog","TypeAnimals.turtle","TypeAnimals.fish",
    "TypeAnimals.bird","TypeAnimals.snake","TypeAnimals.hamster"];
    
  private sizeanimals: Array<string>=["SizeAnimals.verysmall","SizeAnimals.small","SizeAnimals.medium","SizeAnimals.big"];
  private AnimalsRegister: Animals={};

  constructor( private translationservice:TranslateService,private router: Router) {
    this.typeanimals;
    this.sizeanimals;
   }

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

  addanimal(){
    this.showaddanimals=1;
  }
  add(){
    this.showaddanimals=0;
  }

}
