import { TestBed, async } from '@angular/core/testing';

import { DefaultIssueService } from './default-issue.service';
import { OnlineIssueService } from './online-issue.service';
import { OfflineIssueService } from './offline-issue.service';
import { HttpErrorResponse } from '@angular/common/http';
import { mockTrackforeverProject } from '../import/models/trackforever/mock/mock-trackforever-project';
import { SyncService } from '../sync/sync.service';
import { of, throwError } from 'rxjs';
import { last, catchError } from 'rxjs/operators';

describe('DefaultIssueService', () => {
  let service: DefaultIssueService;
  let offlineSpy: jasmine.SpyObj<OfflineIssueService>;
  let onlineSpy: jasmine.SpyObj<OnlineIssueService>;
  let syncServiceSpy: jasmine.SpyObj<SyncService>;

  const mockOnline: Partial<Navigator> = {onLine: true};
  const mockOffline: Partial<Navigator> = {onLine: false};

  /**
   * Replaces beforeEach to configure the Navigator to online or offline
   *
   * @param {boolean} online the value of Navigator.onLine
   */
  function setupTest(online: boolean) {
    const offSpy = jasmine.createSpyObj('OfflineIssueService',
      ['getProject', 'getProjects', 'getIssue', 'setIssue', 'setProject']);
    const onSpy = jasmine.createSpyObj('OnlineIssueService', ['getProject', 'getProjects', 'getIssue']);
    const syncSpy = jasmine.createSpyObj('SyncService', ['sync']);

    TestBed.configureTestingModule({
      providers: [
        DefaultIssueService,
        {
          provide: OnlineIssueService,
          useValue: onSpy
        },
        {
          provide: OfflineIssueService,
          useValue: offSpy
        },
        {
          provide: 'Navigator',
          useValue: online ? mockOnline : mockOffline
        },
        {
          provide: SyncService,
          useValue: syncSpy
        }
      ]
    });

    service = TestBed.get(DefaultIssueService);
    offlineSpy = TestBed.get(OfflineIssueService);
    onlineSpy = TestBed.get(OnlineIssueService);
    syncServiceSpy = TestBed.get(SyncService);
  }

  it('should be created', async(() => {
    setupTest(true);

    expect(service).toBeTruthy();
  }));

  it('should get an issue online', async(() => {
    setupTest(true);

    const projectKey = 'my-project';
    const issueId = '123';
    const testIssue = mockTrackforeverProject.issues[0];

    offlineSpy.getIssue.and.returnValue(of(null));
    onlineSpy.getIssue.and.returnValue(of(testIssue));

    service.getIssue(projectKey, issueId).pipe(last())
      .subscribe(issue => {
        expect(issue).toEqual(testIssue);
        expect(onlineSpy.getIssue.calls.count()).toBe(1);
        expect(offlineSpy.getIssue.calls.count()).toBe(1);
      });
  }));

  it('should default to offline if the server is down', async(() => {
    setupTest(true);

    const projectKey = 'my-project';
    const issueId = '123';
    const testIssue = mockTrackforeverProject.issues[0];

    onlineSpy.getIssue.and.returnValue(throwError(new HttpErrorResponse({status: 0})));
    offlineSpy.getIssue.and.returnValue(of(testIssue));

    service.getIssue(projectKey, issueId)
      .subscribe(issue => {
        expect(issue).toEqual(testIssue);
        expect(onlineSpy.getIssue.calls.count()).toBe(1);
        expect(offlineSpy.getIssue.calls.count()).toBe(1);
      }, () => {
        expect(service.isOnline()).toBeFalsy();
      });
  }));

  it('should not stick offline if the server is only temporarily in error', async(() => {
    setupTest(true);

    const projectKey = 'my-project';
    const issueId = '123';
    const testIssue = mockTrackforeverProject.issues[0];

    onlineSpy.getIssue.and.returnValue(throwError(new HttpErrorResponse({status: 500})));
    offlineSpy.getIssue.and.returnValue(of(testIssue));

    service.getIssue(projectKey, issueId)
      .subscribe(issue => {
        expect(issue).toEqual(testIssue);
        expect(onlineSpy.getIssue.calls.count()).toBe(1);
        expect(offlineSpy.getIssue.calls.count()).toBe(1);
      }, () => {
        expect(service.isOnline()).toBeTruthy();
      });
  }));

  it('should let other online errors bubble up', async(() => {
    setupTest(true);

    const projectKey = 'my-project';
    const issueId = '123';
    const testError = 'error!';
    const testIssue = mockTrackforeverProject.issues[0];

    onlineSpy.getIssue.and.returnValue(throwError(testError));
    offlineSpy.getIssue.and.returnValue(of(testIssue));

    service.getIssue(projectKey, issueId).pipe(
      catchError(error => {
        expect(error).toEqual(testError);
        return of(error);
      })
    ).subscribe();
  }));

  it('should get an issue offline', async(() => {
    setupTest(false);

    const projectKey = 'my-project';
    const issueId = '123';
    const testIssue = mockTrackforeverProject.issues[0];

    offlineSpy.getIssue.and.returnValue(of(testIssue));

    service.getIssue(projectKey, issueId)
      .subscribe(issue => {
        expect(issue).toEqual(testIssue);
        expect(onlineSpy.getIssue.calls.count()).toBe(0);
        expect(offlineSpy.getIssue.calls.count()).toBe(1);
      });
  }));

  it('should get a project online', async(() => {
    setupTest(true);

    const projectKey = 'my-project';
    const testProject = mockTrackforeverProject;

    onlineSpy.getProject.and.returnValue(of(testProject));
    offlineSpy.getProject.and.returnValue(of(null));

    service.getProject(projectKey).pipe(last())
      .subscribe(project => {
        expect(project).toEqual(testProject);
        expect(onlineSpy.getProject.calls.count()).toBe(1);
        expect(offlineSpy.getProject.calls.count()).toBe(1);
      });
  }));

  it('should get a project offline', async(() => {
    setupTest(false);

    const projectKey = 'my-project';
    const testProject = mockTrackforeverProject;

    offlineSpy.getProject.and.returnValue(of(testProject));

    service.getProject(projectKey)
      .subscribe(project => {
        expect(project).toEqual(testProject);
        expect(onlineSpy.getProject.calls.count()).toBe(0);
        expect(offlineSpy.getProject.calls.count()).toBe(1);
      });
  }));

  it('should get projects online', async(() => {
    setupTest(true);

    const testProjects = [mockTrackforeverProject];

    onlineSpy.getProjects.and.returnValue(of(testProjects));
    offlineSpy.getProjects.and.returnValue(of([]));

    service.getProjects().pipe(last())
      .subscribe(projects => {
        expect(projects).toEqual(testProjects);
        expect(onlineSpy.getProjects.calls.count()).toBe(1);
        expect(offlineSpy.getProjects.calls.count()).toBe(1);
      });
  }));

  it('should get projects offline', async(() => {
    setupTest(false);

    const testProjects = [mockTrackforeverProject];

    offlineSpy.getProjects.and.returnValue(of(testProjects));

    service.getProjects()
      .subscribe(projects => {
        expect(projects).toEqual(testProjects);
        expect(onlineSpy.getProjects.calls.count()).toBe(0);
        expect(offlineSpy.getProjects.calls.count()).toBe(1);
      });
  }));

  it('should set issues offline', async(() => {
    setupTest(false);

    const issue = mockTrackforeverProject.issues.get('123');
    const res = 'hello';

    offlineSpy.setIssue.and.returnValue(of(res));

    service.setIssue(issue)
      .subscribe(r => expect(r).toEqual(res));
  }));

  it('should set issues online', async(() => {
    setupTest(true);

    const issue = mockTrackforeverProject.issues.get('123');
    const res = 'hello';
    const res2 = 'hello?';

    offlineSpy.setIssue.and.returnValue(of(res));
    syncServiceSpy.sync.and.returnValue(of(res2));

    let expected = res;
    service.setIssue(issue)
      .subscribe(r => {
        // expect to see the result of the offline service first, then the sync service
        expect(r).toEqual(expected);
        expected = res2;
      });

    expect(syncServiceSpy.sync.calls.count()).toBe(1);
  }));

  it('should set projects offline', async(() => {
    setupTest(false);

    const res = 'hello';

    offlineSpy.setProject.and.returnValue(of(res));

    service.setProject(mockTrackforeverProject)
      .subscribe(r => expect(r).toEqual(res));
  }));

  it('should set projects online', async(() => {
    setupTest(true);

    const res = 'hello';
    const res2 = 'hello?';

    offlineSpy.setProject.and.returnValue(of(res));
    syncServiceSpy.sync.and.returnValue(of(res2));

    let expected = res;
    service.setProject(mockTrackforeverProject)
      .subscribe(r => {
        // expect to see the result of the offline service first, then the sync service
        expect(r).toEqual(expected);
        expected = res2;
      });
  }));
});
