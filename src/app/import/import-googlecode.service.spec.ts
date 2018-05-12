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
      'a8e2103895ae8ce0b926024dd8914e5ac27a6c3eb03f451fc7638538d9a44e03fdb337da66f867d36e84d7b6c4c9e318c082ae7688e4aad186ec0b3f04ac98e9',
      '9303e529a68b4b76d2a984e5198b59eda5c6ae986d89dba00e6695422f5ee885a7565a7f273753b19f16da01758cb4c20d54f184e57ee1299874abddf16f7329',
      '96519355e060878e750eb2a102c77e300e7d5b53c937d8b39ac0b7545de4ca682ac1019d3a8d73f341337633b5e9f60828333ee0cea25e6c4239788b56b35b46',
      '4ba11e75e4bbc0e5fbd26e3e35fa21a3f8783129403aadce8dabfe30c7aa5e57bc94a3b32691622cca6af51eaad816a90caa60741aa6b4bb9b2ee3942f5a2b83',
      '11eb97a929f8c7a76a2c91cdd41bdb987e96676e2254f8ce70eed4d59ae69ba135e92d0b4ca821aed047cd6fe391e57b59ef1764a7844a890f4cd2fbf98b06a5',
      'ab9d8d9f67320a45ceef26869d0eb6a624c895d17ad544a449d43e332237e8626f7a0eafd8ff90f5142c864e97224a4aa6a04dfa443c757fd8b3b16aa005c627',
      'b7ca3824a9a987f616e36bdfb47646dec1c811f2c5d8b614a7e9282fed04c7cfbfdd63074c89faaf24f4f0a67f45cc71361f69648571eecdea5b97cf8b240057',
      'c8588ab48e4fc952bff46e589fb91bd644f6bc7bb28a3e95fea19246e5bb644e9713dc596b577bb6ace192aba545d0b382ce41e412c035c8cf9052497671a21e',
      '9326f387e46720738b9aef3efd6ed87b70f70d270fb03cde917fdaa91af250355e42a2de06db08ff877a309293930e70250ac64d831236956b607bc89f69404a',
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

        expect(project.hash).toEqual('06575b41cf51eff51ed380a637d0601c4cfd4c44af40a0ff442474e88918c61103d1a80b0455c3d6d887052994' +
          '19f0303812940857783aac8db2cc89e66652e4');
        expect(project.prevHash).toEqual('');
        expect(project.id).toEqual(mockProject.name);
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
