import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { IssueDetailsComponent } from './issue-details/issue-details.component';

import { ImportService } from './import.service';


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
    ImportService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
