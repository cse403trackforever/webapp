import { catchError } from 'rxjs/operators';
import { SyncService } from './sync.service';
import { TestBed, async } from '@angular/core/testing';
import { OnlineIssueService } from '../issue/online-issue.service';
import { OfflineIssueService } from '../issue/offline-issue.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { mockRedmineTrackForeverProject } from '../import/import-redmine/models/mock/mock-redmine-trackforever-project';
import { of, throwError } from 'rxjs';


describe('SyncService', () => {
  let service: SyncService;
  let offlineSpy: jasmine.SpyObj<OfflineIssueService>;
  let onlineSpy: jasmine.SpyObj<OnlineIssueService>;

  beforeEach(() => {
    const offSpy = jasmine.createSpyObj('OfflineIssueService', ['getProjects', 'setIssues', 'setProject']);
    const onSpy = jasmine.createSpyObj('OnlineIssueService', [
      'getProject',
      'setProjects',
      'getIssue',
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

  it('doesn\'t crash', async(() => {
    const map = new Map();
    Array.from(mockRedmineTrackForeverProject.issues).forEach(e => {
      map.set(e[0], e[1].hash);
    });

    offlineSpy.getProjects.and.returnValue(of([mockRedmineTrackForeverProject]));
    onlineSpy.getHashes.and.returnValue(of(map));
    onlineSpy.getRequestedProjects.and.returnValue(of([]));
    onlineSpy.getRequestedIssues.and.returnValue(of([]));
    onlineSpy.setProjects.and.callFake(() => of(null));
    onlineSpy.setIssues.and.callFake(() => of(null));
    onlineSpy.getIssue.and.returnValue(of(mockRedmineTrackForeverProject.issues.get('5')));
    offlineSpy.setIssues.and.returnValue(of(null));

    service.sync().subscribe(r => expect(r).toBeTruthy());
  }));
});
