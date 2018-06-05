import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FetchRedmineService } from './fetch-redmine.service';
import { RedmineProject } from './models/redmine-project';
import { RedmineIssueArray } from './models/redmine-issueArray';
import { mockRedmineIssueArray } from './models/mock/mock-redmine-issueArray';
import { mockRedmineProject } from './models/mock/mock-redmine-project';
import { RedmineIssue } from './models/redmine-issue';

describe('FetchRedmineService', () => {
  let service: FetchRedmineService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FetchRedmineService],
      imports: [HttpClientTestingModule]
    });

    service = TestBed.get(FetchRedmineService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch a project', async(() => {
    const projectName = 'my-project';
    const baseUrl = 'https://www.redmine.org';
    const p: RedmineProject = <any> mockRedmineProject;

    service.fetchProject(baseUrl, projectName)
      .subscribe(project => expect(project).toEqual(p));

    const req = httpTestingController.expectOne(r => r.url.endsWith(`/projects/${projectName}.json`));
    expect(req.request.method).toEqual('GET');

    req.flush({project: p});
  }));

  it('should fetch issues', async(() => {
    const projectName = 'my-project';
    const baseUrl = 'https://www.redmine.org';
    const projectID = 123;
    const limit = 10;
    const offset = 2;
    const arr: RedmineIssueArray = <any> mockRedmineIssueArray;

    service.fetchIssues(baseUrl, projectName, projectID, limit, offset)
      .subscribe(issueArray => expect(issueArray).toEqual(arr));

    const req = httpTestingController
      .expectOne(r => {
        return r.url.endsWith(`/issues.json`)
          && r.params.get('project_id') === '123'
          && r.params.get('limit') === '10'
          && r.params.get('offset') === '2'
          && r.params.get('status_id') === '*';
      });
    expect(req.request.method).toEqual('GET');

    req.flush(arr);
  }));

  it('should fetch an issue', async(() => {
    const baseUrl = 'https://www.redmine.org';
    const projectID = 123;
    const issueID = 456;
    const i: RedmineIssue = mockRedmineIssueArray.issues[0];

    service.fetchIssue(baseUrl, projectID, issueID)
      .subscribe(issue => expect(issue).toEqual(i));

    const req = httpTestingController
      .expectOne(r => {
        return r.url.endsWith(`/issues/456.json`)
          && r.params.get('project_id') === '123'
          && r.params.get('include') === 'journals'
          && r.params.get('status_id') === '*';
      });
    expect(req.request.method).toEqual('GET');

    req.flush({issue: i});
  }));
});
