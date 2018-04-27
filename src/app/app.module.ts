import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ImportModule } from './import/import.module';
import { DatabaseModule } from './database/database.module';

import { FakeBackendInterceptor } from './fake-backend-interceptor';
import { environment } from '../environments/environment';

import { IssueService } from './issue.service';

import { AppComponent } from './app.component';
import { IssuePageComponent } from './issue-page/issue-page.component';
import { ProjectPageComponent } from './project-page/project-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { DbkeyPipe } from './shared/pipes/dbkey.pipe';


@NgModule({
  declarations: [
    AppComponent,
    IssuePageComponent,
    ProjectPageComponent,
    HomePageComponent,
    IssuePageComponent,
    DbkeyPipe,
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    ImportModule,
    DatabaseModule,
  ],
  providers: [
    IssueService,
    environment.mockBackend ? {
      provide: HTTP_INTERCEPTORS,
      useClass: FakeBackendInterceptor,
      multi: true
    } : []
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
