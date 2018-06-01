import { AuthenticationService } from './../../authentication/authentication.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { GitHubProject } from './models/github-project';
import { GitHubIssue } from './models/github-issue';
import { GitHubComment } from './models/github-comment';
import { Observable } from 'rxjs';

/**
 * Fetches data from the GitHub API for use in project import
 * See <https://developer.github.com/v3/>
 */
@Injectable()
export class FetchGithubService {
  private baseUrl = 'https://api.github.com/repos';
  private query: string;

  constructor(private http: HttpClient, private authService: AuthenticationService) {
    const token = this.authService.getToken();
    this.query = '?access_token=' + token;
  }

  fetchProject(ownerName: string, projectName: string): Observable<GitHubProject> {
    return this.http.get<GitHubProject>(`${this.baseUrl}/${ownerName}/${projectName}${this.query}`);
  }

  fetchIssues(ownerName: string, projectName: string, page: number): Observable<HttpResponse<GitHubIssue[]>> {
    return this.http.get<Array<GitHubIssue>>(
      `${this.baseUrl}/${ownerName}/${projectName}/issues${this.query}&per_page=100&state=all&page=${page}`,
      {observe: 'response'}
   );
  }

  fetchComments(commentsUrl: string): Observable<GitHubComment[]> {
    return this.http.get<Array<GitHubComment>>(commentsUrl + this.query);
  }

}
