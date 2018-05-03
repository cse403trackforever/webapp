import { async, TestBed } from '@angular/core/testing';

import { OfflineIssueService } from './offline-issue.service';
import { DataService } from '../database/data.service';
import { mockTrackforeverProject } from '../import/models/trackforever/mock/mock-trackforever-project';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { Issue } from '../shared/models/issue';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';
import { Project } from '../shared/models/project';
import { IssueSummary } from '../shared/models/issue-summary';
import { ProjectSummary } from '../shared/models/project-summary';

describe('OfflineIssueService', () => {
  let service: OfflineIssueService;
  let dataServiceSpy: jasmine.SpyObj<DataService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('DataService', ['getProject', 'getKeys']);

    TestBed.configureTestingModule({
      providers: [
        OfflineIssueService,
        {
          provide: DataService,
          useValue: spy
        }
      ]
    });

    service = TestBed.get(OfflineIssueService);
    dataServiceSpy = TestBed.get(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get an issue', async(() => {
    const projectKey = 'my-project';
    const issueId = '123';
    const p: TrackForeverProject = mockTrackforeverProject;
    const i: TrackForeverIssue = p.issues.find(issue => issue.id === issueId);

    dataServiceSpy.getProject.and.returnValue(new Promise((resolve) => resolve(p)));

    service.getIssue(projectKey, issueId)
      .subscribe((issue: Issue) => {
        expect(issue.id).toEqual(i.id);
        expect(issue.projectId).toEqual(i.projectId);
        expect(issue.status).toEqual(i.status);
        expect(issue.labels).toEqual(i.labels);
        expect(issue.comments).toEqual(i.comments);
        expect(issue.submitterName).toEqual(i.submitterName);
        expect(issue.assignees).toEqual(i.assignees);
        expect(issue.timeCreated).toEqual(i.timeCreated);
        expect(issue.timeUpdated).toEqual(i.timeUpdated);
        expect(issue.timeClosed).toEqual(i.timeClosed);
      });
  }));

  it('should get a project', async(() => {
    const projectKey = 'my-project';
    const p: TrackForeverProject = mockTrackforeverProject;

    dataServiceSpy.getProject.and.returnValue(new Promise((resolve) => resolve(p)));

    service.getProject(projectKey)
      .subscribe((project: Project) => {
        expect(project.id).toEqual(p.id);
        expect(project.ownerName).toEqual(p.ownerName);
        expect(project.name).toEqual(p.name);
        expect(project.description).toEqual(p.description);
        expect(project.source).toEqual(p.source);
        project.issues.forEach((s: IssueSummary) => {
          const i = p.issues.find(issue => issue.id === s.id);
          expect(s.id).toEqual(i.id);
          expect(s.projectId).toEqual(i.projectId);
          expect(s.status).toEqual(i.status);
          expect(s.summary).toEqual(i.summary);
          expect(s.labels).toEqual(i.labels);
          expect(s.numComments).toEqual(i.comments.length);
          expect(s.submitterName).toEqual(i.submitterName);
          expect(s.assignees).toEqual(i.assignees);
          expect(s.timeCreated).toEqual(i.timeCreated);
          expect(s.timeUpdated).toEqual(i.timeUpdated);
          expect(s.timeClosed).toEqual(i.timeClosed);
        });
      });
  }));

  it('should get project summaries', async(() => {
    const projectKey = 'my-project';
    const p: TrackForeverProject = mockTrackforeverProject;

    dataServiceSpy.getProject.and.returnValue(new Promise((resolve) => resolve(p)));
    dataServiceSpy.getKeys.and.returnValue(new Promise((resolve) => resolve([projectKey])));

    service.getProjects()
      .subscribe((projects: ProjectSummary[]) => {
        projects.forEach((s: ProjectSummary) => {
          expect(s.id).toEqual(p.id);
          expect(s.ownerName).toEqual(p.ownerName);
          expect(s.name).toEqual(p.name);
          expect(s.description).toEqual(p.description);
          expect(s.source).toEqual(p.source);

          expect(dataServiceSpy.getKeys.calls.count())
            .toBe(1, 'getKeys was called once');
          expect(dataServiceSpy.getProject.calls.count())
            .toBe(1, 'getProject was called once');
          expect(dataServiceSpy.getProject.calls.mostRecent().args)
            .toEqual([projectKey], 'called getProject with key');
        });
      });
  }));
});
