import { Component, OnInit, ViewChild  } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavController, NavParams } from '@ionic/angular';
//import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore} from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { RegisterService } from 'src/app/services/register.service';
import { User } from 'src/app/interfaces/user';
import { map } from 'rxjs/operators';
//import { reverse } from 'dns';

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
  messages: object[] = [];
  date: string = '';

  documentToDomainObject = _ => {
    const object = _.payload.doc.data();
    object.id = _.payload.doc.id;
    return object;
  }
  constructor(private afs: AngularFirestore, 
    private authServices: AuthService, private userServices: RegisterService,) {
    this.userSubscription = this.userServices.getDataUser(this.authServices.getAuth().currentUser.uid).subscribe(
      data => {
        data[0].dateofbirthday= data[0].dateofbirthday.split('T')[0];
        this.datauser = data;
    });

    this.messageSubscription = this.afs.collection('Chat', ref => 
    ref.orderBy('date')).snapshotChanges()
      .pipe(map(action => action.map(
        this.documentToDomainObject
      ))).subscribe( dados => {
        this.messages = dados;
        console.log(this.messages)
        console.log(this.CurrentUser.uid)
      });
    
  }
  ngOnInit() {
    this.CurrentUser = this.authServices.getAuth().currentUser
    // alterar, só serve pra testar com os mesmos 2 users
    if(this.CurrentUser.uid == 'fnbc4yvc0Vas8PTnYjq4rMleTYH2'){
      this.recvID = 'OihASxyJGBQUKUpOh65nJk14g9i1';
    }
    else{
      this.recvID = 'fnbc4yvc0Vas8PTnYjq4rMleTYH2';
    }
    console.log(this.datauser)
  }
  sendMessage(){
    if(this.message != ''){
      this.afs.collection('Chat').add({
        username: this.username,
        message: this.message,
        sendID: this.CurrentUser.uid,
        recvID: this.recvID,
        date: Date(),
      }).then( () => {
        //mensagem enviada
  
      }).catch( () =>{
          //erro na base de dados
      });
      this.message = '';
      
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
}
