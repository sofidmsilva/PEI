import { Injectable } from '@angular/core';
import { Services } from '../interfaces/services';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServicespetService {

  private servicesCollection;

  constructor(private afs: AngularFirestore) { }

  documentToDomainObject = _ => {
    const object = _.payload.doc.data();
    object.id = _.payload.doc.id;
    return object;
  }

  addservices(service: Services){
    return this.afs.collection('Services').add(service);
  }

  getServices(newUser) {
    this.servicesCollection = this.afs.collection('Services').snapshotChanges()
      .pipe(map(action => action.map(
        this.documentToDomainObject
      )
        .filter(item => (item.userID == newUser))
      ));
    return this.servicesCollection;
  }
}
