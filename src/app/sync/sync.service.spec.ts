import { HashResponse } from './hash-response';
import { mockRedmineTrackForeverProject } from './../import/import-redmine/models/mock/mock-redmine-trackforever-project';
import { catchError } from 'rxjs/operators';
import { SyncService } from './sync.service';
import { TestBed } from '@angular/core/testing';
import { OnlineIssueService } from '../issue/online-issue.service';
import { OfflineIssueService } from '../issue/offline-issue.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';


describe('SyncService', () => {
  let service: SyncService;
  let offlineSpy: jasmine.SpyObj<OfflineIssueService>;
  let onlineSpy: jasmine.SpyObj<OnlineIssueService>;

  beforeEach(() => {
    const offSpy = jasmine.createSpyObj('OfflineIssueService', ['getProjects', 'setIssues', 'setProject']);
    const onSpy = jasmine.createSpyObj('OnlineIssueService', [
      'getProject',
      'getProjects',
      'setProjects',
      'getIssue',
      'setIssue',
      'setIssues',
      'getRequestedProjects',
      'getRequestedIssues',
      'getHashes'
    ]);

    TestBed.configureTestingModule({
      providers: [
        SyncService,
        {
          provide: OnlineIssueService,
          useValue: onSpy
        },
        {
          provide: OfflineIssueService,
          useValue: offSpy
        }
      ],
      imports: [HttpClientTestingModule]
    });

    service = TestBed.get(SyncService);
    offlineSpy = TestBed.get(OfflineIssueService);
    onlineSpy = TestBed.get(OnlineIssueService);
  });

  it('create an instance', () => {
    expect(service).toBeTruthy();
  });

  it('generate a correct hash', () => {
    const project = mockRedmineTrackForeverProject;
    expect(SyncService.getHash(project, false)).toEqual(project.hash);
    const issue = mockRedmineTrackForeverProject.issues.entries().next().value[1];
    expect(SyncService.getHash(issue, false)).toEqual(issue.hash);
  });

  it('finds changes', () => {
    const project = mockRedmineTrackForeverProject;
    const prev = project.name;
    project.name = 'test';
    expect(SyncService.hasChanged(project)).toEqual(true);
    project.name = prev;
    expect(SyncService.hasChanged(project)).toEqual(false);
  });

  it('bubbles up errors', (done) => {
    const message = 'error test!';
    offlineSpy.getProjects.and.returnValue(throwError(new Error(message)));

    service.sync().pipe(
      catchError(error => {
        expect(error.message).toEqual(message);
        return of(error);
      })
    ).subscribe(() => done());
  });

  it('doesn\'t crash', (done) => {
    const map = new Map<string, string>();
    Array.from(mockRedmineTrackForeverProject.issues).forEach(e => {
      map.set(e[1].id, e[1].hash);
    });
    const projectMap = new Map<string, HashResponse>();
    projectMap.set(mockRedmineTrackForeverProject.id, {project: mockRedmineTrackForeverProject.hash, issues: map});

    offlineSpy.getProjects.and.returnValue(of([mockRedmineTrackForeverProject]));
    offlineSpy.setProject.and.returnValue(of(null));
    offlineSpy.setIssues.and.returnValue(of(null));

    onlineSpy.getHashes.and.returnValue(of(projectMap));
    onlineSpy.getRequestedProjects.and.returnValue(of([]));
    onlineSpy.getRequestedIssues.and.returnValue(of([]));
    onlineSpy.setProjects.and.returnValue(of(null));
    onlineSpy.setIssues.and.returnValue(of(null));
    onlineSpy.setIssues.and.returnValue(of(null));
    onlineSpy.getIssue.and.callFake((k, i) => of(mockRedmineTrackForeverProject.issues.get(i)));
    onlineSpy.getProject.and.returnValue(of(mockRedmineTrackForeverProject));
    onlineSpy.getProjects.and.returnValue(of([mockRedmineTrackForeverProject]));

    service.sync().pipe(
      catchError(e => {
        console.log(e);
        return of(e);
      })
    ).subscribe(() => done());
  });
});
