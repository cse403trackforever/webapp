import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GoogleCodeProject } from './models/googlecode-project';
import { GoogleCodeIssue } from './models/googlecode-issue';
import { GoogleCodeIssuePage } from './models/googlecode-issuepage';
import { Observable } from 'rxjs';

/**
 * Fetches data from the Google Code archive for use in project import.
 * See <https://code.google.com/archive/schema>
 */
@Injectable()
export class FetchGoogleCodeService {
  // use a proxy server to allow CORS
  private baseUrl = 'https://cors-anywhere.herokuapp.com/https://storage.googleapis.com/google-code-archive/v2/code.google.com';

  constructor(private http: HttpClient) { }

  fetchProject(projectName: string): Observable<GoogleCodeProject> {
    return this.http.get<GoogleCodeProject>(`${this.baseUrl}/${projectName}/project.json`);
  }

  fetchIssue(projectName: string, issueNumber: number): Observable<GoogleCodeIssue> {
    return this.http.get<GoogleCodeIssue>(`${this.baseUrl}/${projectName}/issues/issue-${issueNumber}.json`);
  }

  fetchIssuePage(projectName: string, pageNumber: number): Observable<GoogleCodeIssuePage> {
    return this.http.get<GoogleCodeIssuePage>(`${this.baseUrl}/${projectName}/issues-page-${pageNumber}.json`);
  }

}
