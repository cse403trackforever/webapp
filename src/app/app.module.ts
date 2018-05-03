import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ImportModule } from './import/import.module';
import { DatabaseModule } from './database/database.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IssueModule } from './issue/issue.module';

import { FakeBackendInterceptor } from './fake-backend-interceptor';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { IssuePageComponent } from './issue-page/issue-page.component';
import { ProjectPageComponent } from './project-page/project-page.component';
import { SigninPageComponent } from './signin-page/signin-page.component';
import { SignoutPageComponent } from './signout-page/signout-page.component';

// Services
import { AuthenticationService } from './authentication.service';

import { DbkeyPipe } from './shared/pipes/dbkey.pipe';

// Firebase Authentication
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { MyProjectsPageComponent } from './my-projects-page/my-projects-page.component';

export const firebaseConfig = {
  apiKey: 'AIzaSyBA71GS_jZvo9N2Qk3deEw89i1XxYLRZHs',
  authDomain: 'track-forever-b0adf.firebaseapp.com',
  databaseURL: 'https://track-forever-b0adf.firebaseio.com',
  storageBucket: 'track-forever-b0adf.appspot.com',
  projectId: 'track-forever-b0adf',
  messagingSenderId: '102665664344'
};

@NgModule({
  declarations: [
    AppComponent,
    IssuePageComponent,
    ProjectPageComponent,
    HomePageComponent,
    IssuePageComponent,
    SigninPageComponent,
    DbkeyPipe,
    SignoutPageComponent,
    MyProjectsPageComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    ImportModule,
    DatabaseModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFontAwesomeModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    IssueModule
  ],
  providers: [
    AuthenticationService,
    environment.mockBackend ? {
      provide: HTTP_INTERCEPTORS,
      useClass: FakeBackendInterceptor,
      multi: true
    } : []
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
