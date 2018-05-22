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

    const issueHashes = [
      'c7578594f9cbc2d5f4f1e3b7c7e6c11ff8bdcc662eec7ed649de50d128f212a82828689afb2992ab66bafe70520db73ebefab3e50652c453750553d6646cfe1d',
      'd2c5c8728f018049343438df8bef3699677b5e8c243be0837c6985f98688c39779d5910970591f0b57588c3e5bc92692a4c5d379a68e3559a832e3cd96ee75db',
      '9482d53c0aeab77472220da0d8aa9527a85933c77049e9207f2902b60003356e302dffdb9b8bf47d3a526bf3fcf1444f76a26ee94ca98b30a56256fdd2669fcc',
      '1c48e5a3a7c632d9be73b157e8d045622ad6a7c3b9d4b93969db594c16849e982288ccd2f767e8afb5485822ff758decdb76e044ee7397c0ca67e75b15c51a5d',
      '882c85c4599355585aaf5274cd1a4f22f84e868693d0f6cfa3ade5825d64322ed9d91252368e830e4886262248d424ee958ee51129f391320f658f5f41638787',
      '77e9a44545d8b9def52cb5521c619521f89c5fa4660772a9634f861f33c7d6cede37a8b9782d3f7252f91ca7e11109e58f6e69c9fae2230175f1452b9594bdff',
      '65b39d28a13052b61252cb9ac1e7c37a99369caa884ca3e6e88513ea2f59b819e066afaaa93d6a6aa1984ad2c75aa5a4188a492056323e3bfd7cc6ad4af73bc0',
      'e336b7983b43650e163a4d26cc4b8e4ac7c58e534dccd46e8a9a8fa1c6df8690346d40a82ed18a14a4495a3744df4877f532e9352ea103a637d55f5b8bff4138',
      '9da0f3f743adba265749163caf5925887b3e8e17a6a3abd04d4de9a5ed53bb881cb89fc678caa47bcf1554921d2705684133e8560e84cf70863a6693d1eb2c02',
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
      expect(issue.timeCreated).toBeNull();
      expect(issue.timeUpdated).toBeNull();
      expect(issue.timeClosed).toBeNull();
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
