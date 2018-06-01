import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    const url = `${this.corsUrl}${baseUrl}/issues.json?projectID=${projectID}&limit=${limit}&offset=${offset}`;
    return this.http.get<RedmineIssueArray>(url);
  }

  fetchIssue(baseUrl: string, projectID: number, issueID: number): Observable<RedmineIssue> {
    return this.http.get<{issue: RedmineIssue}>(`${this.corsUrl}${baseUrl}/issues/${issueID}.json?project_id=${projectID}`)
      .pipe(map(obj => obj.issue));
  }
}
