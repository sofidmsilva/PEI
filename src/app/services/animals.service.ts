import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Animals } from '../interfaces/animals';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class AnimalsService {
private animalsCollection : AngularFirestoreCollection<Animals>;
private userId: string;
  constructor(private afs:AngularFirestore, private authServices: AuthService ) { 
    this.animalsCollection =this.afs.collection<Animals>('Animais');
    this.userId=this.authServices.getAuth().currentUser.uid;
  }
  
  getAnimals(newUser){
    return this.animalsCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map( a =>{
          const data = a.payload.doc.data();
          const id =a.payload.doc.id;
    
            return{id, ...data};
        })
        .filter(item => (item.userID == newUser));
      })
    )
  }

  addAnimal(animal: Animals){
    const newUserObject = Object.assign({},animal);
    return  this.animalsCollection.add(animal);
  }

  updateanimal(animal: Animals,Animal) {
    return this.afs.collection('Animais').doc(Animal).update(animal);
  }

  deleteAnimal(id: string) {
    return this.afs.collection('Animais').doc(id).delete();
  }

}
