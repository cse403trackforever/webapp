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

  getIssue(projectKey: string, issueId: String): Observable<TrackForeverIssue> {
    return Observable.fromPromise(this.dataService.getProject(projectKey)
      .then((project: TrackForeverProject) => {
        return project.issues.find((issue: TrackForeverIssue) => issue.id === issueId);
      })
    );
  }

  getProject(projectKey: string): Observable<TrackForeverProject> {
    return Observable.fromPromise(this.dataService.getProject(projectKey));
  }

  getProjects(): Observable<TrackForeverProject[]> {
    return new Observable((observer) => {
      const projects: TrackForeverProject[] = [];
      this.dataService.getKeys().then((keys: string[]) => {
        keys.forEach((key) => {
          this.dataService.getProject(key).then((project: TrackForeverProject) => {
            projects.push(project);
            observer.next(projects);
          });
        });
      });
    });
  }
}
