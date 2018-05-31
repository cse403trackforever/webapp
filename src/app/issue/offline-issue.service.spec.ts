import { async, TestBed } from '@angular/core/testing';

import { OfflineIssueService } from './offline-issue.service';
import { DataService } from '../database/data.service';
import { mockTrackforeverProject } from '../import/models/trackforever/mock/mock-trackforever-project';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';
import { AuthenticationService } from '../authentication/authentication.service';
import { mockUser } from '../shared/models/mock/mock-user';
import { Observable, of } from 'rxjs';
import { reduce } from 'rxjs/operators';

describe('OfflineIssueService', () => {
  let service: OfflineIssueService;
  let dataServiceSpy: jasmine.SpyObj<DataService>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('DataService', ['getProject', 'getKeys', 'addProject', 'getProjects']);
    const authSpy = jasmine.createSpyObj('AuthenticationService', ['getUser']);

    TestBed.configureTestingModule({
      providers: [
        OfflineIssueService,
        {
          provide: DataService,
          useValue: spy
        },
        {
          provide: AuthenticationService,
          useValue: authSpy
        }
      ]
    });

    service = TestBed.get(OfflineIssueService);
    dataServiceSpy = TestBed.get(DataService);
    authServiceSpy = TestBed.get(AuthenticationService);

    authServiceSpy.getUser.and.returnValue(of(mockUser));
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
    const p = mockTrackforeverProject;

    dataServiceSpy.getProjects.and.returnValue(of([p]));

    service.getProjects()
      .subscribe(projects => expect(projects).toEqual([p]));
  }));

  it('should get empty projects', async(() => {
    dataServiceSpy.getProjects.and.returnValue(of([]));

    service.getProjects()
      .subscribe(projects => expect(projects).toEqual([]));
  }));

  it('should get multiple projects over time', async(() => {
    const p = mockTrackforeverProject;

    dataServiceSpy.getProjects.and.returnValue(new Observable(observer => {
      observer.next([]);
      observer.next([p]);
      observer.next([p, p]);
      observer.complete();
    }));

    service.getProjects().pipe(
      reduce((acc, val) => acc.concat(val))
    ).subscribe((projectsOverTime: TrackForeverProject[]) => {
      expect(projectsOverTime).toEqual([p, p, p]);
    });
  }));

  it('should set issues', async(() => {
    dataServiceSpy.getProject.and.returnValue(new Promise((resolve) => resolve(mockTrackforeverProject)));
    dataServiceSpy.addProject.and.returnValue(new Promise(resolve => resolve(mockTrackforeverProject.id)));
    service.setIssues(mockTrackforeverProject.id, Array.from(mockTrackforeverProject.issues).map(e => e[1])).subscribe(r => {
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
