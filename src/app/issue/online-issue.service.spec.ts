import { TestBed } from '@angular/core/testing';

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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // see https://angular.io/guide/http#expecting-and-answering-requests
  it('should get an issue', () => {
    const testIssue = mockTrackforeverProject.issues.entries().next().value[1];
    const projectKey = 'my-project';
    const issueId = '123';

    service.getIssue(projectKey, issueId)
      .subscribe(issue => expect(issue).toEqual(testIssue));

    const req = httpTestingController.expectOne(`${environment.apiUrl}/issues`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ projectKey, issueId });

    // response with mock data
    req.flush(testIssue);

    // assert that there are no outstanding requests
    httpTestingController.verify();
  });

  it('should get a project', () => {
    const testProject = mockTrackforeverProject;
    const projectKey = 'my-project';

    service.getProject(projectKey)
      .subscribe(project => expect(project).toEqual(testProject));

    const req = httpTestingController.expectOne(`${environment.apiUrl}/projects/${projectKey}`);
    expect(req.request.method).toEqual('GET');

    req.flush(testProject);

    httpTestingController.verify();
  });

  it('should get project summaries', () => {
    const testProjects = [ mockTrackforeverProject ];

    service.getProjects()
      .subscribe(projects => expect(projects).toEqual(testProjects));

    const req = httpTestingController.expectOne(`${environment.apiUrl}/projects`);
    expect(req.request.method).toEqual('GET');

    req.flush(testProjects);

    httpTestingController.verify();
  });
});
