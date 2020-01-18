import { Component, OnInit, ViewChild, OnDestroy  } from '@angular/core';
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
export class ChatListPage implements OnInit, OnDestroy {

  @ViewChild(NavController, { static: false }) navCtrl: NavController;
  @ViewChild(NavParams, { static: false }) navParams: NavParams;
  
  private ServicespetSubscription: Subscription;
  private userSubscription: Subscription;
  private requestSubscription: Subscription;
  public datauser = new Array<User>();
  public datadono=new Array<User>();
  public datapetsitter=new Array<User>();
  private requestservices: Array<RequestService>;
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

    this.userSubscription = this.userServices.getAllUser().subscribe(
      data => {
   
        this.datauser = data        
       
    });
    this.requestSubscription = this.servicespetServices.getAllrequestservice().subscribe(
      data => {
        this.requestservices = data;
        for (let i = 0; i <= this.requestservices.length - 1; i++) {
          if(this.requestservices[i].from==this.authServices.getAuth().currentUser.uid){
            var iddono=this.requestservices[i].from;
            var idpet= this.requestservices[i].to;
            for (let i = 0; i <= this.datauser.length - 1; i++) {
                if(iddono==this.datauser[i].id){
                 this.datadono.push(this.datauser[i]);
                }
                else{
                  if(idpet==this.datauser[i].id){
                    this.datapetsitter.push(this.datauser[i]);
                  }
                }
            }
          }
        }
       console.log(this.datadono, this.datapetsitter)
      }
     
    );
   
 
  }
  ngOnInit() {
    /*this.getDataUser(this.authServices.getAuth().currentUser).subscribe(
      user =>{
        this.userType = user[0].tipeuser;
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
    this.serviceRequest = this.getService("5s706EAvNbao1SinTloJdDisLaA3")*/
    console.log(this.datapetsitter, this.datadono)

  }
  ngOnDestroy(): void {
    this.requestSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
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
  

