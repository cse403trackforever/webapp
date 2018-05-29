import { Injectable } from '@angular/core';
import { DataService } from '../database/data.service';
import { IssueService } from './issue.service';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { Observable, from } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { map, mergeMap } from 'rxjs/operators';

/**
 * Fetches issues from an offline database
 */
@Injectable()
export class OfflineIssueService implements IssueService {

  constructor(
    private dataService: DataService,
    private authService: AuthenticationService,
  ) { }

  getIssue(projectKey: string, issueId: string): Observable<TrackForeverIssue> {
    return this.authService.getUser().pipe(
      mergeMap(user => from(this.dataService.getProject(projectKey, user.uid))),
      map(project => project.issues.get(issueId))
    );
  }

  setIssue(issue: TrackForeverIssue): Observable<string> {
    return this.authService.getUser().pipe(
      mergeMap(user => {
        return from(this.dataService.getProject(issue.projectId, user.uid).then(project => {
          project.issues.set(issue.id, issue);
          return this.dataService.addProject(project, user.uid);
        }));
      })
    );
  }

  setIssues(projectKey: string, issues: Array<TrackForeverIssue>): Observable<string> {
    return this.authService.getUser().pipe(
      mergeMap(user => {
        return from(this.dataService.getProject(projectKey, user.uid).then(
          project => {
            issues.forEach(issue => project.issues.set(issue.id, issue));
            return this.dataService.addProject(project, user.uid);
          }
        ));
      }),
    );
  }

  getProject(projectKey: string): Observable<TrackForeverProject> {
    return this.authService.getUser().pipe(
      mergeMap(user => from(this.dataService.getProject(projectKey, user.uid)))
    );
  }

  setProject(project: TrackForeverProject): Observable<string> {
    return this.authService.getUser().pipe(
      mergeMap(user => from(this.dataService.addProject(project, user.uid)))
    );
  }

  getProjects(): Observable<TrackForeverProject[]> {
    return this.authService.getUser().pipe(
      mergeMap(user => this.dataService.getProjects(user.uid))
    );
  }
}
