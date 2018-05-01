import { Injectable } from '@angular/core';
import { ProjectSummary } from '../shared/models/project-summary';
import { Project } from '../shared/models/project';
import { HttpErrorResponse } from '@angular/common/http';
import { Issue } from '../shared/models/issue';
import { Observable } from 'rxjs/Observable';
import { IssueService } from './issue.service';
import { OnlineIssueService } from './online-issue.service';
import { OfflineIssueService } from './offline-issue.service';
import 'rxjs/add/operator/catch';

/**
 * Determines online/offline state and fetches projects from the appropriate source
 */
@Injectable()
export class DefaultIssueService implements IssueService {
  private serverDown = false;

  constructor(
    private online: OnlineIssueService,
    private offline: OfflineIssueService
  ) { }

  /**
   * Use a different observable depending on online / offline mode. The offline observable will be used if the online one errors regardless
   * of the online state.
   *
   * @param {() => Observable<T>} onlineObs  returns the observable that should be used if the site is online
   * @param {() => Observable<T>} offlineObs returns the observable that should be used if the site is offline
   * @returns {Observable<T>} the observable returned by whichever input was used
   */
  private choose<T>(onlineObs: () => Observable<T>, offlineObs: () => Observable<T>): Observable<T> {
    if (navigator.onLine && !this.serverDown) {
      return onlineObs().catch((e) => {
        if (e instanceof HttpErrorResponse) {
          console.log('api request failed -- defaulting to offline database');
          console.log(e);

          // remember if the server is down (or doesn't exist) to avoid making more HTTP calls to it
          if (e.status === 0) {
            this.serverDown = true;
          }

          return offlineObs();
        }

        return Observable.throw(e);
      });
    }
    return offlineObs();
  }

  getProjects(): Observable<ProjectSummary[]> {
    return this.choose(
      () => this.online.getProjects(),
      () => this.offline.getProjects()
    );
  }

  getProject(projectKey: string): Observable<Project> {
    return this.choose(
      () => this.online.getProject(projectKey),
      () => this.offline.getProject(projectKey)
    );
  }

  getIssue(projectKey: string, issueId: String): Observable<Issue> {
    return this.choose(
      () => this.online.getIssue(projectKey, issueId),
      () => this.offline.getIssue(projectKey, issueId),
    );
  }
}
