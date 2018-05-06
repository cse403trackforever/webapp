import { TestBed, async } from '@angular/core/testing';

import { FetchGithubService } from './fetch-github.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as mockGithubProject from '../models/github/mock/mockGithubProject.json';
import * as mockGithubIssues from '../models/github/mock/mockGithubIssues.json';
import * as mockGithubComments from '../models/github/mock/mockGithubComments.json';
import { GitHubProject } from '../models/github/github-project';
import { GitHubIssue } from '../models/github/github-issue';
import { GitHubComment } from '../models/github/github-comment';

describe('FetchGithubService', () => {
  let service: FetchGithubService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FetchGithubService],
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
    const p = <GitHubProject> <any> mockGithubProject;

    service.fetchProject(ownerName, projectName)
      .subscribe(project => expect(project).toEqual(p));

    const req = httpTestingController.expectOne(r => r.url.endsWith(`/${ownerName}/${projectName}`));
    expect(req.request.method).toEqual('GET');

    req.flush(p);
  }));

  it('should fetch issues', async(() => {
    const ownerName = 'cse403trackforever';
    const projectName = 'webapp';
    const testIssues = <Array<GitHubIssue>> <any> mockGithubIssues;

    service.fetchIssues(ownerName, projectName)
      .subscribe(issues => expect(issues).toEqual(testIssues));

    const req = httpTestingController.expectOne(r => r.url.endsWith(`/${ownerName}/${projectName}/issues`));
    expect(req.request.method).toEqual('GET');

    req.flush(testIssues);
  }));

  it('should fetch comments', async(() => {
    const commentsUrl = 'https://my_comments';
    const testComments = <Array<GitHubComment>> <any> mockGithubComments;

    service.fetchComments(commentsUrl)
      .subscribe(comments => expect(comments).toEqual(testComments));

    const req = httpTestingController.expectOne(commentsUrl);
    expect(req.request.method).toEqual('GET');

    req.flush(testComments);
  }));
});
