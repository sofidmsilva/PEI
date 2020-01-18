import { Component, OnInit, ViewChild  } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavController, NavParams } from '@ionic/angular';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { RegisterService } from 'src/app/services/register.service';
import { User } from 'src/app/interfaces/user';
import { map } from 'rxjs/operators';
import { ServicespetService } from 'src/app/services/servicespet.service';
import { RequestService } from 'src/app/interfaces/request-service';
//import { reverse } from 'dns';

@Component({
  selector: 'app-chat',
  templateUrl: './chatlist.page.html',
  styleUrls: ['./chatlist.page.scss'],
})
export class ChatListPage implements OnInit {
  @ViewChild(NavController, { static: false }) navCtrl: NavController;
  @ViewChild(NavParams, { static: false }) navParams: NavParams;
  
  private ServicespetSubscription: Subscription;
  private userSubscription: Subscription;
  public datauser = new Array<User>();
  public teste;
  public userType;
  public  CurrentUser;
  private usersCollection;
  private servicesCollection;
  public serviceRequest;
  private names;
  //public servicesCollection : AngularFirestoreCollection<RequestService>;
  //public userCollection : AngularFirestoreCollection<User>;
  documentToDomainObject = _ => {
    const object = _.payload.doc.data();
    object.id = _.payload.doc.id;
    return object;
  }
  constructor(private afs: AngularFirestore, 
    public authServices: AuthService, public userServices: RegisterService,private servicespetServices: ServicespetService,) {
    //this.servicesCollection = this.afs.collection<RequestService>('RequestService');
    this.userSubscription = this.userServices.getDataUser(this.authServices.getAuth().currentUser.uid).subscribe(
      data => {
        //data[0].dateofbirthday= data[0].dateofbirthday.split('T')[0];
        this.datauser = data        
        //console.log(this.datauser) //// ------- 1
    });
    console.log(this.datauser) //// ------- 2
  }
  ngOnInit() {

    this.CurrentUser = this.authServices.getAuth().currentUser
    //console.log(this.userSubscription);
    this.getDataUser(this.CurrentUser.uid).subscribe(user =>{this.userType = user[0].tipeuser;
      if(this.userType == 1){
        this.userSubscription = this.userServices.getDataUser(this.authServices.getAuth().currentUser.uid).subscribe(
          data => {
            for(let i=0; i< this.serviceRequest.length; i++){
              //verificar tipo de user falta????
              console.log(this.serviceRequest)
              this.names.push(this.getDataUser(this.serviceRequest.subscribe(request =>{
                request.from[i]
              })))
            }
        });

        //1 = dono ir ao to buscar id pra ir buscar nome de user
        //2 = pets ir ao from buscar id pra ir buscar nome de user
      }
    })
    
    //console.log(this.datauser)

    this.getService("5s706EAvNbao1SinTloJdDisLaA3").subscribe(service => {console.log(service)})
    this.serviceRequest = this.getService("5s706EAvNbao1SinTloJdDisLaA3")
    

  }
  getService(user){
    this.servicesCollection = this.afs.collection('RequestService').snapshotChanges()
      .pipe(map(action => action.map(
        this.documentToDomainObject
      )
        .filter(item => (item.to === user))
        .filter(item2 => item2.accept == 5)
        ));
      return this.servicesCollection
  }
  getDataUser(newUser) {
    this.usersCollection = this.afs.collection('Utilizador').snapshotChanges()
      .pipe(map(action => action.map(
        this.documentToDomainObject
      )
        .filter(item => (item.id === newUser))
      ));
    return this.usersCollection;
  }

  
}
  

