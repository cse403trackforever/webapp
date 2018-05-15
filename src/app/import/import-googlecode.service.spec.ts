import { TestBed, async } from '@angular/core/testing';

import { FetchGoogleCodeService } from './api/fetch-googlecode.service';
import { ImportGoogleCodeService } from './import-googlecode.service';
import * as mockGoogleCodeProject from './models/googlecode/mock/project.json';
import * as mockGoogleCodeIssuePage1 from './models/googlecode/mock/issues-page-1.json';
import * as mockGoogleCodeIssuePage2 from './models/googlecode/mock/issues-page-2.json';
import * as mockGoogleCodeIssuePage3 from './models/googlecode/mock/issues-page-3.json';
import * as mockGoogleCodeIssues1 from './models/googlecode/mock/issues-1.json';
import * as mockGoogleCodeIssues2 from './models/googlecode/mock/issues-2.json';
import * as mockGoogleCodeIssues3 from './models/googlecode/mock/issues-3.json';
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
    const mockIssuePages: GoogleCodeIssuePage[] = <any> [mockGoogleCodeIssuePage1, mockGoogleCodeIssuePage2, mockGoogleCodeIssuePage3];
    const mockIssues: GoogleCodeIssue[] = (<any> [mockGoogleCodeIssues1, mockGoogleCodeIssues2, mockGoogleCodeIssues3])
      .reduce((acc, v) => acc.concat(v));

    const issueHashes = [
      '536e80937c88fb48f9456309a475938b2bc511363c6c6e05c64c15f121d1c7a3856b85979b82f55581b4d9534ff88d7881546799a81ac5990887d87dcb7b196d',
      '275e912224ccbbc3decaca54f5ef50abd4ae612cd11b38f6ff08f04db05f342a4fa36dfec73b7a4970f70834fa6702358143defc6df2ceaef695294374fe4c32',
      'ab1d02fd1752f7ba5226e2ed25237fe99aaec5482174c3934f1f2de1841bf9be5fc13cf0c6e2b9c9abe37377f904f5aacc80445f00138fb463171a2f2dc3ab2b',
      '910d660d00232eb6ba681a2fef2625b1a1e1104ecbfb5ea0d0f83cfdc24239310f327c26102cf5d57a58267715edd55f912748ee7ba64d9ac053a1a8cc921c7b',
      '45695531cc4e54695278c9cf729488c1f63e5ee5130f0cda25e2717f1fd03fc8a823e9e7f4113064415d8ec7fc2910d8b640338d90d3cc6d182be660b3cb1bf2',
      '7233b61573ca5dea8ef5c1e58dabd68dbe2fa1bbcd7c6414778a0b00700eda2b16b324debaff8fb45f35ff689a991f60a6603972919ac41795972bf70a3f4d63',
      '318613974491f9734e6a15209df92bb54d2fe6bc2616f0bf939118060f7c7e5a600ed9ba21a9ceadffc8ca626d99d100c1a1636d0c4256cb705cc57bca59f06e',
      'dd8a683d2cccd6e82e5b38d8c0394ed69a746e1ee90e69c0dff1ad35d4a0b4b85bb0e0812e144f72448ebbd356139abd077aaa11622a4e804e2a8b0e2bde97c5',
      '20124fb3329265744bbfbfcb4807569463508e65c1eea4f4a5de864074c0bc13fc6b7a0c4980a57ebd05e3c1e6beafadebde6e7085d6c82eacf6e19427236762',
    ];

    fetchServiceSpy.fetchProject.and.returnValue(Observable.of(mockProject));

    let pageIndex = 0;
    fetchServiceSpy.fetchIssuePage.and.callFake(() => Observable.of(mockIssuePages[pageIndex++]));

    let issueIndex = 0;
    fetchServiceSpy.fetchIssue.and.callFake(() => Observable.of(mockIssues[issueIndex++]));

    service.importProject(projectName)
      .subscribe(project => {
        // check that the correct number of API calls were made
        expect(fetchServiceSpy.fetchIssuePage.calls.count()).toEqual(mockIssuePages.length);
        expect(fetchServiceSpy.fetchIssue.calls.count()).toEqual(mockIssues.length);

        // check that the number of issues matches
        expect(project.issues.size).toBe(mockIssues.length);

        expect(project.hash).toEqual('5c229c4dc6c518b45a9cdd67f71f572f3ba141d6ec3a7001d9aa3068cfc67d25000f411561ecb86ffaa' +
        '054307fa78cf8eae4ffe45cfa505f8ad97ae397397e56');
        expect(project.prevHash).toEqual('');
        expect(project.id).toEqual(`GoogleCode:${mockProject.name}`);
        expect(project.ownerName).toEqual('');
        expect(project.name).toEqual(mockProject.name);
        expect(project.description).toEqual(mockProject.description);
        expect(project.source).toEqual('Google Code');
        matchIssues(project.issues, mockIssues, mockProject.name, issueHashes);
      });
  }));

  function matchIssues(issues: Map<string, TrackForeverIssue>, gcIssues: GoogleCodeIssue[], projectId: string,
                       issueHashes: string[]): void {
    issues.forEach(issue => {
      const gc: GoogleCodeIssue = gcIssues.find(i => i.id.toString() === issue.id);
      const index = gcIssues.indexOf(gc);
      expect(gc).toBeTruthy();

      console.log(`index! ${index}`);
      expect(issue.hash).toEqual(issueHashes[index]);
      expect(issue.prevHash).toEqual('');
      expect(issue.id).toEqual(gc.id.toString());
      expect(issue.projectId).toEqual(`GoogleCode:${projectId}`, 'project id should match');
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
