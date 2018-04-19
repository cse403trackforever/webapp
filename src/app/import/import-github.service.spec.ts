import { TestBed, inject } from '@angular/core/testing';

import { ImportGithubService } from './import-github.service';
import { FetchGithubService } from './api/fetch-github.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { GitHubProject } from './models/github/github-project';
import * as mockGithubProject from '../../assets/mockGithubProject.json';

describe('ImportGithubService', () => {
  let fetchServiceStub: Partial<FetchGithubService>;

  beforeEach(() => {
    fetchServiceStub = {
      fetchProject(ownerName: String, projectName: String): Observable<GitHubProject> {
        return Observable.of(<any> mockGithubProject);
      }
    };

    TestBed.configureTestingModule({
      providers: [
        ImportGithubService,
        {
          provide: FetchGithubService,
          useValue: fetchServiceStub
        }
      ],
    });
  });

  it('should be created', inject([ImportGithubService], (service: ImportGithubService) => {
    expect(service).toBeTruthy();
  }));
});
