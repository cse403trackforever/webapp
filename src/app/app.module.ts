import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { IssueDetailsComponent } from './issue-details/issue-details.component';

import { IssueService } from './issue.service';
import { environment } from '../environments/environment';
import { FakeBackendInterceptor } from './fake-backend-interceptor';


@NgModule({
  declarations: [
    AppComponent,
    IssueDetailsComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    HttpClientModule,
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
