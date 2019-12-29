import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class ServiceFiltersService {

  private usersCollection;
  constructor(private afs: AngularFirestore, private authServices: AuthService) {

  }

  documentToDomainObject = _ => {
    const object = _.payload.doc.data();
    object.id = _.payload.doc.id;
    return object;
  }

  applyFilters() {
    this.usersCollection = this.afs.collection('Utilizador').snapshotChanges()
      .pipe(map(action => action.map(
        this.documentToDomainObject
      )));
  }

  getUsers(){
      return this.usersCollection;
  }
}
