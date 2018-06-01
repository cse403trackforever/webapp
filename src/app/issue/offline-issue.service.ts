import { Injectable } from '@angular/core';
import { DataService } from '../database/data.service';
import { IssueService } from './issue.service';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { Observable, from } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { map, mergeMap, first } from 'rxjs/operators';

/**
 * Fetches issues from an offline database
 */
@Injectable()
export class OfflineIssueService implements IssueService {

  constructor(
    private dataService: DataService,
    private authService: AuthenticationService,
  ) { }

  /**
   * Helper method to get a user ID to open the user's database and do something with it
   *
   * @param {(uid: string) => Observable<T>} fn
   * @returns {Observable<T>}
   */
  private withUserId<T>(fn: (uid: string) => Observable<T>): Observable<T> {
    // first get the user to access their database
    return this.authService.getUser().pipe(
      // the getUser() observable doesn't complete, so get only the first emission
      first(),

      // pick out just the uid
      map(user => user.uid),

      // map the uid to another observable with the input function
      mergeMap(fn)
    );
  }

  getIssue(projectKey: string, issueId: string): Observable<TrackForeverIssue> {
    // use the user uid to get the project from the database
    return this.withUserId(uid => from(this.dataService.getProject(projectKey, uid))).pipe(

      // find the issue in the project
      map(project => project.issues.get(issueId))
    );
  }

  setIssue(issue: TrackForeverIssue): Observable<string> {
    return this.withUserId(uid => from(
      // fetch the project to modify the issue
      this.dataService.getProject(issue.projectId, uid).then(project => {
        project.issues.set(issue.id, issue);
        return this.dataService.addProject(project, uid);
      })
    ));
  }

  setIssues(projectKey: string, issues: Array<TrackForeverIssue>): Observable<string> {
    return this.withUserId(uid => from(
      // fetch th project to modify all its issues
      this.dataService.getProject(projectKey, uid).then(
        project => {
          issues.forEach(issue => project.issues.set(issue.id, issue));
          return this.dataService.addProject(project, uid);
        }
      )
    ));
  }

  getProject(projectKey: string): Observable<TrackForeverProject> {
    return this.withUserId(uid => from(this.dataService.getProject(projectKey, uid)));
  }

  setProject(project: TrackForeverProject): Observable<string> {
    return this.withUserId(uid => from(this.dataService.addProject(project, uid)));
  }

  getProjects(): Observable<TrackForeverProject[]> {
    return this.withUserId(uid => this.dataService.getProjects(uid));
  }
}
