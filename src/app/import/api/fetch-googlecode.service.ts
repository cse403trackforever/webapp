import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { GoogleCodeProject } from '../models/googlecode/googlecode-project';
import { GoogleCodeIssue } from '../models/googlecode/googlecode-issue';
import { GoogleCodeIssuePage } from '../models/googlecode/googlecode-issuepage';

@Injectable()
export class FetchGoogleCodeService {
  private baseUrl = 'https://storage.googleapis.com/google-code-archive/v2/code.google.com/';

  constructor(private http: HttpClient) { }

  fetchProject(projectName: String): Observable<GoogleCodeProject> {
    return this.http.get<GoogleCodeProject>(`${this.baseUrl}/${projectName}/project.json`);
  }

  fetchIssue(projectName: String, issueNumber: Number): Observable<GoogleCodeIssue> {
    return this.http.get<GoogleCodeIssue>(`${this.baseUrl}/${projectName}/issues/issue-${issueNumber}.json`);
  }

  fetchIssuePage(projectName: String, pageNumber: Number): Observable<GoogleCodeIssuePage> {
    return this.http.get<GoogleCodeIssuePage>(`${this.baseUrl}/${projectName}/issues-page-${pageNumber}.json`);
  }

}
