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
import { Router, ActivatedRoute } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
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
  private messageSubscription;
  private messages;
  private chat;
  private names;
  public aceptedServices= new Array<RequestService>();
  
  //public servicesCollection : AngularFirestoreCollection<RequestService>;
  //public userCollection : AngularFirestoreCollection<User>;
  documentToDomainObject = _ => {
    const object = _.payload.doc.data();
    object.id = _.payload.doc.id;
    return object;
  }
  
  constructor(private afs: AngularFirestore,
    private route: Router,
    public authServices: AuthService, public userServices: RegisterService,private servicespetServices: ServicespetService,) {
  
    this.userSubscription = this.userServices.getAllUser().subscribe(
      data => {
   
        this.datauser = data        
       
    });
    this.requestSubscription = this.servicespetServices.getAllrequestservice().subscribe(
      data => {
        this.requestservices = data;
        for (let i = 0; i <= this.requestservices.length - 1; i++) {
          if(this.requestservices[i].from==this.authServices.getAuth().currentUser.uid || this.requestservices[i].to==this.authServices.getAuth().currentUser.uid && this.requestservices[i].accept == 5 && this.requestservices[i].done !=true){
            var iddono=this.requestservices[i].from;
            var idpet= this.requestservices[i].to;
            var idservice = this.requestservices[i].id
            for (let i = 0; i <= this.datauser.length - 1; i++) {
                if(iddono==this.datauser[i].id){
                  Object.assign(this.datauser[i], {servID: idservice});
                 this.datadono.push(this.datauser[i]);
                 
                }
                else{
                  if(idpet==this.datauser[i].id){
                    Object.assign(this.datauser[i], {servID: idservice});
                    this.datapetsitter.push(this.datauser[i]);
                  }
                }
            }
          }
        }    
      }
    );
  }
  ngOnInit() {
    this.CurrentUser = this.authServices.getAuth().currentUser
  }
  verifyChat(pet,dono){
    this.messageSubscription = this.afs.collection('Chat').snapshotChanges()
      .pipe(map(action => action.map(
        this.documentToDomainObject
      )
        .filter(item => (item.to  == pet[0].id))
        .filter(item2 => (item2.from == dono[0].id))
      ));
    this.messageSubscription
    .subscribe(
        result => {
            if (result.length != 0) {
              this.route.navigate(['/tabs/chat', result[0]])
            } else {
               //criar array pro chat com to e from e enviar id to chat
              this.afs.collection('Chat').add({
                to: pet[0].id,
                toName: pet[0].name,
                from: dono[0].id,
                fromName: dono[0].name,
                messages : []
              })
            }
        },
        error => {
            console.log("Ocorreu um erro:",error);
        }
      );
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
  

