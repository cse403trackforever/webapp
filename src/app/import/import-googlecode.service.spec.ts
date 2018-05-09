import { TestBed, async } from '@angular/core/testing';

import { FetchGoogleCodeService } from './api/fetch-googlecode.service';
import { ImportGoogleCodeService } from './import-googlecode.service';
import * as mockGoogleCodeProject from './models/googlecode/mock/project.json';
import * as mockGoogleCodeIssuePage from './models/googlecode/mock/issues-page-1.json';
import * as mockGoogleCodeIssues from './models/googlecode/mock/issues.json';
import { GoogleCodeIssue } from './models/googlecode/googlecode-issue';
import { Observable } from 'rxjs/Observable';
import { GoogleCodeProject } from './models/googlecode/googlecode-project';
import { GoogleCodeIssuePage } from './models/googlecode/googlecode-issuepage';
import { TrackForeverIssue } from './models/trackforever/trackforever-issue';
import { TrackForeverComment } from './models/trackforever/trackforever-comment';
import { GoogleCodeComment } from './models/googlecode/googlecode-comment';

describe('ImportGoogleCodeService', () => {
  let service: ImportGoogleCodeService;
  let fetchServiceSpy: jasmine.SpyObj<FetchGoogleCodeService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('FetchGoogleCodeService', ['fetchProject', 'fetchIssue', 'fetchIssuePage']);

    TestBed.configureTestingModule({
      providers: [
        ImportGoogleCodeService,
        {
          provide: FetchGoogleCodeService,
          useValue: spy
        }
      ],
    });

    service = TestBed.get(ImportGoogleCodeService);
    fetchServiceSpy = TestBed.get(FetchGoogleCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should import', async(() => {
    const projectName = 'my-project';
    const mockProject: GoogleCodeProject = <any> mockGoogleCodeProject;
    const mockIssuePage: GoogleCodeIssuePage = <any> mockGoogleCodeIssuePage;
    const mockIssues: GoogleCodeIssue[] = <any> mockGoogleCodeIssues;

    fetchServiceSpy.fetchProject.and.returnValue(Observable.of(mockProject));
    fetchServiceSpy.fetchIssuePage.and.returnValue(Observable.of(mockIssuePage));
    fetchServiceSpy.fetchIssue.and.returnValue(Observable.of(mockIssues[0]));

    // this makes some sense to do but I can't get it to work
    // fetchServiceSpy.fetchIssue.and.returnValues(mockIssues.map(i => Observable.of(i)));

    service.importProject(projectName)
      .subscribe(project => {
        expect(fetchServiceSpy.fetchIssue.calls.count()).toEqual(mockIssuePage.issues.length);

        expect(project.hash).toEqual('3443d34492d44df1d017a4ef10b350a2e367bb6b0fe59de032031eb07c1aef8b7' +
        '5c58781dd2659a658d4aff36090c0f71fe86d53c91c40bf5381f10f5deea3bd');
        expect(project.prevHash).toEqual('');
        expect(project.id).toEqual(mockProject.name);
        expect(project.ownerName).toEqual('');
        expect(project.name).toEqual(mockProject.name);
        expect(project.description).toEqual(mockProject.description);
        expect(project.source).toEqual('Google Code');
        matchIssues(project.issues, mockIssues, mockProject.name);
      });
  }));

  function matchIssues(issues: TrackForeverIssue[], gcIssues: GoogleCodeIssue[], projectId: string): void {
    issues.forEach(issue => {
      const gc: GoogleCodeIssue = gcIssues.find(i => i.id.toString() === issue.id);
      expect(gc).toBeTruthy();

      expect(issue.hash).toEqual('4ec5f9a84e8044dbb59623b2d1738b6626458e5b639a878f8af64db6c7c21e35f9cd0810658faa' +
      '030177df30f658cf2bf5469d4e9066dc997805bb1c440eb652');
      expect(issue.prevHash).toEqual('');
      expect(issue.id).toEqual(gc.id.toString());
      expect(issue.projectId).toEqual(projectId, 'project id should match');
      expect(issue.status).toEqual(gc.status);
      expect(issue.summary).toEqual(gc.summary);
      expect(issue.labels).toEqual(gc.labels);
      matchComments(issue.comments, gc.comments);
      expect(issue.submitterName).toEqual('Anonymous');
      expect(issue.assignees).toEqual([]);
      expect(issue.timeCreated).toEqual(-1);
      expect(issue.timeUpdated).toEqual(-1);
      expect(issue.timeClosed).toEqual(-1);
    });
  }

  function matchComments(comments: TrackForeverComment[], gcComments: GoogleCodeComment[]): void {
    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      const gc = gcComments[i];
      expect(comment.content).toEqual(gc.content, 'comment content should match');
      expect(comment.commenterName).toEqual(gc.id.toString(), 'comment name should match');
    }
  }
});
