import { Component, OnInit } from '@angular/core';
import {File} from '@ionic-native/file/ngx';
import { Camera,CameraOptions } from '@ionic-native/camera/ngx';
import { TranslateService } from '@ngx-translate/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterService } from 'src/app/services/register.service';
import { Subscription, Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-userregister',
  templateUrl: './userregister.page.html',
  styleUrls: ['./userregister.page.scss'],
})
export class UserregisterPage implements OnInit {

  private loading: any;
  private userId: string;
  private userSubscription: Subscription;
  private datauser: number;
  private experience: Array<string> = ["<1","<5",">5"];
  public userRegister: User = {};
  public  NewUser;
  public downloadUrl: Observable<string>;
  private currentImage;
  constructor(private file: File, private camera: Camera,
    private afStorage: AngularFireStorage,
    private authServices: AuthService,
    private translationservice: TranslateService,
    private userServices: RegisterService,
    private loadingCtrl: LoadingController,
    private toastCrt: ToastController,
    private registerServices: RegisterService,
    private router: Router) {
      this.userSubscription = this.userServices.getDataUser(this.authServices.getAuth().currentUser.uid).subscribe(
        data => {
          this.datauser = data[0].tipeuser;
        });
    }

  ngOnInit() {
    this.NewUser = this.authServices.getAuth().currentUser.uid;
  }

  async uploadimage(){
    await this.presentLoading();
    const options: CameraOptions ={
      quality:100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation:true
    };
    try{
      const fileUri: string = await this.camera.getPicture(options);
      let file: string;
      file = fileUri.substring(fileUri.lastIndexOf('/') + 1, fileUri.indexOf('?'));
      const path: string = fileUri.substring(0, fileUri.lastIndexOf('/'));

      const buffer: ArrayBuffer =await this.file.readAsArrayBuffer(path,file);

      const blob: Blob= new Blob([buffer],{type:'image/jpeg'});
      this.uploadpicture(blob);
      this.loading.dismiss();
    }catch(error){
      console.error(error);
    }
  }


  uploadpicture(blob: Blob){
     this.userId= this.authServices.getAuth().currentUser.uid;
    const ref= this.afStorage.ref('image/'+ this.NewUser+'/profile.jpg');

    const task= ref.put(blob);
    this.currentImage = task.snapshotChanges().pipe(
      finalize(() => this.downloadUrl = ref.getDownloadURL())
    ).subscribe();
    console.log(this.currentImage);
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
