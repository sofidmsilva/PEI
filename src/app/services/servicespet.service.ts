import { Injectable } from '@angular/core';
import { Services } from '../interfaces/services';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Calendar } from '../interfaces/calendar';
import { RequestService } from '../interfaces/request-service';

@Injectable({
  providedIn: 'root'
})
export class ServicespetService {

  private servicesCollection;
  private calendarCollection;

  constructor(private afs: AngularFirestore) { }

  documentToDomainObject = _ => {
    const object = _.payload.doc.data();
    object.id = _.payload.doc.id;
    return object;
  }

  addservices(service: Services){
    return this.afs.collection('Services').add(service);
  }

  deleteService(id: string){
    return this.afs.collection('Services').doc(id).delete();
  }
  editservice(service: Services,id: string){
    return this.afs.collection('Services').doc(id).update(service);
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
  addrequestservice(requestservice: RequestService){
   
    return this.afs.collection('RequestService').add(requestservice);
  }

  getrequestservice(newUser) {
    this.servicesCollection = this.afs.collection('RequestService').snapshotChanges()
      .pipe(map(action => action.map(
        this.documentToDomainObject
      )
        .filter(item => (item.to == newUser))
      ));
    return this.servicesCollection;
  }

  addevents(calendar: Calendar){
    return this.afs.collection('CalendarPet').add(calendar);
  }
  deleteevent(id:string){
    return this.afs.collection('CalendarPet').doc(id).delete();
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
}
