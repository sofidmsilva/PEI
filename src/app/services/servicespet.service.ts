import { Injectable } from '@angular/core';
import { Services } from '../interfaces/services';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Calendar } from '../interfaces/calendar';

@Injectable({
  providedIn: 'root'
})
export class ServicespetService {

  

  private servicesCollection;
  private calendarCollection;
  
  coords:Object={};

  constructor(private afs: AngularFirestore) { }

  documentToDomainObject = _ => {
    const object = _.payload.doc.data();
    object.id = _.payload.doc.id;
    return object;
  }


  // this.servicesCollection = this.afs.collection('Utilizador').snapshotChanges()
  //   .pipe(map(action => action.map(
  //     this.documentToDomainObject
  //   )
  //     .filter(item => (item == newUser))
  //   ));
  // return this.servicesCollection;
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
  addevents(calendar: Calendar){
    return this.afs.collection('CalendarPet').add(calendar);
  }
  getevents(newUser){
    this.calendarCollection = this.afs.collection('CalendarPet').snapshotChanges()
      .pipe(map(action => action.map(
        this.documentToDomainObject
      )
        .filter(item => (item.userID == newUser))
      ));
    return this.calendarCollection;
  }

  getCoordsLocationOfAUser(token: string): Promise<any> {
    return new Promise((resolve,reject) => {
    var docRef = this.afs.collection("Utilizador").doc(token);

    docRef.get().subscribe(
      doc => {
        if (doc.exists) {
          var data=doc.data();
          var coords= {latitude:data.locationCords.latitude, longitude:data.locationCords.longitude};
          resolve(coords)
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        },
        (error) => reject(error)
    );
  });
}
}