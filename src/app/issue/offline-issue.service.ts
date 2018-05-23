import { Injectable } from '@angular/core';
import { DataService } from '../database/data.service';
import { IssueService } from './issue.service';
import { Observable } from 'rxjs/Observable';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import 'rxjs/add/observable/fromPromise';

/**
 * Fetches issues from an offline database
 */
@Injectable()
export class OfflineIssueService implements IssueService {

  constructor(private dataService: DataService) { }

  getIssue(projectKey: string, issueId: string): Observable<TrackForeverIssue> {
    return Observable.fromPromise(this.dataService.getProject(projectKey)
      .then((project: TrackForeverProject) => {
        return project.issues.get(issueId);
      })
    );
  }

  setIssue(issue: TrackForeverIssue): Observable<string> {
    return Observable.fromPromise(this.dataService.getProject(issue.projectId).then(project => {
      project.issues.set(issue.id, issue);
      return this.dataService.addProject(project);
    }));
  }

  setIssues(projectKey: string, issues: Array<TrackForeverIssue>): Observable<string> {
    return Observable.fromPromise(this.dataService.getProject(projectKey).then(project => {
      issues.forEach(issue => project.issues.set(issue.id, issue));
      return this.dataService.addProject(project);
    }));
  }

  getProject(projectKey: string): Observable<TrackForeverProject> {
    return Observable.fromPromise(this.dataService.getProject(projectKey));
  }

  setProject(project: TrackForeverProject): Observable<string> {
    return Observable.fromPromise(this.dataService.addProject(project));
  }

  getProjects(): Observable<Array<TrackForeverProject>> {
    return new Observable((observer) => {
      const projects: Array<TrackForeverProject> = [];
      this.dataService.getKeys().then((keys: Array<string>) => {
        Promise.all(keys.map((key) => {
          return this.dataService.getProject(key).then((project: TrackForeverProject) => {
            projects.push(project);
            observer.next(projects);
          });
        })).then(() => observer.complete());
      });
    });
  }
}
