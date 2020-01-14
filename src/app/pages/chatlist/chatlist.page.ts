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
  private messageSubscription;
  private datauser = new Array<User>();
  public  CurrentUser;
  private servicesPet;
  private service;
  private teste;
  private servicesCollection : AngularFirestoreCollection<RequestService>;
  documentToDomainObject = _ => {
    const object = _.payload.doc.data();
    object.id = _.payload.doc.id;
    return object;
  }
  constructor(private afs: AngularFirestore, 
    private authServices: AuthService, private userServices: RegisterService,private servicespetServices: ServicespetService,) {
    this.servicesCollection = this.afs.collection<RequestService>('RequestService');

    this.userSubscription = this.userServices.getDataUser(this.authServices.getAuth().currentUser.uid).subscribe(
      data => {
        data[0].dateofbirthday= data[0].dateofbirthday.split('T')[0];
        this.datauser = data;
    });
 
  }
  ngOnInit() {
    this.CurrentUser = this.authServices.getAuth().currentUser
    this.service = this.getserviceRequest("5s706EAvNbao1SinTloJdDisLaA3")
    
  }

  getserviceRequest(user){
    return this.servicesCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map( a =>{
          const data = a.payload.doc.data();
          const id =a.payload.doc.id;
            return{id, ...data};
        })
        .filter(item => (item.from == user));
      })
    ).subscribe(result => {
      this.teste = result;
     // call methods that work with this.data from here
    });
  }
}
  

