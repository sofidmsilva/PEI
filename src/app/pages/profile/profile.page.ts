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
import { CalendarComponent } from 'ionic2-calendar/calendar';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  @ViewChild(IonSlides, { static: false }) slides: IonSlides;
  @ViewChild(CalendarComponent,{static:false}) myCal: CalendarComponent;
  event={
    title:'',
    desc:'',
    startTime:'',
    endTime:'',
  }
  minDate=new Date().toISOString();
  eventSource=[];
  calendar={
    mode:'month',
    currentDate: new Date(),
  };

  private showcalendar: string;
  public animalsPosition: number = 0;
  public animalsDifference: number = 100;
  private loading: any;
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
        this.datauser = data;
        this.showcalendar= data[0].tipeuser;
      });
    this.CommentsSubscription = this.userServices.getComments(this.authServices.getAuth().currentUser.uid).subscribe(
      data => {
        this.datacomment = data
      });
    this.typeanimals;
    this.sizeanimals;

  }

  ngOnInit() {
 this.resetEvents();
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

  buttonaddanimal(h: number) {
    if (h == 1) {
      this.showaddanimals = 1;
    }
    else {
      this.showaddanimals = 0;
    }

  }

  async addcomment() {
    await this.presentLoading();
    var to = this.router.url.split('/');
    try {
      if (this.AddComment.content !== undefined) {
        this.AddComment.from = this.authServices.getAuth().currentUser.uid;
        this.AddComment.date = new Date();
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

  addEvent(){
  let eventCopy={
    title:this.event.title,
    desc:this.event.desc,
    startTime: new Date(this.event.startTime),
    endTime: new Date(this.event.endTime),
    
}
  this.eventSource.push(eventCopy);
  this.myCal.loadEvents();
  this.resetEvents();
  }

  resetEvents(){
    this.event={
      title:'',
    desc:'',
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString()
  
    }
    console.log(this.event.endTime);
  }

  onViewTitleChanged(title){
    console.log(title);
  }

  onCurrentDateChanged(event:Date){
    console.log('current date change : ' + event);
  }

  onRangeChanged(ev){
    console.log('range changed starttime: ' + ev.startTime + ',endTime: ' + ev.endTime);
  }
 onEventSelected(event){
  console.log('Event selected:'+event.startTime + '-'+ event.endTime + ','+event.title);
  }
              
 onTimeSelected(ev){
  console.log('Selected time: ' + ev.selectedTime+',hasEvents: '+
  (ev.events !== undefined && ev.events.lenght !== 0) + ',disabled: ' + ev.disabled);
 }
}
