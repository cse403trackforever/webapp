import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { RedmineProject } from '../models/redmine/redmine-project';
import { RedmineIssue } from '../models/redmine/redmine-issue';
import { RedmineIssueArray } from '../models/redmine/redmine-issueArray';

@Injectable()
export class FetchRedmineService {
  private baseUrl: String = 'https://cors-anywhere.herokuapp.com/https://www.redmine.org';
  constructor(private http: HttpClient) { }

  fetchProject(projectName: String): Observable<RedmineProject> {
    return this.http.get<RedmineProject>(`${this.baseUrl}/projects/${projectName}.json`);
  }

  fetchIssues(projectName: String, projectID: Number, limit: Number, offset: Number): Observable<RedmineIssueArray> {
    const url = `${this.baseUrl}/issues.json?projectID=${projectID}&limit=${limit}&offset=${offset}`;
    return this.http.get<RedmineIssueArray>(url);
  }

  fetchIssue(projectID: Number, issueID: Number): Observable<RedmineIssue> {
    return this.http.get<RedmineIssue>(`${this.baseUrl}/issues/${issueID}.json?project_id=${projectID}`);
  }

  setBaseUrl(newUrl: String) { // Projects are probably not hosted on www.redmine.org
    this.baseUrl = newUrl;
  }
}
