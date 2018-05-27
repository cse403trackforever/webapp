import { Inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { IssueService } from './issue.service';
import { OnlineIssueService } from './online-issue.service';
import { OfflineIssueService } from './offline-issue.service';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';
import { SyncService } from '../sync/sync.service';
import { catchError } from 'rxjs/operators';
import { concat, of, throwError } from 'rxjs';

/**
 * Determines online/offline state and fetches projects from the appropriate source
 */
@Injectable()
export class DefaultIssueService implements IssueService {
  private serverDown = false;

  constructor(
    private online: OnlineIssueService,
    private offline: OfflineIssueService,
    @Inject('Navigator') private navigator: Navigator,
    private syncService: SyncService,
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
    if (this.isOnline()) {
      return concat(
        offlineObs(),
        onlineObs().pipe(
          catchError((e) => {
            if (e instanceof HttpErrorResponse) {
              // remember if the server is down (or doesn't exist), avoid making more HTTP calls to it
              if (e.status === 0) {
                console.log('api request failed -- defaulting to offline database');
                this.serverDown = true;
              }
            }
            return throwError(e);
          })
        )
      );
    }

    return offlineObs();
  }

  isOnline(): boolean {
    return this.navigator.onLine && !this.serverDown;
  }

  getProjects(): Observable<TrackForeverProject[]> {
    return this.choose(
      () => this.online.getProjects(),
      () => this.offline.getProjects()
    );
  }

  getProject(projectKey: string): Observable<TrackForeverProject> {
    return this.choose(
      () => this.online.getProject(projectKey),
      () => this.offline.getProject(projectKey)
    );
  }

  getIssue(projectKey: string, issueId: string): Observable<TrackForeverIssue> {
    return this.choose(
      () => this.online.getIssue(projectKey, issueId),
      () => this.offline.getIssue(projectKey, issueId),
    );
  }

  private syncIfOnline(obs: Observable<any>): Observable<any> {
    if (this.isOnline()) {
      /*
      First returns the result of the observation, then attempts to sync
       */
      return concat(
        obs,
        this.syncService.sync().pipe(
          catchError(err => {
            // TODO schedule syncing for when we're back online
            console.log('sync failed!');
            console.log(err);
            return of(err);
          })
        )
      );
    }
    return obs;
  }

  setIssue(issue: TrackForeverIssue): Observable<any> {
    return this.syncIfOnline(this.offline.setIssue(issue));
  }

  setProject(project: TrackForeverProject): Observable<any> {
    return this.syncIfOnline(this.offline.setProject(project));
  }
}
