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
import { MessageSupportTeamService } from 'src/app/services/message-support-team.service';
import { Chat } from 'src/app/interfaces/chat';
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
  public datadono=[];
  public datapetsitter=[];
  private requestservices: Array<RequestService>;
  private typeofservice: string;
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
  private showlistowner: boolean=false;
  private allmessagesuser=new Array<Chat>();
  private AddChat: Chat = {};
  
  //public servicesCollection : AngularFirestoreCollection<RequestService>;
  //public userCollection : AngularFirestoreCollection<User>;

  
  constructor(private afs: AngularFirestore,
    private route: Router,
    public authServices: AuthService, 
    public userServices: RegisterService,
    private servicespetServices: ServicespetService,
    private router:ActivatedRoute,
    private messageservice: MessageSupportTeamService,) {

    this.userSubscription = this.userServices.getAllUser().subscribe(
      data => {
   
        this.datauser = data        
       
    });
    router.params.subscribe(val => {
    this.requestSubscription = this.servicespetServices.getAllrequestservice().subscribe(
      data => {
        this.requestservices=[];
        this.datadono=[];
        this.datapetsitter=[];
        this.requestservices = data;
        for (let i = 0; i <= this.requestservices.length - 1; i++) {
          if(this.requestservices[i].accept == 5 && this.requestservices[i].done ==false
            &&this.requestservices[i].payment==true){

            for (let a = 0; a <= this.datauser.length - 1; a++) {
              if(this.authServices.getAuth().currentUser.uid==this.requestservices[i].from
              || this.authServices.getAuth().currentUser.uid==this.requestservices[i].to){
                if(this.requestservices[i].to==this.datauser[a].id){
                  var f= this.datauser[a];
                  let y={servie:this.requestservices[i].id};
                  let nameservice={nameservice:this.requestservices[i].type}
                  let location={location:this.requestservices[i].location}
                  Object.assign(y,f,nameservice,location);
                  this.datapetsitter.push(y);
  
                 
                }
             
                if(this.requestservices[i].from==this.datauser[a].id){     
                  let u={servie:this.requestservices[i].id};
                  var p= this.datauser[a];
                  let nameservice={nameservice:this.requestservices[i].type}
                  let location={location:this.requestservices[i].location}
                  Object.assign(u, p,nameservice,location);
                 this.datadono.push(u);
               
    
                }
              }
         
     
              if(this.requestservices[i].from==this.authServices.getAuth().currentUser.uid){
                this.showlistowner=false;
           
              } else{
                if(this.requestservices[i].to==this.authServices.getAuth().currentUser.uid){
                  this.showlistowner=true;
                }
                }
             
            }
          }
  
        }    
        //console.log(this.datapetsitter, this.datadono)
        
      });
      this.messageSubscription = this.messageservice.getAllmessagesusers().subscribe(
        data => {
            this.allmessagesuser=data;
        });

    }); 
  }
  ngOnInit() {
    this.CurrentUser = this.authServices.getAuth().currentUser
  }
 async verifyChat(pet,dono, info){
       var a=0;
       console.log(pet,dono,info)
       console.log(this.allmessagesuser,"allmessage")
      for(let i=0; i<=this.allmessagesuser.length -1; i++){
        if(info.servie == this.allmessagesuser[i].service){
          this.route.navigate(['/tabs/chat', this.allmessagesuser[i]])
          var a=1;
        }
      }
      if(a==0){
        for(let i=0; i<=pet.length -1; i++){
          if(info.servie ==pet[i].servie){
          this.AddChat.messages=[];
          this.AddChat.to=pet[0].id;
          this.AddChat.toName= pet[i].name;
          this.AddChat.from= dono[i].id;
          this.AddChat.fromName= dono[i].name;
          this.AddChat.service= pet[i].servie;
          }
         
        }
        await this.messageservice.addarrayformessage(this.AddChat);
        this.route.navigate(['/tabs/chat'])
      }
          
        
 
  
}

  ngOnDestroy() {
    this.requestSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.messageSubscription.unsubscribe();
    this.datadono=[];
    this.datapetsitter=[];
    console.log("ok")
  }

}
  

