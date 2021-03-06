import { NgModule } from '@angular/core';
import { DefaultIssueService } from './default-issue.service';
import { IssueService } from './issue.service';
import { OnlineIssueService } from './online-issue.service';
import { OfflineIssueService } from './offline-issue.service';
import { SyncModule } from '../sync/sync.module';

/**
 * This is a service module for fetching projects
 */
@NgModule({
  providers: [
    {
      provide: IssueService,
      useClass: DefaultIssueService
    },
    OnlineIssueService,
    OfflineIssueService,
    {
      provide: 'Navigator',
      useValue: navigator
    },
  ],
  imports: [
    SyncModule,
  ]
})
export class IssueModule { }
