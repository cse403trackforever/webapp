import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IssueService } from './issue.service';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { HashResponse } from '../sync/hash-response';

/**
 * Fetches issues from a TrackForever server
 */
@Injectable()
export class OnlineIssueService implements IssueService {

  constructor(private http: HttpClient) { }

  getIssue(projectKey: string, issueId: string): Observable<TrackForeverIssue> {
    return this.http.post<TrackForeverIssue>(`${environment.apiUrl}/issues`, {
      projectKey,
      issueId
    });
  }

  setIssue(issue: TrackForeverIssue) {
    return this.http.put(`${environment.apiUrl}/issue`, issue);
  }

  setIssues(issues: Map<string, Array<TrackForeverIssue>>) {
    return this.http.put(`${environment.apiUrl}/issues`, issues);
  }

  getRequestedIssues(issueIds: Map<string, Array<string>>): Observable<Map<string, Array<TrackForeverIssue>>> {
    return this.http.post<Map<string, Array<TrackForeverIssue>>>(`${environment.apiUrl}/issues`, issueIds);
  }

  getProject(projectKey: string): Observable<TrackForeverProject> {
    return this.http.get<TrackForeverProject>(`${environment.apiUrl}/projects/${projectKey}`);
  }

  getProjects(): Observable<Array<TrackForeverProject>> {
    return this.http.get<Array<TrackForeverProject>>(`${environment.apiUrl}/projects`);
  }

  setProjects(projects: Array<TrackForeverProject>) {
    return this.http.put(`${environment.apiUrl}/projects`, projects);
  }

  setProject(project: TrackForeverProject) {
    return this.http.put(`${environment.apiUrl}/project`, project);
  }

  getRequestedProjects(projectIds: Array<string>): Observable<Array<TrackForeverProject>> {
    return this.http.post<Array<TrackForeverProject>>(`${environment.apiUrl}/projects`, projectIds);
  }

  getHashes(): Observable<Map<string, HashResponse>> {
    return this.http.get<Map<string, HashResponse>>(`${environment.apiUrl}/hashes`);
  }
}
