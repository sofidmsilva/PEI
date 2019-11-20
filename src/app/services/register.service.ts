import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from '../interfaces/user';
import {map} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private usersCollection : AngularFirestoreCollection<User>;
  constructor(private afs:AngularFirestore) {
    
   }

   /*getDataUser(){
    return this.usersCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map( a =>{
          const data = a.payload.doc.data();
          console.log(data);
          const id =a.payload.doc.id;
            return{id, ...data};
        
        
          
        });
      })
    )
   }*/

   updateUser(id:string, user: User){

   }
   
   addUser(user: User,newUser){
     const newUserObject = Object.assign({},user);
     delete newUserObject.email;
     delete newUserObject.password;
     return  this.afs.collection('Utilizador').doc(newUser.user.uid).set(newUserObject);
   }


}
