import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from '../interfaces/user';
import { VirtualTimeScheduler } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
private registerCollection: AngularFirestoreCollection<User>;
  constructor(private afs:AngularFirestore) {
    
   }

   addUser(user: User,newUser){
     const newUserObject = Object.assign({},user);
     delete newUserObject.email;
     delete newUserObject.password;
     return  this.afs.collection('Utilizador').doc(newUser.user.uid).set(newUserObject);
   }
}
