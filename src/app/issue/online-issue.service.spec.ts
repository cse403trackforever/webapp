import { ConvertTrackforeverService } from '../import/import-trackforever/convert-trackforever.service';
import { TestBed, async } from '@angular/core/testing';

import { OnlineIssueService } from './online-issue.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { mockTrackforeverProject } from '../import/models/trackforever/mock/mock-trackforever-project';

describe('OnlineIssueService', () => {
  let service: OnlineIssueService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OnlineIssueService],
      imports: [HttpClientTestingModule]
    });

    service = TestBed.get(OnlineIssueService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    // assert that there are no outstanding requests
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // see https://angular.io/guide/http#expecting-and-answering-requests
  it('should get an issue', async(() => {
    const testIssue = mockTrackforeverProject.issues.entries().next().value[1];
    const projectKey = 'my-project';
    const issueId = '123';

    service.getIssue(projectKey, issueId)
      .subscribe(issue => expect(issue).toEqual(testIssue));

    const req = httpTestingController.expectOne(`${environment.apiUrl}/issues/${projectKey}/${issueId}`);
    expect(req.request.method).toEqual('GET');

    // response with mock data
    req.flush(testIssue);
  }));

  it('should set some issues', async(() => {
    const issues = Array.from(mockTrackforeverProject.issues).map(e => e[1]);
    const map = new Map([[mockTrackforeverProject.id, issues]]);

    const projectIssueMap = new Map<string, Map<string, string>>([[mockTrackforeverProject.id, new Map()]]);

    service.setIssues(map).subscribe();

    const req = httpTestingController.expectOne(`${environment.apiUrl}/issues`);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(OnlineIssueService.mapToObject(map));

    req.flush(projectIssueMap);
  }));

  it('should get some issues', async(() => {
    const issues = Array.from(mockTrackforeverProject.issues).map(e => e[1].id);
    const map = new Map([[mockTrackforeverProject.id, issues]]);

    service.getRequestedIssues(map).subscribe();

    const req = httpTestingController.expectOne(`${environment.apiUrl}/issues`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(OnlineIssueService.mapToObject(map));

    req.flush(mockTrackforeverProject.issues);
  }));

  it('should get a project', async(() => {
    const testProject = mockTrackforeverProject;
    const projectKey = 'my-project';

    service.getProject(projectKey)
      .subscribe(project => expect(project).toEqual(testProject));

    const req = httpTestingController.expectOne(`${environment.apiUrl}/projects/${projectKey}`);
    expect(req.request.method).toEqual('GET');

    req.flush(ConvertTrackforeverService.toJson(testProject));
  }));

  it('should set data for projects', async(() => {
    service.setProjects([mockTrackforeverProject]).subscribe();

    const hash = new Map<string, string>();

    const req = httpTestingController.expectOne(`${environment.apiUrl}/projects`);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(ConvertTrackforeverService.toJson([mockTrackforeverProject], false));

    req.flush(hash);
  }));

  it('should get project summaries', async(() => {
    const testProjects = [ mockTrackforeverProject ];

    service.getProjects()
      .subscribe(projects => expect(projects).toEqual(testProjects));

    const req = httpTestingController.expectOne(`${environment.apiUrl}/projects`);
    expect(req.request.method).toEqual('GET');

    const json = testProjects.reduce((s, v) => s + ConvertTrackforeverService.toJson(v), '[') + ']';
    console.log(json);

    req.flush(json);
  }));

  it('should get some projects', async(() => {
    service.getRequestedProjects([mockTrackforeverProject.id]).subscribe();

    const req = httpTestingController.expectOne(`${environment.apiUrl}/projects`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual([mockTrackforeverProject.id]);

    req.flush(JSON.stringify([mockTrackforeverProject]));
  }));
});
