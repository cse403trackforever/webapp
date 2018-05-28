import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AuthUser } from '../shared/models/auth-user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthenticationService {
  private user: Observable<AuthUser>;

  redirectUrl: string;

  constructor(public afAuth: AngularFireAuth) {
    this.user = afAuth.authState.pipe(map((user: firebase.UserInfo) => {
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
    }));
  }

  getUser(): Observable<AuthUser> {
    return this.user;
  }

  isLoggedIn(): Observable<boolean> {
    return this.user.pipe(map(user => user != null));
  }

  private signIn(p: Promise<any>): Promise<any> {
    return p
      .then(res => {
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
    return this.afAuth.auth.signInWithEmailAndPassword(value.email, value.password);
  }

  register(value) {
    return this.afAuth.auth.createUserWithEmailAndPassword(value.email, value.password);
  }

  resetPassword(value) {
    return this.afAuth.auth.sendPasswordResetEmail(value);
  }

  signOut() {
    this.afAuth.auth.signOut();
  }
}

