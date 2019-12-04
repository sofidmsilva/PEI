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
import { AngularFireStorage } from '@angular/fire/storage';
import { Services } from 'src/app/interfaces/services';
import { ServicespetService } from 'src/app/services/servicespet.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Image } from 'src/app/interfaces/image';
import { Calendar } from 'src/app/interfaces/calendar';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  @ViewChild(IonSlides, { static: false }) slides: IonSlides;
  @ViewChild(CalendarComponent, { static: false }) myCal: CalendarComponent;

  
  minDate = new Date().toISOString();
  eventSource = [];
  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };
  url: any;
  newImage: Image = {
    id: this.afs.createId(), image: ''
  }
  imageloading = false;

  private showuser: string;
  public animalsPosition: number = 0;
  public animalsDifference: number = 100;
  public imagem;
  private alldatauser: string;
  private calendarevent = new Array<Calendar>();
  private loading: any;
  private disabled: string = "true";
  private editshow: string = "true";
  private editimage: string = "true";
  private experience: Array<string> = ["<1", "<5", ">5"];
  private showaddanimals: number = 0;
  private animals = new Array<Animals>();
  private servicesPet = new Array<Services>();
  private datauser = new Array<User>();
  public NewUser;
  public userRegister: User = {};
  private datacomment = new Array<Comments>();
  private animalsSubscription: Subscription;
  private userSubscription: Subscription;
  private CommentsSubscription: Subscription;
  private ServicespetSubscription: Subscription;
  private CalendarPetSubscription: Subscription;
  private typeanimals: Array<string> = ["TypeAnimals.cat", "TypeAnimals.dog", "TypeAnimals.turtle", "TypeAnimals.fish",
    "TypeAnimals.bird", "TypeAnimals.snake", "TypeAnimals.hamster"];
  private sizeanimals: Array<string> = ["SizeAnimals.verysmall", "SizeAnimals.small", "SizeAnimals.medium", "SizeAnimals.big"];
  private typeservices: Array<string> = ["Pet Walking", "Pet Care", "Pet Sitting"];
  private AnimalsRegister: Animals = {};
  private AddComment: Comments = {};
  private Services: Services = {};
  private event: Calendar = {startTime: '',endTime:''};

  constructor(private translationservice: TranslateService,
    private router: Router,
    private authServices: AuthService,
    private loadingCtrl: LoadingController,
    private toastCrt: ToastController,
    private animalServices: AnimalsService,
    private userServices: RegisterService,
    private afStorage: AngularFireStorage,
    private servicespetServices: ServicespetService,
    private afs: AngularFirestore) {

    this.animalsSubscription = this.animalServices.getAnimals(this.authServices.getAuth().currentUser.uid).subscribe(
      data => {
        this.animals = data;
      });
    this.userSubscription = this.userServices.getDataUser(this.authServices.getAuth().currentUser.uid).subscribe(
      data => {
        data[0].dateofbirthday = data[0].dateofbirthday.split('T')[0];
        this.datauser = data;
        this.alldatauser = data[0].image;
        this.showuser = data[0].tipeuser;
      });
    this.CommentsSubscription = this.userServices.getComments(this.authServices.getAuth().currentUser.uid).subscribe(
      data => {
        this.datacomment = data
      });
    this.ServicespetSubscription = this.servicespetServices.getServices(this.authServices.getAuth().currentUser.uid).subscribe(
      data => {
        this.servicesPet = data
      });
    this.CalendarPetSubscription = this.servicespetServices.getevents(this.authServices.getAuth().currentUser.uid).subscribe(
      data => {this.eventSource=[];
        this.calendarevent = data
        for(let i = 0; i <= this.calendarevent.length - 1; i++){
          let eventCopy = {
            title: this.calendarevent[i].title,
            startTime: new Date(this.calendarevent[i].startTime),
            endTime: new Date(this.calendarevent[i].endTime)      
          }
  console.log( this.calendarevent,"dd");
        this.eventSource.push(eventCopy);
        this.myCal.loadEvents();
  }      
      
      });

    this.typeanimals;
    this.sizeanimals;
    this.typeservices;

  }

  ngOnInit() {
    this.resetEvents();
    this.NewUser = this.authServices.getAuth().currentUser.uid;
  }

  ngOnDestroy() {
    this.animalsSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.CommentsSubscription.unsubscribe();
    this.ServicespetSubscription.unsubscribe();
    this.CalendarPetSubscription.unsubscribe();
  }

  editprofile() {
    this.disabled = "false";
    this.editshow = "false";
  }
  editPhoto() {
    this.editimage = "false";
  }
  cancelphoto() {
    this.editimage = "true";
  }
  Canceledition() {
    this.disabled = "true";
    this.editshow = "true";
    this.userRegister = {};
  }
  async Updateprofile() {
    await this.presentLoading();

    try {
      await this.userServices.updateUser(this.userRegister, this.NewUser);
      this.disabled = "true";
      this.editshow = "true";
      this.userRegister = {};
    }
    catch (error) {
      console.error(error);
      this.presentToast(error);
    } finally {
      this.loading.dismiss();
    }

    this.loading.dismiss();
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
      this.AnimalsRegister = {};
      this.showaddanimals = 0;
    }
    catch (error) {

      this.presentToast('erro a guardar');
    } finally {
      this.loading.dismiss();
    }

    this.loading.dismiss();
  }

  async addservice() {
    await this.presentLoading();
    try {
      this.Services.userID = this.authServices.getAuth().currentUser.uid;
      await this.servicespetServices.addservices(this.Services);
      this.Services = {};
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

  async addEvent() {
    let eventCopy = {
      title: this.event.title,
      startTime: new Date(this.event.startTime),
      endTime: new Date(this.event.endTime)


    }
    this.eventSource.push(eventCopy);
    this.event.userID=this.NewUser;
    await this.servicespetServices.addevents(this.event);
    this.myCal.loadEvents();
    this.resetEvents();
  }

  resetEvents() {
    this.event = {
      title: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString()
    }
  }


  async uploadImage(event) {
    await this.presentLoading();
    this.imageloading = true;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);
      // para visualisar imagem
      reader.onload = (e: any) => {
        this.url = e.target.result;

        // upload da imagem para firebase
        const fileraw = event.target.files[0];
        const filePath = "/image/" + this.authServices.getAuth().currentUser.uid + "/profile/";
        const result = this.SaveImageRef(filePath, fileraw);
        const ref = result.ref;


        //criar link para download 

        result.task.then(a => {
          ref.getDownloadURL().subscribe(a => {
            this.alldatauser = a;
            this.UpdateRecord(this.alldatauser);
          });

        });
      }, error => {
        alert("Error");
      }
    }
    this.editimage = "true";
    this.loading.dismiss();
  }
  UpdateRecord(user) {
    let record = {};
    record['image'] = user;
    this.userServices.updateUser(record, this.authServices.getAuth().currentUser.uid);
  }

  SaveImageRef(filePath, file) {
    return {
      task: this.afStorage.upload(filePath, file)
      , ref: this.afStorage.ref(filePath)
    };
  }


  onViewTitleChanged(title) {
    console.log(title);
  }

  onCurrentDateChanged(event: Date) {
    console.log('current date change : ' + event);
  }

  onRangeChanged(ev) {
    console.log('range changed starttime: ' + ev.startTime + ',endTime: ' + ev.endTime);
  }
  onEventSelected(event) {
    console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
  }

  onTimeSelected(ev) {
    console.log('Selected time: ' + ev.selectedTime + ',hasEvents: ' +
      (ev.events !== undefined && ev.events.lenght !== 0) + ',disabled: ' + ev.disabled);
  }
}
