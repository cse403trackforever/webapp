import { TestBed, async } from '@angular/core/testing';

import { ImportGithubService } from './import-github.service';
import { FetchGithubService } from './api/fetch-github.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { GitHubProject } from './models/github/github-project';
import * as mockGithubProject from './models/github/mock/mockGithubProject.json';
import * as mockGithubIssues from './models/github/mock/mockGithubIssues.json';
import * as mockGithubComments from './models/github/mock/mockGithubComments.json';
import { GitHubIssue } from './models/github/github-issue';
import { GitHubComment } from './models/github/github-comment';
import { TrackForeverProject } from './models/trackforever/trackforever-project';
import { TrackForeverIssue } from './models/trackforever/trackforever-issue';
import { TrackForeverComment } from './models/trackforever/trackforever-comment';

describe('ImportGithubService', () => {
  let service: ImportGithubService;
  let fetchServiceSpy: jasmine.SpyObj<FetchGithubService>;

  beforeEach(() => {
    const fetchSpy = jasmine.createSpyObj('FetchGithubService', ['fetchProject', 'fetchIssues', 'fetchComments']);

    TestBed.configureTestingModule({
      providers: [
        ImportGithubService,
        {
          provide: FetchGithubService,
          useValue: fetchSpy
        },
      ],
    });

    service = TestBed.get(ImportGithubService);
    fetchServiceSpy = TestBed.get(FetchGithubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should import', async(() => {
    const testProject = <GitHubProject> <any> mockGithubProject;
    const testIssues = <Array<GitHubIssue>> <any> mockGithubIssues;
    const testComments = <Array<GitHubComment>> <any> mockGithubComments;

    const ownerName = testProject.owner.login;
    const projectName = testProject.name;

    fetchServiceSpy.fetchProject.and.returnValue(Observable.of(testProject));
    fetchServiceSpy.fetchIssues.and.returnValue(Observable.of(testIssues));
    fetchServiceSpy.fetchComments.and.returnValue(Observable.of(testComments));

    service.importProject({ownerName, projectName})
      .subscribe((p: TrackForeverProject) => {
        console.log(JSON.stringify(p));
        expect(p.hash).toEqual('e87e5de20b6ec391c76028f946cbc97ae0fa1d7f8f64ac433223711386d2c3a3c787d46c64' +
        '314d51fffa408380309caf5bf0abe6180c8a7cd9c576de0c861c0b');
        expect(p.prevHash).toEqual('');
        expect(p.id).toEqual(testProject.id.toString());
        expect(p.ownerName).toEqual(testProject.owner.login);
        expect(p.name).toEqual(projectName);
        expect(p.description).toEqual(testProject.description || '');
        expect(p.source).toEqual('GitHub');
        matchIssues(p.issues, testIssues, p.id, testComments);
      });
  }));

  const hashes = [
    '80b4bb0cf8122833547db68fbf7c490914e4304272a10511e3d2406001501887a2a3f876224245ac9100ac3f0f4db08f18a8d35d9d80b9aa8827687ceef65de8',
    '52f1d2ea9a6234d5ef568c2ec13fe525e9f176013895364e29c49e1c6ecf56c1b78db778a5b2981167e2468454489c0722afa8e9baf7f4ba76ab906bf38b574c',
    '3fe0babcf46085f3518cc99bca03932a9762ec0cc2da3ee7acebe7653e63bd90055c7524a6b5a0726595f413fe45a0a9fb6d033a842617c11688cf11832f737f'
  ];

  function matchIssues(converted: TrackForeverIssue[], source: GitHubIssue[], projectId: string,
                       comments: GitHubComment[]) {
    converted.forEach((issue, i) => {
      const gh = source.find(it => it.number.toString() === issue.id);
      expect(gh).toBeTruthy('should match an issue');
      expect(issue.hash).toEqual(hashes[i]);
      expect(issue.prevHash).toEqual('');
      expect(issue.id).toEqual(gh.number.toString());
      expect(issue.projectId).toEqual(projectId);
      expect(issue.status).toEqual(gh.state);
      expect(issue.summary).toEqual(gh.title);
      expect(issue.labels).toEqual(gh.labels.map(label => label.name));
      if (gh.body) {
        expect(issue.comments[0].commenterName).toEqual(gh.user.login, 'wrong login for body comment');
        expect(issue.comments[0].content).toEqual(gh.body);
        matchComments(issue.comments.splice(1), comments);
      } else {
        matchComments(issue.comments, comments);
      }
      expect(issue.submitterName).toEqual(gh.user.login);
      expect(issue.assignees).toEqual(gh.assignees.map(owner => owner.login));
      expect(issue.timeCreated).toEqual(gh.created_at ? Date.parse(gh.created_at) : -1);
      expect(issue.timeUpdated).toEqual(gh.updated_at ? Date.parse(gh.updated_at) : -1);
      expect(issue.timeClosed).toEqual(gh.closed_at ? Date.parse(gh.closed_at) : -1);
    });
  }

  function matchComments(converted: TrackForeverComment[], source: GitHubComment[]) {
    converted.forEach(comment => {
      const found = source.find(ghComment =>
        comment.commenterName === ghComment.user.login && comment.content === ghComment.body
      );
      expect(found).toBeTruthy('should match a comment');
    });
  }
});
