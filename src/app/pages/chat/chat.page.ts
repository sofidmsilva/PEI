import { Component, OnInit, ViewChild  } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavController, NavParams } from '@ionic/angular';
//import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Subscription } from 'rxjs';
import { RegisterService } from 'src/app/services/register.service';
import { User } from 'src/app/interfaces/user';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
//import { reverse } from 'dns';
import * as firebase from 'firebase';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild(NavController, { static: false }) navCtrl: NavController;
  @ViewChild(NavParams, { static: false }) navParams: NavParams;
  //@ViewChild(AngularFireDatabase, { static: false }) db: AngularFireDatabase;

  private userSubscription: Subscription;
  private messageSubscription;
  private datauser = new Array<User>();
  public  CurrentUser;
  username: string = '';
  message: string = '';
  sendID: string = ''; //utilizador que envia a mensagem
  recvID: string = ''; //utilizado que recebe a mensagem ( utilizador que contratou o serviço)
  sendName: string = '';
  recvName: string = '';
  //conteudo: {from:string, fromName: string, messages: [], to:string,toName:string, id: string }[] = [];
  date: string = '';
  private pet;
  private dono;
  private chatID;
  private info;
  messagesBD = [{}];
  private imageloading;
  private url;
  private chatPhoto;
  private alldatauser;
  private editimage;
  conteudo = <any>{};
  documentToDomainObject = _ => {
    const object = _.payload.doc.data();
    object.id = _.payload.doc.id;
    return object;
  }
  constructor(private afs: AngularFirestore,
    private route: Router,
    private afStorage: AngularFireStorage,
    private activatedRoute: ActivatedRoute,
    private authServices: AuthService, private userServices: RegisterService,) {
    this.userSubscription = this.userServices.getDataUser(this.authServices.getAuth().currentUser.uid).subscribe(
      data => {
        //data[0].dateofbirthday= data[0].dateofbirthday.split('T')[0];
        this.datauser = data;
    });
    
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
     this.info = params
    });
    this.messageSubscription = this.afs.collection('Chat')
    .snapshotChanges()
      .pipe(map(action => action.map(
        this.documentToDomainObject
      )
      .filter(item => (item.id == this.info.id))
      )).subscribe( dados => {
          this.conteudo = dados[0]
          this.messagesBD.push(this.conteudo.messages)
      });
    
    this.CurrentUser = this.authServices.getAuth().currentUser
  }
  ngOnDestroy(): void {
    this.messageSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }
  
  sendMessage(image){
    if(this.CurrentUser.uid == this.conteudo.from){
      this.sendID = this.CurrentUser.uid
      this.recvID = this.conteudo.to
      this.sendName = this.conteudo.fromName
      this.recvName = this.conteudo.toName
    }
    else{
      this.sendID = this.conteudo.to
      this.recvID = this.CurrentUser.uid
      this.sendName = this.conteudo.toName
      this.recvName = this.conteudo.fromName
    }
    if(image){
        let cont = [{
            sendID: this.sendID,
            sendName: this.sendName,
            recvID: this.recvID,
            recvName: this.recvName, 
            date: Date(), 
            image: image,
        }]
        const docRef = this.afs.collection("Chat").doc(this.info.id)
        docRef.update({
          messages: firebase.firestore.FieldValue.arrayUnion(cont[0])
        });
        cont = [];
    }else{
      if(this.message != ''){
        let cont = [{
            sendID: this.sendID,
            sendName: this.sendName,
            recvID: this.recvID,
            recvName: this.recvName, 
            date: Date(), 
            message: this.message,
        }]
        const docRef = this.afs.collection("Chat").doc(this.info.id)
        docRef.update({
          messages: firebase.firestore.FieldValue.arrayUnion(cont[0])
        });
        cont = [];
      }
    }
    
    
  }
  
  //formatar a data
  formatDate() {
    let addZeroToLoneFigure = (n) => n.toString().length === 1 ? '0' + n : n.toString();
    let format = '';
    let d= new Date();
    format = addZeroToLoneFigure(d.getDate()) + '-'+ addZeroToLoneFigure(d.getMonth() + 1) 
    + '-' + addZeroToLoneFigure(d.getFullYear());
    return format;
  }

  uploadImage(event,i?:number) {
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
     const filePath = "/image/" + this.authServices.getAuth().currentUser.uid +"/chat"+ "/Photo"+Math.floor(Math.random() * 3000);
     const result = this.SaveImageRef(filePath, fileraw);
     const ref = result.ref;

     //criar link para download 
     result.task.then(a => {
       ref.getDownloadURL().subscribe(a => {
         this.chatPhoto = a;
         this.sendMessage(this.chatPhoto)
       });

     });
        }else{
             // upload da imagem para firebase
     const fileraw = event.target.files[0];
     const filePath = "/image/" + this.authServices.getAuth().currentUser.uid + "/chat/";
     const result = this.SaveImageRef(filePath, fileraw);
     const ref = result.ref;


     //criar link para download 

     result.task.then(a => {
       ref.getDownloadURL().subscribe(a => {
         this.alldatauser = a;
         this.UpdateRecord(this.alldatauser);
         this.sendMessage(this.chatPhoto)
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
}
