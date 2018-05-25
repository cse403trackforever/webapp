import { TestBed, async } from '@angular/core/testing';

import { FetchGoogleCodeService } from './fetch-googlecode.service';
import { ImportGoogleCodeService } from './import-googlecode.service';
import * as mockGoogleCodeProject from './models/mock/project.json';
import * as mockGoogleCodeIssuePage1 from './models/mock/issues-page-1.json';
import * as mockGoogleCodeIssuePage2 from './models/mock/issues-page-2.json';
import * as mockGoogleCodeIssuePage3 from './models/mock/issues-page-3.json';
import * as mockGoogleCodeIssues1 from './models/mock/issues-1.json';
import * as mockGoogleCodeIssues2 from './models/mock/issues-2.json';
import * as mockGoogleCodeIssues3 from './models/mock/issues-3.json';
import { GoogleCodeIssue } from './models/googlecode-issue';
import { Observable } from 'rxjs/Observable';
import { GoogleCodeProject } from './models/googlecode-project';
import { GoogleCodeIssuePage } from './models/googlecode-issuepage';
import { TrackForeverIssue } from '../models/trackforever/trackforever-issue';
import { TrackForeverComment } from '../models/trackforever/trackforever-comment';
import { GoogleCodeComment } from './models/googlecode-comment';

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
    const mockIssuePages: GoogleCodeIssuePage[] = <any> [mockGoogleCodeIssuePage1, mockGoogleCodeIssuePage2, mockGoogleCodeIssuePage3];
    const mockIssues: GoogleCodeIssue[] = (<any> [mockGoogleCodeIssues1, mockGoogleCodeIssues2, mockGoogleCodeIssues3])
      .reduce((acc, v) => acc.concat(v));

    fetchServiceSpy.fetchProject.and.returnValue(Observable.of(mockProject));

    let pageIndex = 0;
    fetchServiceSpy.fetchIssuePage.and.callFake(() => Observable.of(mockIssuePages[pageIndex++]));

    let issueIndex = 0;
    fetchServiceSpy.fetchIssue.and.callFake(() => Observable.of(mockIssues[issueIndex++]));

    service.importProject({projectName, useRandomNames: true})
      .subscribe(project => {
        console.log(project);

        // check that the correct number of API calls were made
        expect(fetchServiceSpy.fetchIssuePage.calls.count()).toEqual(mockIssuePages.length);
        expect(fetchServiceSpy.fetchIssue.calls.count()).toEqual(mockIssues.length);

        // check that the number of issues matches
        expect(project.issues.size).toBe(mockIssues.length);

        expect(project.prevHash).toEqual('');
        expect(project.id).toEqual(`GoogleCode:${mockProject.name}`);
        expect(project.ownerName).toEqual('');
        expect(project.name).toEqual(mockProject.name);
        expect(project.description).toEqual(mockProject.description);
        expect(project.source).toEqual('Google Code');
        matchIssues(project.issues, mockIssues, mockProject.name);
      });
  }));

  function matchIssues(issues: Map<string, TrackForeverIssue>, gcIssues: GoogleCodeIssue[], projectId: string): void {
    issues.forEach(issue => {
      const gc: GoogleCodeIssue = gcIssues.find(i => i.id.toString() === issue.id);
      expect(gc).toBeTruthy();

      expect(issue.prevHash).toEqual('');
      expect(issue.id).toEqual(gc.id.toString());
      expect(issue.projectId).toEqual(`GoogleCode:${projectId}`, 'project id should match');
      expect(issue.status).toEqual(gc.status);
      expect(issue.summary).toEqual(gc.summary);
      expect(issue.labels).toEqual(gc.labels);
      matchComments(issue.comments, gc.comments);
      expect(issue.assignees).toEqual([]);
      expect(issue.timeCreated).toEqual(gc.comments[0].timestamp);
      expect(issue.timeUpdated).toBeNull();
      expect(issue.timeClosed).toBeNull();
    });
  }

  function matchComments(comments: TrackForeverComment[], gcComments: GoogleCodeComment[]): void {
    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      const gc = gcComments[i];
      expect(comment.content).toEqual(gc.content, 'comment content should match');
    }
  }
});
