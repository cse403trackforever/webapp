import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AuthUser } from '../shared/models/auth-user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthenticationService {
  private user: Observable<AuthUser>;
  private authToken: Observable<string>;

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

  getToken(): Observable<string> {
    return this.authToken;
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
        this.authToken = res.credential.accessToken;
        return res;
      })
      .catch(err => console.log(err));
  }

  facebookSignIn(): Promise<any> {
    return this.signIn(this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()));
  }

  githubSignIn(): Promise<any> {
    return this.signIn(this.afAuth.auth.signInWithPopup(new firebase.auth.GithubAuthProvider()));
    // return this.afAuth.auth.signInWithPopup(new firebase.auth.GithubAuthProvider()).then(result => {
    //   if (result.credential) {
    //     // This gives you a GitHub Access Token.
    //     alert(result.credential.accessToken);
    //   }
    //  });
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

