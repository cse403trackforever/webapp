import { SyncService } from './sync.service';
import { TestBed, async } from '@angular/core/testing';
import { OnlineIssueService } from '../issue/online-issue.service';
import { OfflineIssueService } from '../issue/offline-issue.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { mockRedmineTrackForeverProject } from '../import/import-redmine/models/mock/mock-redmine-trackforever-project';
import { Observable } from 'rxjs/Observable';


describe('SyncService', () => {
  let service: SyncService;
  let offlineSpy: jasmine.SpyObj<OfflineIssueService>;
  let onlineSpy: jasmine.SpyObj<OnlineIssueService>;

  beforeEach(() => {
    const offSpy = jasmine.createSpyObj('OfflineIssueService', ['getProjects', 'setIssue', 'setProject']);
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

  it('doesn\'t crash', async(() => {
    const map = new Map();
    Array.from(mockRedmineTrackForeverProject.issues).forEach(e => {
      map.set(e[0], e[1].hash);
    });

    offlineSpy.getProjects.and.returnValue(Observable.of([mockRedmineTrackForeverProject]));
    onlineSpy.getHashes.and.returnValue(Observable.of(map));
    onlineSpy.getRequestedProjects.and.returnValue(Observable.of([]));
    onlineSpy.getRequestedIssues.and.returnValue(Observable.of([]));

    // TODO mock every other method of offline and online services which are called in sync

    service.sync().subscribe(r => expect(r).toBeTruthy());
  }));
});
