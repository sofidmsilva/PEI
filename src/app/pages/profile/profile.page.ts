import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonSlides, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Animals } from 'src/app/interfaces/animals';
import { AuthService } from 'src/app/services/auth.service';
import { AnimalsService } from 'src/app/services/animals.service';
import { Subscription, VirtualTimeScheduler } from 'rxjs';
import { RegisterService } from 'src/app/services/register.service';
import { User } from 'src/app/interfaces/user';
import { Comments } from 'src/app/interfaces/comments';


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
  private Dateformat;
  private showaddanimals: number = 0;
  private animals = new Array<Animals>();
  private datauser = new Array<User>();
  private datacomment = new Array<Comments>();
  private animalsSubscription: Subscription;
  private userSubscription: Subscription;
  private CommentsSubscription: Subscription;
  private typeanimals: Array<string> = ["TypeAnimals.cat", "TypeAnimals.dog", "TypeAnimals.turtle", "TypeAnimals.fish",
    "TypeAnimals.bird", "TypeAnimals.snake", "TypeAnimals.hamster"];

  private sizeanimals: Array<string> = ["SizeAnimals.verysmall", "SizeAnimals.small", "SizeAnimals.medium", "SizeAnimals.big"];
  private AnimalsRegister: Animals = {};
  private AddComment: Comments = {};

  constructor(private translationservice: TranslateService,
    private router: Router,
    private authServices: AuthService,
    private loadingCtrl: LoadingController,
    private toastCrt: ToastController,
    private animalServices: AnimalsService,
    private userServices: RegisterService) {

    this.animalsSubscription = this.animalServices.getAnimals(this.authServices.getAuth().currentUser.uid).subscribe(
      data => {
        this.animals = data;
      });
    this.userSubscription = this.userServices.getDataUser(this.authServices.getAuth().currentUser.uid).subscribe(
      data => {
       var a= data[0].dateofbirthday.split('T');
       data[0].dateofbirthday = a[0];
        this.datauser = data
      });
    this.CommentsSubscription = this.userServices.getComments(this.authServices.getAuth().currentUser.uid).subscribe(
      data => {
        this.datacomment = data
      });
    this.typeanimals;
    this.sizeanimals;

  }

  ngOnInit() {
 
  }
  ngOnDestroy() {
    this.animalsSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.CommentsSubscription.unsubscribe();
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

  buttonadd(h: number) {
    if (h == 1) {
      this.showaddanimals = 1;
    }
    else {
      this.showaddanimals = 0;
    }

  }

  formatedDate() {
    var dateObjct = new Date();
    var year = dateObjct.getFullYear().toString();
    var month = dateObjct.getUTCMonth().toString();
    var day = dateObjct.getUTCDay().toString();
    var hours = dateObjct.getUTCHours();
    var min = dateObjct.getMinutes();

    this.Dateformat = year + '-' + month + '-' + day + ' ' + hours + ':' + min;
  }

  async addcomment() {
    await this.presentLoading();
    this.formatedDate();
    var to = this.router.url.split('/');
    try {
      if (this.AddComment.content !== undefined) {
        this.AddComment.from = this.authServices.getAuth().currentUser.uid;
        this.AddComment.date = this.Dateformat;
        this.AddComment.to = to[3];
        await this.userServices.addComments(this.AddComment);
      }
    }
    catch (error) {

      console.error(error);
      this.presentToast('erro a guardar');
    } finally {
      this.loading.dismiss();
    }
    this.AddComment.content = "";
    this.loading.dismiss();
  }

  async deletecomment(id: string) {
    await this.presentLoading();
    try {
      await this.userServices.deleteComment(id);
    }
    catch (error) {
      this.presentToast('erro ao apagar');
    } finally {
      this.loading.dismiss();
    }

    this.loading.dismiss();
  }
  async addanimal() {
    await this.presentLoading();
    console.log(this.AnimalsRegister);
    try {

      this.AnimalsRegister.userID = this.authServices.getAuth().currentUser.uid;
      await this.animalServices.addAnimal(this.AnimalsRegister);
      this.AnimalsRegister.age = "";
      this.AnimalsRegister.breed = "";
      this.AnimalsRegister.description = "";
      this.AnimalsRegister.deworming = null;
      this.AnimalsRegister.medication = "";
      this.AnimalsRegister.name = "";
      this.AnimalsRegister.size = "";
      this.showaddanimals = 0;
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
