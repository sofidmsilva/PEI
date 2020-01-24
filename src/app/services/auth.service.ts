import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { LoginPage } from '../pages/login/login.page';
import { registerLocaleData } from '@angular/common';
import { User } from '../interfaces/user';
import * as admin from 'firebase-admin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afa: AngularFireAuth) { }

  login(user: User) {
    
    return this.afa.auth.signInWithEmailAndPassword(user.email, user.password);
    
  }
  register(user: User) {
    return this.afa.auth.createUserWithEmailAndPassword(user.email, user.password);
  }
  logout() {
    return this.afa.auth.signOut();
  }
  getAuth() {
    return this.afa.auth;
  }


}
