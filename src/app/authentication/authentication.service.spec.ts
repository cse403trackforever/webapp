import { AngularFireDatabase } from 'angularfire2/database';
import { TestBed, inject } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseApp, AngularFireModule } from 'angularfire2';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../../environments/environment';
import * as firebase from 'firebase/app';
import { of } from 'rxjs';

describe('AuthenticationService', () => {

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const authState: firebase.User = null;
    const mockAngularFireAuth: any = { authState: of(authState) };
    const firebaseConfig = environment.firebaseConfig;

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AngularFireModule.initializeApp(firebaseConfig)],
      providers: [AuthenticationService, FirebaseApp, AngularFireDatabase,
        {
          provide: Router,
          useValue: routerSpy
        },
        {
          provide: AngularFireAuth,
          useValue: mockAngularFireAuth
        }]
    });
  });

  it('should be created', inject([AuthenticationService], (service: AuthenticationService) => {
    expect(service).toBeTruthy();
  }));
});
