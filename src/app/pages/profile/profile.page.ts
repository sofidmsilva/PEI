import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonSlides, LoadingController, ToastController, AlertController, ModalController } from '@ionic/angular';
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
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { RequestService } from 'src/app/interfaces/request-service';
import { Favorites } from 'src/app/interfaces/favorites';
import { Filters } from 'src/app/interfaces/filters';
import { Ratings } from 'src/app/interfaces/ratings';
import { Storage } from '@ionic/storage';




@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit,OnDestroy {

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

  private showuser: number;
  private showwiconfav: boolean;
  private showusertabs: number;
  private ispremium: boolean;
  private stars: string[] = [];
  private length: number;
  private filters : Filters = {};
  public animalsPosition: number = 0;
  public animalsDifference: number = 100;
  public imagem;
  private alldatauser: string;
  private allanimalsphoto: string;
  private calendarevent = new Array<Calendar>();
  private loading: any;
  private disabled: boolean = true;
  private editshow: boolean = true;
  private enableeditservice: boolean=true;
  private enableeditanimal: boolean=true;
  private editimage: boolean = true;
  private experience: Array<string> = ["<1", "<5", ">5"];
  private showaddanimals: number = 0;
  private animals = new Array<Animals>();
  private servicesPet = new Array<Services>();
  private datauser = new Array<User>();
  private dataratings = new Array<Ratings>();
  public NewUser;
  public userRegister: User = {};
  private datacomment = new Array<Comments>();
  private datafavorites = new Array<Favorites>();
  private animalsSubscription: Subscription;
  private userSubscription: Subscription;
  private CommentsSubscription: Subscription;
  private ServicespetSubscription: Subscription;
  private CalendarPetSubscription: Subscription;
  private FavoritesSubscription: Subscription;
  private RatingSubscription: Subscription;
  private typeanimals: Array<string> = ["TypeAnimals.cat", "TypeAnimals.dog", "TypeAnimals.turtle", "TypeAnimals.fish",
    "TypeAnimals.bird", "TypeAnimals.snake", "TypeAnimals.hamster"];
  private sizeanimals: Array<string> = ["SizeAnimals.verysmall", "SizeAnimals.small", "SizeAnimals.medium", "SizeAnimals.big"];
  private typeservices: Array<string> = ["Pet Walking", "Pet Care", "Pet Sitting"];
  private typeservicefromuser =[];
  private AnimalsRegister: Animals = {};
  private requestservice: RequestService={};
  private AddComment: Comments = {};
  private Favorites: Favorites={};
  private liked: boolean=false ;
  private Services: Services = {};
  private event: Calendar = {startTime: '',endTime:''};
  public profileid = this.router.url.split('/');
  public displayPromotionTag:boolean
  requsitedServicesSize: number;
  constructor(private translationservice: TranslateService,
    private router: Router,
    private authServices: AuthService,
    private loadingCtrl: LoadingController,
    private toastCrt: ToastController,
    private animalServices: AnimalsService,
    private userServices: RegisterService,
    private afStorage: AngularFireStorage,
    private servicespetServices: ServicespetService,
    private afs: AngularFirestore,
    private alertController: AlertController,
    public modalController: ModalController,
    private storage: Storage) {

    this.animalsSubscription = this.animalServices.getAnimals(this.profileid[3]).subscribe(
      data => {
        this.animals = data;
      });
      
    this.userSubscription = this.userServices.getDataUser(this.profileid[3]).subscribe(
      data => {this.datauser=[];
        this.stars=[];
        data[0].dateofbirthday = data[0].dateofbirthday.split('T')[0];
        this.datauser = data;
    
        this.alldatauser = data[0].image;
        if(this.profileid[3]==this.authServices.getAuth().currentUser.uid){
          this.showuser = data[0].tipeuser;
          this.showusertabs= data[0].tipeuser;
          this.showwiconfav=false;
        }else{
          if(data[0].tipeuser==1){
            this.showuser= 2;
            this.showusertabs= data[0].tipeuser;
            this.showwiconfav=true;
          }else{
            this.showuser=1;
            this.showusertabs= data[0].tipeuser;
            this.showwiconfav=true;
          }
        }
        this.ispremium= data[0].premium;
      });
    this.CommentsSubscription = this.userServices.getComments(this.profileid[3]).subscribe(
      data => {
        this.datacomment = data
      });
      this.FavoritesSubscription = this.userServices.getFavorites(this.profileid[3]).subscribe(
        data => {this.datafavorites=[];
            this.datafavorites = data
            if(this.datafavorites[0] != null){
              this.liked= this.datafavorites[0].liked;
            }else{
              this.liked=false;
            }

        });
    this.ServicespetSubscription = this.servicespetServices.getServices(this.profileid[3]).subscribe(
      data => { this.typeservicefromuser=[];
        this.servicesPet = data
        for(let i = 0; i <= this.servicesPet.length-1; i++){
          this.typeservicefromuser[i]=this.servicesPet[i].typeservice;
        }
      });
      
    this.CalendarPetSubscription = this.servicespetServices.getevents(this.profileid[3]).subscribe(
      data => {this.eventSource=[];
        this.calendarevent = data
        for(let i = 0; i <= this.calendarevent.length - 1; i++){
          
          let eventCopy = {
            title: this.calendarevent[i].title,
            startTime: new Date(this.calendarevent[i].startTime),
            endTime: new Date(this.calendarevent[i].endTime),   
            
          }
        this.eventSource.push(eventCopy);
        this.myCal.loadEvents();
       
      }      
      
      });

      this.RatingSubscription = this.userServices.getRatings(this.profileid[3]).subscribe(
        data => { this.dataratings=[];
          this.dataratings = data
          this.length=this.dataratings.length;
           var soma = 0;
          for(let i = 0; i <= this.dataratings.length-1; i++){
           soma= this.dataratings[i].value +++ soma;
          }
          var finalyrating = soma/this.dataratings.length;
          for(let i =0; i<finalyrating; i++){
            this.stars.push("star");
          }         
        });

    this.typeanimals;
    this.sizeanimals;
    this.typeservices;
  }

  ngOnInit() {
    this.resetEvents();
    this.NewUser = this.authServices.getAuth().currentUser.uid;
    this.countRequisitedServices();

  }

  ngOnDestroy() {
    this.animalsSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.CommentsSubscription.unsubscribe();
    this.ServicespetSubscription.unsubscribe();
    this.CalendarPetSubscription.unsubscribe();
    this.FavoritesSubscription.unsubscribe();
    this.RatingSubscription.unsubscribe();
    this.animals=[];
    this.datauser = [];
    this.alldatauser = null;
    this.showuser = null;
    this.ispremium= null;
    this.datacomment=[];
    this.servicesPet = [];
    this.typeservicefromuser=[];
  }


  editdata(id:number) {
    if(id==1){
      this.disabled = false;
      this.editshow = false;
    }
    else{
      if(id==2){
        this.editimage = false;
      }
      else{
        if(id==3){
          this.enableeditservice=false;
        }
        else{
          this.enableeditanimal=false;
        }
       
      }
    }
    
  }

  Canceledition(id:number) {
    if(id==1){
    this.disabled = true;
    this.editshow = true;
    this.userRegister = {};
  }else{
    if(id==2){
      this.editimage = true;
    }
    else{
      if(id==3){
        this.enableeditservice=true;
      }else{
        this.enableeditanimal=true;
      }

    }
  }

  }

  async Updateprofile() {
    await this.presentLoading();

    try {
      await this.userServices.updateUser(this.userRegister, this.NewUser);
      this.disabled = true;
      this.editshow = true;
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
    
    this.loading.dismiss();
  }
  async AddFavorites(){
    var to = this.router.url.split('/');
    try {
      this.Favorites.from = this.authServices.getAuth().currentUser.uid;
        this.Favorites.to = to[3];
        this.Favorites.liked=true;
        await this.userServices.addfavorites(this.Favorites);
 
    }
    catch (error) {

      console.error(error);
      this.presentToast('erro a guardar');
    }
  }

  async RemoveFavorites(){
    var fav = this.router.url.split('/');
    for(let i = 0; i <= this.datafavorites.length - 1; i++){
       if((fav[3] == this.datafavorites[i].to) && (this.NewUser==this.datafavorites[i].from)){
         var remove = this.datafavorites[i].id;
       }
    }
    try {
      await this.userServices.deletefavorites(remove);
    }
    catch (error) {
      console.error(error);
      this.presentToast('erro ao apagar');
    }
    this.liked =false;
  }
  async deletecomment(id: string) {
    await this.presentLoading();
    try {
      await this.userServices.deleteComment(id);
    }
    catch (error) {
      console.error(error)
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
      this.AnimalsRegister.image=this.allanimalsphoto;
      this.AnimalsRegister.userID = this.authServices.getAuth().currentUser.uid;
      await this.animalServices.addAnimal(this.AnimalsRegister);
      this.AnimalsRegister = {};
      this.showaddanimals = 0;
      this.allanimalsphoto="";
    }
    catch (error) {

      this.presentToast('erro a guardar');
    } finally {
      this.loading.dismiss();
    }

    this.loading.dismiss();
  }
   delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
  async updateanimal(id: string){
   
    await this.presentLoading();
    await this.delay(1000);
    try {
      if(this.allanimalsphoto!=undefined){
        this.AnimalsRegister.image= this.allanimalsphoto;
      }
      
      await this.animalServices.updateanimal(this.AnimalsRegister, id);
      this.AnimalsRegister = {};
    }
    catch (error) {
      console.error(error);
      this.presentToast(error);
    } finally {
      this.loading.dismiss();
    }
    this.enableeditanimal=true;
    this.loading.dismiss();
  }
  async deleteanimal(id:string){
    const alert = await this.alertController.create({
      header:  this.translationservice.instant('Profile.Service.title'),
      message: this.translationservice.instant('Profile.Animals.messageconfirm'),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Ok',
          handler:async  () => {
            try {
              await this.animalServices.deleteAnimal(id);
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
  async addrequestservice() {
    this.countRequisitedServices()
    const diff= +new Date(this.event.endTime)- +new Date(this.event.startTime)
    if (this.requsitedServicesSize % 10 === 0 && diff > 10800000){
      this.presentAlert();
      return;
    } else {

        await this.presentLoading();
        var to = this.router.url.split('/')
        try {

          this.requestservice.freeservice=this.requsitedServicesSize % 10 === 0 ? true : false
          this.requestservice.from = this.authServices.getAuth().currentUser.uid;
          this.requestservice.to=to[3];
          this.requestservice.accept=false;
          this.requestservice.done=false;
          this.requestservice.datebegin= this.event.startTime;
          this.requestservice.dateend=this.event.endTime;
          await this.servicespetServices.addrequestservice(this.requestservice);
          console.log(this.requestservice);
          this.requestservice = {};
          this.resetEvents();
        }
        catch (error) {

          this.presentToast('erro a guardar');
        } finally {
          this.loading.dismiss();
        }
      
      }
  
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
  async deleteservice(id: string){
    const alert = await this.alertController.create({
      header:  this.translationservice.instant('Profile.Service.title'),
      message: this.translationservice.instant('Profile.Service.messageconfirm'),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Ok',
          handler:async  () => {
            try {
              await this.servicespetServices.deleteService(id);
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
  async editservice(id: string){
   
    await this.presentLoading();

    try {
      await this.servicespetServices.editservice(this.Services, id);
      this.Services = {};
    }
    catch (error) {
      console.error(error);
      this.presentToast(error);
    } finally {
      this.loading.dismiss();
    }
    this.enableeditservice=true;
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
  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: this.translationservice.instant('Profile.premium.title'),
      subHeader:this.translationservice.instant('Profile.premium.message1'),
      message:this.translationservice.instant('Profile.premium.message2'),
      inputs: [
        {
          name: 'name1',
          type: 'number',
          placeholder: 'Dados do Cartão'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Pagar',
          handler:async () => {
            this.userRegister.premium=true;
            await this.userServices.updateUser(this.userRegister, this.NewUser);
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }
  async uploadImage(event,i?:number) {
    await this.presentLoading();
    this.imageloading = true;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);
      // para visualisar imagem
      reader.onload = (e: any) => {
        this.url = e.target.result;
      if(i==1){
     // upload da imagem para firebase
     const fileraw = event.target.files[0];
     const filePath = "/image/" + this.authServices.getAuth().currentUser.uid +"/animals"+ "/Photo/";
     const result = this.SaveImageRef(filePath, fileraw);
     const ref = result.ref;

     //criar link para download 
     result.task.then(a => {
       ref.getDownloadURL().subscribe(a => {
         this.allanimalsphoto = a;
       });

     });
        }else{
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
        }
   
      }, error => {
        alert("Error");
      }
    }
    if(i!=1){
      this.editimage = true;
    }

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

  async onEventSelected(event,id:string) {
    console.log(id,event);
    const alert = await this.alertController.create({
      header:  "Apagar evento",
      message: "Quer apagar este evento ?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Ok',
          handler:async  () => {
            try {
              await this.servicespetServices.deleteevent(event.id);
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

  onTimeSelected(ev) {
    console.log('Selected time: ' + ev.selectedTime + ',hasEvents: ' +
      (ev.events !== undefined && ev.events.lenght !== 0) + ',disabled: ' + ev.disabled);
  }

  countRequisitedServices(){
    this.storage.get('currentActiveUser').then((userToken) => {
      this.servicespetServices.countRequisitedServices(userToken).subscribe(resp=>{
        this.requsitedServicesSize = resp.size;
        
      })
    })
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Erro',
      message: 'Como está a ultilizar um serviço gratuito o periodo de requisição não pode ser superior a 3 horas',
      buttons: ['OK']
    });

    await alert.present();
  }
}
