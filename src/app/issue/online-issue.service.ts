import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IssueService } from './issue.service';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';

/**
 * Fetches issues from a TrackForever server
 */
@Injectable()
export class OnlineIssueService implements IssueService {

  constructor(private http: HttpClient) { }

  getIssue(projectKey: string, issueId: String): Observable<TrackForeverIssue> {
    return this.http.post<TrackForeverIssue>(`${environment.apiUrl}/issues`, {
      projectKey,
      issueId
    });
  }

  getProject(projectKey: string): Observable<TrackForeverProject> {
    return this.http.get<TrackForeverProject>(`${environment.apiUrl}/projects/${projectKey}`);
  }

  getProjects(): Observable<TrackForeverProject[]> {
    return this.http.get<TrackForeverProject[]>(`${environment.apiUrl}/projects`);
  }
}
