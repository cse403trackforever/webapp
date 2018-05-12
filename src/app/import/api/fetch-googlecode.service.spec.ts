import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FetchGoogleCodeService } from './fetch-googlecode.service';
import * as mockGoogleCodeProject from '../models/googlecode/mock/project.json';
import * as mockGoogleCodeIssues from '../models/googlecode/mock/issues-1.json';
import * as mockGoogleCodeIssuePage from '../models/googlecode/mock/issues-page-1.json';
import { GoogleCodeProject } from '../models/googlecode/googlecode-project';
import { GoogleCodeIssue } from '../models/googlecode/googlecode-issue';
import { GoogleCodeIssuePage } from '../models/googlecode/googlecode-issuepage';

describe('FetchGoogleCodeService', () => {
  let service: FetchGoogleCodeService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FetchGoogleCodeService],
      imports: [HttpClientTestingModule]
    });

    service = TestBed.get(FetchGoogleCodeService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch a project', async(() => {
    const projectName = 'my-project';
    const p: GoogleCodeProject = <any> mockGoogleCodeProject;

    service.fetchProject(projectName)
      .subscribe(project => expect(project).toEqual(p));

    const req = httpTestingController.expectOne(r => r.url.endsWith(`/${projectName}/project.json`));
    expect(req.request.method).toEqual('GET');

    req.flush(p);
  }));

  it('should fetch an issue', async(() => {
    const projectName = 'my-project';
    const issueNumber = 123;
    const i: GoogleCodeIssue = (<any> mockGoogleCodeIssues)[0];

    service.fetchIssue(projectName, issueNumber)
      .subscribe(issue => expect(issue).toEqual(i));

    const req = httpTestingController.expectOne(r => r.url.endsWith(`/${projectName}/issues/issue-${issueNumber}.json`));
    expect(req.request.method).toEqual('GET');

    req.flush(i);
  }));

  it('should fetch an issues page', async(() => {
    const projectName = 'my-project';
    const pageNumber = 1;
    const p: GoogleCodeIssuePage = <any> mockGoogleCodeIssuePage;

    service.fetchIssuePage(projectName, pageNumber)
      .subscribe(page => expect(page).toEqual(p));

    const req = httpTestingController.expectOne(r => r.url.endsWith(`/${projectName}/issues-page-${pageNumber}.json`));
    expect(req.request.method).toEqual('GET');

    req.flush(p);
  }));
});
