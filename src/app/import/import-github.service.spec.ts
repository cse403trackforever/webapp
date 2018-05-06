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
        expect(p.hash).toEqual(JSON.stringify(testProject));
        expect(p.id).toEqual(testProject.id.toString());
        expect(p.ownerName).toEqual(testProject.owner.login);
        expect(p.name).toEqual(projectName);
        expect(p.description).toEqual(testProject.description || '');
        expect(p.source).toEqual('GitHub');
        matchIssues(p.issues, testIssues, p.id, testComments);
      });
  }));

  function matchIssues(converted: TrackForeverIssue[], source: GitHubIssue[], projectId: String,
                       comments: GitHubComment[]) {
    converted.forEach(issue => {
      const gh = source.find(it => it.number.toString() === issue.id);
      expect(gh).toBeTruthy('should match an issue');
      expect(issue.hash).toEqual('');
      expect(issue.id).toEqual(gh.number.toString());
      expect(issue.projectId).toEqual(projectId);
      expect(issue.status).toEqual(gh.state);
      expect(issue.summary).toEqual(gh.body);
      expect(issue.labels).toEqual(gh.labels.map(label => label.name));
      matchComments(issue.comments, comments);
      expect(issue.submitterName).toEqual(gh.user.login);
      expect(issue.assignees).toEqual(gh.assignees.map(owner => owner.login));
      expect(issue.timeCreated).toEqual(gh.created_at ? Date.parse(gh.created_at.toString()) : -1);
      expect(issue.timeUpdated).toEqual(gh.updated_at ? Date.parse(gh.updated_at.toString()) : -1);
      expect(issue.timeClosed).toEqual(gh.closed_at ? Date.parse(gh.closed_at.toString()) : -1);
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
