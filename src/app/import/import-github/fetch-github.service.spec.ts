import { Observable, of } from 'rxjs';
import { TestBed, async } from '@angular/core/testing';

import { FetchGithubService } from './fetch-github.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as mockGithubProject from './models/mock/mockGithubProject.json';
import * as mockGithubIssues from './models/mock/mockGithubIssues.json';
import * as mockGithubComments from './models/mock/mockGithubComments.json';
import { GitHubProject } from './models/github-project';
import { GitHubIssue } from './models/github-issue';
import { GitHubComment } from './models/github-comment';
import { AuthenticationService } from '../../authentication/authentication.service';

describe('FetchGithubService', () => {
  let service: FetchGithubService;
  let httpTestingController: HttpTestingController;
  let authServiceStub: Partial<AuthenticationService>;
  const query = '?access_token=mock_token';

  beforeEach(() => {
    // stub auth service
    authServiceStub = {
      getToken(): Observable<string> {
        return of('mock_token');
      }
    };

    TestBed.configureTestingModule({
      providers: [
        FetchGithubService,
        {
          provide: AuthenticationService,
          useValue: authServiceStub
        }
      ],
      imports: [HttpClientTestingModule]
    });

    service = TestBed.get(FetchGithubService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch a project', async(() => {
    const ownerName = 'cse403trackforever';
    const projectName = 'webapp';
    const p = <GitHubProject><any>mockGithubProject;

    service.fetchProject(ownerName, projectName)
      .subscribe(project => expect(project).toEqual(p));

    const req = httpTestingController.expectOne(r => r.url.endsWith(`/${ownerName}/${projectName}${query}`));
    expect(req.request.method).toEqual('GET');

    req.flush(p);
  }));

  it('should fetch issues', async(() => {
    const ownerName = 'cse403trackforever';
    const projectName = 'webapp';
    const testIssues = <Array<GitHubIssue>><any>mockGithubIssues;

    service.fetchIssues(ownerName, projectName, 1)
      .subscribe(issues => expect(issues.body).toEqual(testIssues));

    const req = httpTestingController
      .expectOne(r => r.url.endsWith(`/${ownerName}/${projectName}/issues${query}&per_page=100&state=all&page=1`));
    expect(req.request.method).toEqual('GET');

    req.flush(testIssues);
  }));

  it('should fetch comments', async(() => {
    const commentsUrl = 'https://my_comments';
    const testComments = <Array<GitHubComment>><any>mockGithubComments;

    service.fetchComments(commentsUrl)
      .subscribe(comments => expect(comments).toEqual(testComments));

    const req = httpTestingController.expectOne(r => r.url === commentsUrl + query);
    expect(req.request.method).toEqual('GET');

    req.flush(testComments);
  }));
});
