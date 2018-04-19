import { Injectable } from '@angular/core';
import { Project } from '../shared/models/project';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { mockProject } from '../shared/models/mock/mock-project';
import { FetchGithubService } from './api/fetch-github.service';
import { GitHubProject } from './models/github/github-project';

@Injectable()
export class ImportGithubService {

  constructor(private fetchService: FetchGithubService) { }

  importProject(ownerName: String, projectName: String): Observable<Project> {
    return this.fetchService.fetchProject(ownerName, projectName)
      .map((project: GitHubProject) => {
        // TODO convert GitHubProject to Project
        return mockProject;
      });
  }

}
