import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { GitHubProject } from '../models/github/github-project';
import { GitHubIssue } from '../models/github/github-issue';
import { GitHubComment } from '../models/github/github-comment';

@Injectable()
export class FetchGithubService {
  private baseUrl = 'https://api.github.com/repos';

  constructor(private http: HttpClient) { }

  fetchProject(ownerName: String, projectName: String): Observable<GitHubProject> {
    return this.http.get<GitHubProject>(`${this.baseUrl}/${ownerName}/${projectName}`);
  }

  fetchIssues(ownerName: String, projectName: String): Observable<Array<GitHubIssue>> {
    return this.http.get<Array<GitHubIssue>>(`${this.baseUrl}/${ownerName}/${projectName}/issues`);
  }

  fetchComments(commentsUrl: String): Observable<Array<GitHubComment>> {
    return this.http.get<Array<GitHubComment>>(commentsUrl.toString());
  }

}