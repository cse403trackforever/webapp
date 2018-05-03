import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { User } from './shared/models/user';

@Injectable()
export class AuthenticationService {
  private user: Observable<User>;

  constructor(public afAuth: AngularFireAuth) {
    this.user = afAuth.authState.map((user: firebase.UserInfo) => {
      if (user) {
        return {
          displayName: user.displayName,
          email: user.email,
          photoUrl: user.photoURL,
          uid: user.uid,
          providerId: user.providerId
        };
      } else {
        return null;
      }
    });
  }

  getUser(): Observable<User> {
    return this.user;
  }

  doFacebookLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        }, err => {
          console.log(err);
          reject(err);
        });
    });
  }

  doRegister(value) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(value.email, value.password)
        .then(res => {
          resolve(res);
        }, err => reject(err));
    });
  }

  logout() {
    setTimeout(() => this.afAuth.auth.signOut(), 1000);
  }
}

