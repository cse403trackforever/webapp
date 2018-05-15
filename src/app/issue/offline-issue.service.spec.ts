import { async, TestBed } from '@angular/core/testing';

import { OfflineIssueService } from './offline-issue.service';
import { DataService } from '../database/data.service';
import { mockTrackforeverProject } from '../import/models/trackforever/mock/mock-trackforever-project';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';

describe('OfflineIssueService', () => {
  let service: OfflineIssueService;
  let dataServiceSpy: jasmine.SpyObj<DataService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('DataService', ['getProject', 'getKeys', 'addProject']);

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
    const i: TrackForeverIssue = p.issues.get(issueId);

    dataServiceSpy.getProject.and.returnValue(new Promise((resolve) => resolve(p)));

    service.getIssue(projectKey, issueId)
      .subscribe(issue => expect(issue).toEqual(i));
  }));

  it('should get a project', async(() => {
    const projectKey = 'my-project';
    const p: TrackForeverProject = mockTrackforeverProject;

    dataServiceSpy.getProject.and.returnValue(new Promise((resolve) => resolve(p)));

    service.getProject(projectKey)
      .subscribe(project => expect(project).toEqual(p));
  }));

  it('should get project summaries', async(() => {
    const projectKey = 'my-project';
    const p = mockTrackforeverProject;

    dataServiceSpy.getProject.and.returnValue(new Promise((resolve) => resolve(p)));
    dataServiceSpy.getKeys.and.returnValue(new Promise((resolve) => resolve([projectKey])));

    service.getProjects()
      .subscribe(projects => expect(projects).toEqual([p]));
  }));

  it('should set an issue', async(() => {
    dataServiceSpy.getProject.and.returnValue(new Promise((resolve) => resolve(mockTrackforeverProject)));
    dataServiceSpy.addProject.and.returnValue(new Promise(resolve => resolve(mockTrackforeverProject.id)));
    service.setIssue(mockTrackforeverProject.id, Array.from(mockTrackforeverProject.issues).map(e => e[1])).subscribe(r => {
      expect(r).toEqual(mockTrackforeverProject.id);
    });
  }));

  it('should set a project', async(() => {
    dataServiceSpy.getProject.and.returnValue(new Promise((resolve) => resolve(mockTrackforeverProject)));
    dataServiceSpy.addProject.and.returnValue(new Promise(resolve => resolve(mockTrackforeverProject.id)));
    service.setProject(mockTrackforeverProject).subscribe(r => {
      expect(r).toEqual(mockTrackforeverProject.id);
    });
  }));
});
