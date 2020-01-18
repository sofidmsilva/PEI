import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { MessagestoTeam } from '../interfaces/messagesto-team';

@Injectable({
  providedIn: 'root'
})
export class MessageSupportTeamService {

  constructor(private afs: AngularFirestore, private authServices: AuthService, private http: HttpClient) { 
    
  }

  addmessageTeamSuport(message: MessagestoTeam) {
    return this.afs.collection('MessageTeamSuport').add(message);
  }
}
