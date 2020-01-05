import { Component, OnInit, ViewChild  } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavController, NavParams } from '@ionic/angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore} from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { RegisterService } from 'src/app/services/register.service';
import { User } from 'src/app/interfaces/user';
import { map } from 'rxjs/operators';

//import { reverse } from 'dns';

@Component({
  selector: 'app-chat',
  templateUrl: './chatlist.page.html',
  styleUrls: ['./chatlist.page.scss'],
})
export class ChatListPage implements OnInit {
  @ViewChild(NavController, { static: false }) navCtrl: NavController;
  @ViewChild(NavParams, { static: false }) navParams: NavParams;
  @ViewChild(AngularFireDatabase, { static: false }) db: AngularFireDatabase;
  
  private userSubscription: Subscription;
  private messageSubscription;
  private datauser = new Array<User>();
  public  CurrentUser;
  private checkService;
  private teste;
  

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

    
  }
  ngOnInit() {
    this.CurrentUser = this.authServices.getAuth().currentUser
    // alterar, só serve pra testar com os mesmos 2 users
    this.teste = this.getDataservice("bEy0cywDUzWgzp8xANghAdIuOsk2")
    console.log("---------------")
    console.log(this.teste)
    console.log("---------------")
    
  }

  getDataservice(user) {
    return "teste"
  }
}
  

