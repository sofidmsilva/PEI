import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonSlides, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Animals } from 'src/app/interfaces/animals';
import { AuthService } from 'src/app/services/auth.service';
import { AnimalsService } from 'src/app/services/animals.service';
import { Subscription } from 'rxjs';
import { RegisterService } from 'src/app/services/register.service';
import { User } from 'src/app/interfaces/user';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  @ViewChild(IonSlides, { static: false }) slides: IonSlides;

  public animalsPosition: number = 0;
  public animalsDifference: number = 100;
  private loading: any;
  private showaddanimals: number=0;
  private animals = new Array<Animals>();
  private datauser = new Array<User>();
  private animalsSubscription : Subscription;
  private userSubscription : Subscription;
  private typeanimals: Array<string>=["TypeAnimals.cat","TypeAnimals.dog","TypeAnimals.turtle","TypeAnimals.fish",
    "TypeAnimals.bird","TypeAnimals.snake","TypeAnimals.hamster"];
    
  private sizeanimals: Array<string>=["SizeAnimals.verysmall","SizeAnimals.small","SizeAnimals.medium","SizeAnimals.big"];
  private AnimalsRegister: Animals={};

  constructor( private translationservice:TranslateService,
    private router: Router,
    private authServices: AuthService,
    private loadingCtrl: LoadingController,
    private toastCrt: ToastController,
    private animalServices: AnimalsService,
    private userServices: RegisterService) {
   
    this.animalsSubscription= this.animalServices.getAnimals().subscribe(
        data => { this.animals=data;});
    /*this.userSubscription= this.userServices.getDataUser().subscribe(
          data => { 
            console.log(data);
            this.datauser=data;});*/
        
    this.typeanimals;
    this.sizeanimals;
   }

  ngOnInit() {
  }
  ngOnDestroy(){
    this.animalsSubscription.unsubscribe();
  }

  segmentChanged(event: any) {
    if (event.detail.value === "profile") {
      this.slides.slidePrev();
      this.animalsPosition += this.animalsDifference;
    }
    else {
      this.slides.slideNext();
      this.animalsPosition -= this.animalsDifference;
    }
  }

  buttonadd(h:number){
    if( h ==1){
      this.showaddanimals=1;
    }
    else{
      this.showaddanimals=0;
    }
 
  }

  async addanimal() {
    await this.presentLoading();
 
    try {
      
      this.AnimalsRegister.userID =  this.authServices.getAuth().currentUser.uid;
      await this.animalServices.addAnimal(this.AnimalsRegister); 
      this.showaddanimals=0;
    }
    catch (error) {

      this.presentToast('erro a guardar');
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
