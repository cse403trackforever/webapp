import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { AuthUser } from '../shared/models/auth-user';

@Injectable()
export class AuthenticationService {
  private user: Observable<AuthUser>;

  private loggedIn = false;
  redirectUrl: string;

  constructor(public afAuth: AngularFireAuth) {
    this.user = afAuth.authState.map((user: firebase.UserInfo) => {
      if (user) {
        this.loggedIn = true;
        return {
          displayName: user.displayName,
          email: user.email,
          photoUrl: user.photoURL,
          uid: user.uid,
          providerId: user.providerId
        };
      } else {
        this.loggedIn = false;
        return null;
      }
    });
  }

  getUser(): Observable<AuthUser> {
    return this.user;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  private signIn(p: Promise<any>): Promise<any> {
    return p
      .then(res => {
        this.loggedIn = true;
        return res;
      })
      .catch(err => console.log(err));
  }

  facebookSignIn(): Promise<any> {
    return this.signIn(this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()));
  }

  githubSignIn() {
    return this.signIn(this.afAuth.auth.signInWithPopup(new firebase.auth.GithubAuthProvider()));
  }

  emailSignIn(value) {
    return this.signIn(this.afAuth.auth.signInWithEmailAndPassword(value.email, value.password));
  }

  register(value) {
    console.log('register');
    return this.signIn(this.afAuth.auth.createUserWithEmailAndPassword(value.email, value.password));
  }

  resetPassword(value) {
    return this.afAuth.auth.sendPasswordResetEmail(value);
  }

  signOut() {
    this.loggedIn = false;
    this.afAuth.auth.signOut();
  }
}

