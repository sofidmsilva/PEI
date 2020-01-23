import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from '../interfaces/user';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Comments } from '../interfaces/comments';
import { Chat } from '../interfaces/chat';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Favorites } from '../interfaces/favorites';
import { Ratings } from '../interfaces/ratings';
@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private usersCollection;
  private currentUser;
  private userCommentCollection;
  coords: any;
  private usersFavoritesCollection;
  constructor(private afs: AngularFirestore, private authServices: AuthService, private http: HttpClient) {

  }
  getUsersCollection(){
    return this.usersCollection;
  }
  setUsersCollection(usersCollection){
    this.usersCollection = usersCollection;
  }
  getCurrentUser(){
    return this.currentUser;
  }
  setCurrentUser(currentUser){
    this.currentUser = currentUser;
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
        .filter(item => (item.id === newUser))
      ));
    return this.usersCollection;
  }

  getCityCoords(morada){
    var url=`https://eu1.locationiq.com/v1/search.php?key=82087a057eb819&q=${morada}&format=json`
    console.log(url)
        return this.coords=this.http.get(url);
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
  /*
  sendMessage(message: Chat){
    return this.afs.collection('Chat').add(message);
  }*/

  getMessage(){
  }
  getLocalFile(){
    return this.http.get('assets/cidades.json').pipe(
        map(res => res));
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

  addRatings(ratings: Ratings) {
    return this.afs.collection('Ratings').add(ratings);
  }
  getRatings(newUser) {
    this.usersFavoritesCollection = this.afs.collection('Ratings').snapshotChanges()
      .pipe(map(action => action.map(
        this.documentToDomainObject
      )
        .filter(item => (item.to == newUser))
      ));
    return this.usersFavoritesCollection;
  }
}
