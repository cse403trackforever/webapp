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

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MyProjectsPageComponent } from './my-projects-page/my-projects-page.component';
import { ExportModule } from './export/export.module';
import { MarkdownPipe } from './shared/pipes/markdown.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';
import { UserPageComponent } from './user-page/user-page.component';
import { AuthenticationModule } from './authentication/authentication.module';
import { SigninPageComponent } from './signin-page/signin-page.component';
import { PasswordResetPageComponent } from './password-reset-page/password-reset-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { CreateIssuePageComponent } from './create-issue-page/create-issue-page.component';
import { IssueDetailsComponent } from './issue-details/issue-details.component';
import { CreateProjectPageComponent } from './create-project-page/create-project-page.component';

@NgModule({
  declarations: [
    AppComponent,
    IssuePageComponent,
    ProjectPageComponent,
    HomePageComponent,
    IssuePageComponent,
    SigninPageComponent,
    MarkdownPipe,
    MyProjectsPageComponent,
    UserPageComponent,
    PasswordResetPageComponent,
    SignUpPageComponent,
    CreateIssuePageComponent,
    IssueDetailsComponent,
    CreateProjectPageComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    ImportModule,
    DatabaseModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    IssueModule,
    FontAwesomeModule,
    ExportModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    AuthenticationModule,
  ],
  providers: [
    environment.mockBackend ? {
      provide: HTTP_INTERCEPTORS,
      useClass: FakeBackendInterceptor,
      multi: true
    } : []
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
