import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IssueService } from './issue.service';
import { Observable } from 'rxjs/Observable';
import { Issue } from '../shared/models/issue';
import { Project } from '../shared/models/project';
import { ProjectSummary } from '../shared/models/project-summary';
import { environment } from '../../environments/environment';

/**
 * Fetches issues from a TrackForever server
 */
@Injectable()
export class OnlineIssueService implements IssueService {

  constructor(private http: HttpClient) { }

  getIssue(projectKey: string, issueId: String): Observable<Issue> {
    return this.http.post<Issue>(`${environment.apiUrl}/issues`, {
      projectKey,
      issueId
    });
  }

  getProject(projectKey: string): Observable<Project> {
    return this.http.get<Project>(`${environment.apiUrl}/projects/${projectKey}`);
  }

  getProjects(): Observable<ProjectSummary[]> {
    return this.http.get<ProjectSummary[]>(`${environment.apiUrl}/projects`);
  }
}
