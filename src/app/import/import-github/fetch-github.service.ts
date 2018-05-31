import { AuthenticationService } from './../../authentication/authentication.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { GitHubProject } from './models/github-project';
import { GitHubIssue } from './models/github-issue';
import { GitHubComment } from './models/github-comment';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class FetchGithubService {
  private baseUrl = 'https://api.github.com/repos';
  private query: string;

  constructor(private http: HttpClient, private authService: AuthenticationService) {
    const tokenObservable = this.authService.getToken();
    tokenObservable.subscribe((token) => this.query = '?access_token=' + token);
  }

  fetchProject(ownerName: string, projectName: string): Observable<GitHubProject> {
    if (!this.query) {
      return throwError(new Error('No auth token provided'));
    }
    return this.http.get<GitHubProject>(`${this.baseUrl}/${ownerName}/${projectName}${this.query}`);
  }

  fetchIssues(ownerName: string, projectName: string, page: number): Observable<HttpResponse<GitHubIssue[]>> {
    if (!this.query) {
      return throwError(new Error('No auth token provided'));
    }
    return this.http.get<Array<GitHubIssue>>(
      `${this.baseUrl}/${ownerName}/${projectName}/issues${this.query}&per_page=100&state=all&page=${page}`,
      {observe: 'response'}
   );
  }

  fetchComments(commentsUrl: string): Observable<GitHubComment[]> {
    if (!this.query) {
      return throwError(new Error('No auth token provided'));
    }
    return this.http.get<Array<GitHubComment>>(commentsUrl + this.query);
  }

}
