import { Inject, Injectable } from '@angular/core';
import { IssueService } from './issue.service';
import { OfflineIssueService } from './offline-issue.service';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';
import { SyncService } from '../sync/sync.service';
import { catchError, mergeMap } from 'rxjs/operators';
import { concat, Observable, of } from 'rxjs';

/**
 * Determines online/offline state and fetches projects from the appropriate source
 */
@Injectable()
export class DefaultIssueService implements IssueService {
  constructor(
    private offline: OfflineIssueService,
    @Inject('Navigator') private navigator: Navigator,
    private syncService: SyncService,
  ) { }

  isOnline(): boolean {
    return this.navigator.onLine;
  }

  getProjects(): Observable<TrackForeverProject[]> {
    if (this.isOnline()) {
      return this.syncService.sync().pipe(
        catchError(err => of(err)), // ignore errors
        mergeMap(() => this.offline.getProjects())
      );
    }
    return this.offline.getProjects();
  }

  getProject(projectKey: string): Observable<TrackForeverProject> {
    return this.offline.getProject(projectKey);
  }

  getIssue(projectKey: string, issueId: string): Observable<TrackForeverIssue> {
    return this.offline.getIssue(projectKey, issueId);
  }

  private syncIfOnline(obs: Observable<any>): Observable<any> {
    if (this.isOnline()) {
      /*
      First returns the result of the observation, then attempts to sync
       */
      return concat(
        obs,
        this.syncService.sync().pipe(
          catchError(err => of(err)) // ignore errors
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
