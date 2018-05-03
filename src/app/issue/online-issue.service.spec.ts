import { TestBed } from '@angular/core/testing';

import { OnlineIssueService } from './online-issue.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Issue } from '../shared/models/issue';
import { mockIssue } from '../shared/models/mock/mock-issue';
import { environment } from '../../environments/environment';
import { Project } from '../shared/models/project';
import { mockProject } from '../shared/models/mock/mock-project';
import { ProjectSummary } from '../shared/models/project-summary';
import { mockProjectSummary } from '../shared/models/mock/mock-project-summary';

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
    const testIssue: Issue = mockIssue;
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
    const testProject: Project = mockProject;
    const projectKey = 'my-project';

    service.getProject(projectKey)
      .subscribe(project => expect(project).toEqual(testProject));

    const req = httpTestingController.expectOne(`${environment.apiUrl}/projects/${projectKey}`);
    expect(req.request.method).toEqual('GET');

    req.flush(testProject);

    httpTestingController.verify();
  });

  it('should get project summaries', () => {
    const testProjects: ProjectSummary[] = [mockProjectSummary];

    service.getProjects()
      .subscribe(projects => expect(projects).toEqual(testProjects));

    const req = httpTestingController.expectOne(`${environment.apiUrl}/projects`);
    expect(req.request.method).toEqual('GET');

    req.flush(testProjects);

    httpTestingController.verify();
  });
});
