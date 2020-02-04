import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { MessagestoTeam } from '../interfaces/messagesto-team';
import { map } from 'rxjs/operators';
import { Chat } from '../interfaces/chat';

@Injectable({
  providedIn: 'root'
})
export class MessageSupportTeamService {
  private messageCollection;

  constructor(private afs: AngularFirestore, private authServices: AuthService, private http: HttpClient) { 
    
  }
  documentToDomainObject = _ => {
    const object = _.payload.doc.data();
    object.id = _.payload.doc.id;
    return object;
  }
  
  addmessageTeamSuport(message: MessagestoTeam) {
    return this.afs.collection('MessageTeamSuport').add(message);
  }
  getAllmessagesusers(){
    this.messageCollection =  this.afs.collection('Chat').snapshotChanges()
    .pipe(map(action => action.map(
      this.documentToDomainObject
    )));
    return this.messageCollection;
  }

  addarrayformessage(message: Chat){
   return this.afs.collection('Chat').add(message);
  }
}
