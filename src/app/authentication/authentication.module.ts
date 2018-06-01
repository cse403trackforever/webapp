import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../../environments/environment';
import { AuthenticationService } from './authentication.service';
import { AngularFireDatabaseModule } from 'angularfire2/database';

@NgModule({
  providers: [ AuthenticationService ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ]
})
export class AuthenticationModule { }
