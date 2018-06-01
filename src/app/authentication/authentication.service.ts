import { AuthUser } from './../shared/models/auth-user';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable, from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class AuthenticationService {
  private user: Observable<AuthUser>;
  private authToken: Observable<any>;

  redirectUrl: string;

  constructor(public afAuth: AngularFireAuth, public db: AngularFireDatabase) {
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
    // We need the uid before we can access the database
    return this.user.pipe(mergeMap((user: AuthUser) => {
      return from(this.db.database.ref('Users/' + user.uid).once('value').then(snapshot => {
        return snapshot.val().accessToken as string; // this is the auth token
      }));
    }));
  }

  getUser(): Observable<AuthUser> {
    return this.user;
  }

  isLoggedIn(): Observable<boolean> {
    return this.user.pipe(map(user => user != null));
  }

  private writeUserData(uid, accessToken): void {
    const user = {
      uid: uid,
      accessToken: accessToken
    };

    this.db.database.ref('Users/' + uid).set(user);
  }

  private signIn(p: Promise<any>): Promise<any> {
    return p
      .then(res => {
        console.log(JSON.parse(JSON.stringify(res)));
        this.authToken = res.credential.accessToken;
        console.log('GH auth token: ' + this.authToken);
        this.writeUserData(res.user.uid, res.credential.accessToken);
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

