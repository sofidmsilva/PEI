import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterService } from 'src/app/services/register.service';
import { Subscription, Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Image } from 'src/app/interfaces/image';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-userregister',
  templateUrl: './userregister.page.html',
  styleUrls: ['./userregister.page.scss'],
})
export class UserregisterPage implements OnInit {

  private loading: any;
  private userId: string;
  private userSubscription: Subscription;
  private alldatauser:string;
  private datauser: number;
  private experience: Array<string> = ["<1","<5",">5"];
  public userRegister: User = {};
  public  NewUser;

  
  url: any;
  newImage: Image = {
    id: this.afs.createId(), image: ''
  }
  imageloading = false;

  constructor(
    private afStorage: AngularFireStorage,
    private authServices: AuthService,
    private translationservice: TranslateService,
    private userServices: RegisterService,
    private loadingCtrl: LoadingController,
    private toastCrt: ToastController,
    private afs: AngularFirestore,
    private registerServices: RegisterService,
    private router: Router) {
      this.userSubscription = this.userServices.getDataUser(this.authServices.getAuth().currentUser.uid).subscribe(
        data => {
          this.alldatauser= data[0].image;
          this.datauser = data[0].tipeuser;
        });
    }

  ngOnInit() {
    this.NewUser = this.authServices.getAuth().currentUser.uid;
  }

  uploadImage(event) {
    this.imageloading = true;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
     
      reader.readAsDataURL(event.target.files[0]);
      // para visualisar imagem
      reader.onload = (e:any) => {
        this.url = e.target.result;
      
        // upload da imagem para firebase
        const fileraw = event.target.files[0];
        const filePath = "/image/"+ this.authServices.getAuth().currentUser.uid +"/profile/" ;
        const result=this.SaveImageRef(filePath, fileraw);
        const ref=result.ref;

       
        //criar link para download 

        result.task.then(a => {
          ref.getDownloadURL().subscribe(a => {            
            this.alldatauser = a;
            this.UpdateRecord(this.alldatauser);
          });        
          
        });
      },error=>{
        alert("Error");
      }
    }
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

  async uploadinformation() {
    await this.presentLoading();
 
    try {      
        await this.registerServices.updateUser(this.userRegister,this.NewUser);
        this.router.navigate(["tabs/home"]);


    }
    catch (error) {
      console.error(error);
      this.presentToast(error);
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
