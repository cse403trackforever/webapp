import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { RedmineProject } from './models/redmine-project';
import { RedmineIssue } from './models/redmine-issue';
import { RedmineIssueArray } from './models/redmine-issueArray';

@Injectable()
export class FetchRedmineService {
  private corsUrl = 'https://cors-anywhere.herokuapp.com/';
  private baseUrl = 'https://cors-anywhere.herokuapp.com/https://www.redmine.org';
  constructor(private http: HttpClient) { }

  fetchProject(projectName: string): Observable<RedmineProject> {
    return this.http.get<RedmineProject>(`${this.baseUrl}/projects/${projectName}.json`);
  }

  fetchIssues(projectName: string, projectID: number, limit: number, offset: number): Observable<RedmineIssueArray> {
    const url = `${this.baseUrl}/issues.json?projectID=${projectID}&limit=${limit}&offset=${offset}`;
    return this.http.get<RedmineIssueArray>(url);
  }

  fetchIssue(projectID: number, issueID: number): Observable<RedmineIssue> {
    return this.http.get<RedmineIssue>(`${this.baseUrl}/issues/${issueID}.json?project_id=${projectID}`);
  }

  setBaseUrl(newUrl: string) { // Projects are probably not hosted on www.redmine.org
    this.baseUrl = this.corsUrl + newUrl;
  }
}
