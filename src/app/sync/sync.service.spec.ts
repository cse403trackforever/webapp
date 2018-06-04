import { HashResponse } from './hash-response';
import { catchError } from 'rxjs/operators';
import { SyncService } from './sync.service';
import { TestBed } from '@angular/core/testing';
import { OnlineIssueService } from '../issue/online-issue.service';
import { OfflineIssueService } from '../issue/offline-issue.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { mockTrackforeverProject } from '../import/models/trackforever/mock/mock-trackforever-project';


describe('SyncService', () => {
  let service: SyncService;
  let offlineSpy: jasmine.SpyObj<OfflineIssueService>;
  let onlineSpy: jasmine.SpyObj<OnlineIssueService>;
  const mockProject = mockTrackforeverProject;

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
    expect(SyncService.getHash(mockProject, false)).toEqual(mockProject.hash);
    const issue = mockTrackforeverProject.issues.entries().next().value[1];
    expect(SyncService.getHash(issue, false)).toEqual(issue.hash);
  });

  it('finds changes', () => {
    const prev = mockProject.name;
    mockProject.name = 'test';
    expect(SyncService.hasChanged(mockProject)).toEqual(true);
    mockProject.name = prev;
    expect(SyncService.hasChanged(mockProject)).toEqual(false);
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
    const issueHashMap = new Map<string, Map<string, string>>([[mockProject.id, new Map()]]);
    Array.from(mockProject.issues).forEach(e => {
      map.set(e[1].id, e[1].hash);
    });
    const projectMap = new Map<string, HashResponse>();
    projectMap.set(mockProject.id, {project: mockProject.hash, issues: map});

    offlineSpy.getProjects.and.returnValue(of([mockProject]));
    offlineSpy.setProject.and.returnValue(of(null));
    offlineSpy.setIssues.and.returnValue(of(null));

    onlineSpy.getHashes.and.returnValue(of(projectMap));
    onlineSpy.getRequestedProjects.and.returnValue(of([]));
    onlineSpy.getRequestedIssues.and.returnValue(of([]));
    onlineSpy.setProjects.and.returnValue(of(new Map([[mockProject.id, mockProject.hash]])));
    onlineSpy.setIssues.and.returnValue(of(issueHashMap));
    onlineSpy.getIssue.and.callFake((k, i) => of(mockProject.issues.get(i)));
    onlineSpy.getProject.and.returnValue(of(mockProject));
    onlineSpy.getProjects.and.returnValue(of([mockProject]));

    service.sync().pipe(
      catchError(e => {
        console.log(e);
        return of(e);
      })
    ).subscribe(() => done());
  });
});
