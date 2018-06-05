import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RedmineProject } from './models/redmine-project';
import { RedmineIssue } from './models/redmine-issue';
import { RedmineIssueArray } from './models/redmine-issueArray';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Fetches data from the Redmine API for use in project import.
 * See <http://www.redmine.org/projects/redmine/wiki/Rest_api>
 */
@Injectable()
export class FetchRedmineService {
  private corsUrl = 'https://cors-anywhere.herokuapp.com/';
  constructor(private http: HttpClient) { }

  fetchProject(baseUrl: string, projectName: string): Observable<RedmineProject> {
    return this.http.get<{project: RedmineProject}>(`${this.corsUrl}${baseUrl}/projects/${projectName}.json`)
      .pipe(map(obj => obj.project));
  }

  fetchIssues(baseUrl: string, projectName: string, projectID: number, limit: number, offset: number): Observable<RedmineIssueArray> {
    return this.http.get<RedmineIssueArray>(`${this.corsUrl}${baseUrl}/issues.json`, {
      params: new HttpParams()
        .set('project_id', projectID.toString())
        .set('limit', limit.toString())
        .set('offset', offset.toString())
        .set('status_id', '*')
    });
  }

  fetchIssue(baseUrl: string, projectID: number, issueID: number): Observable<RedmineIssue> {
    return this.http.get<{issue: RedmineIssue}>(`${this.corsUrl}${baseUrl}/issues/${issueID}.json`, {
      params: new HttpParams()
        .set('project_id', projectID.toString())
        .set('include', 'journals')
        .set('status_id', '*')
    }).pipe(map(obj => obj.issue));
  }
}
