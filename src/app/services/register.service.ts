import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from '../interfaces/user';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Comments } from '../interfaces/comments';
import { Observable } from 'rxjs';
import { Favorites } from '../interfaces/favorites';
@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private usersCollection;
  private userCommentCollection;
  private usersFavoritesCollection;
  constructor(private afs: AngularFirestore, private authServices: AuthService) {

  }

  documentToDomainObject = _ => {
    const object = _.payload.doc.data();
    object.id = _.payload.doc.id;
    return object;
  }
  getDataUser(newUser) {
    this.usersCollection = this.afs.collection('Utilizador').snapshotChanges()
      .pipe(map(action => action.map(
        this.documentToDomainObject
      )
        .filter(item => (item.id == newUser))
      ));
    return this.usersCollection;
  }

  getAllUser() {
    this.usersCollection = this.afs.collection('Utilizador').snapshotChanges()
      .pipe(map(action => action.map(
        this.documentToDomainObject
      )));
    return this.usersCollection;
  }


  getComments(newUser) {
    this.userCommentCollection = this.afs.collection('Comentarios').snapshotChanges()
      .pipe(map(action => action.map(
        this.documentToDomainObject
      )
        .filter(item => (item.to == newUser))
      ));
    return this.userCommentCollection;
  }

  updateUser(user: User,newUser) {
    return this.afs.collection('Utilizador').doc(newUser).update(user);
  }

  addUser(user: User, newUser) {
    const newUserObject = Object.assign({}, user);
    delete newUserObject.email;
    delete newUserObject.password;
    return this.afs.collection('Utilizador').doc(newUser.user.uid).set(newUserObject);
  }

  addComments(comment: Comments) {
    return this.afs.collection('Comentarios').add(comment);
  }
  deleteComment(id: string) {
    return this.afs.collection('Comentarios').doc(id).delete();
  }

  addfavorites(favorite: Favorites){
    return this.afs.collection('Favoritos').add(favorite);
  }
  deletefavorites(id: string) {
    return this.afs.collection('Favoritos').doc(id).delete();
  }
  getFavorites(newUser) {
    this.usersFavoritesCollection = this.afs.collection('Favoritos').snapshotChanges()
      .pipe(map(action => action.map(
        this.documentToDomainObject
      )
        .filter(item => (item.to == newUser))
      ));
    return this.usersFavoritesCollection;
  }
  getFavoritesfrom(newUser) {
    this.usersFavoritesCollection = this.afs.collection('Favoritos').snapshotChanges()
      .pipe(map(action => action.map(
        this.documentToDomainObject
      )
        .filter(item => (item.from == newUser))
      ));
    return this.usersFavoritesCollection;
  }

}
