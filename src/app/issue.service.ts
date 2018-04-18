import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Observable} from 'rxjs/Observable';
import {ProjectSummary} from './shared/models/project-summary';
import {Project} from './shared/models/project';
import {Issue} from './shared/models/issue';

/**
 * The IssueService fetches issues and project information for viewing.
 */
@Injectable()
export class IssueService {
  constructor(private http: HttpClient) { }

  getProjects(): Observable<ProjectSummary[]> {
    return this.http.get<ProjectSummary[]>(`${environment.apiUrl}/projects`);
  }

  getProject(projectId: String): Observable<Project> {
    return this.http.get<Project>(`${environment.apiUrl}/projects/${projectId}`);
  }

  getIssue(projectId: String, issueId: String): Observable<Issue> {
    return this.http.post<Issue>(`${environment.apiUrl}/issues`, {
      projectId,
      issueId
    });
  }
}
