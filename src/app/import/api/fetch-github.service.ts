import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GitHubProject } from '../models/github/github-project';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FetchGithubService {
  private baseUrl = 'https://api.github.com/repos';

  constructor(private http: HttpClient) { }

  fetchProject(ownerName: String, projectName: String): Observable<GitHubProject> {
    return this.http.get<GitHubProject>(`${this.baseUrl}/${ownerName}/${projectName}`);
  }

  // TODO add other needed fetch methods

}
