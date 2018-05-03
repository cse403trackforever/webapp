import { TestBed, async } from '@angular/core/testing';

import { DefaultIssueService } from './default-issue.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { mockIssue } from '../shared/models/mock/mock-issue';
import { OnlineIssueService } from './online-issue.service';
import { OfflineIssueService } from './offline-issue.service';
import { HttpErrorResponse } from '@angular/common/http';
import { mockProject } from '../shared/models/mock/mock-project';
import { mockProjectSummary } from '../shared/models/mock/mock-project-summary';

describe('DefaultIssueService', () => {
  let service: DefaultIssueService;
  let offlineSpy: jasmine.SpyObj<OfflineIssueService>;
  let onlineSpy: jasmine.SpyObj<OnlineIssueService>;

  const mockOnline: Partial<Navigator> = {onLine: true};
  const mockOffline: Partial<Navigator> = {onLine: false};

  /**
   * Replaces beforeEach to configure the Navigator to online or offline
   *
   * @param {boolean} online the value of Navigator.onLine
   */
  function setupTest(online: boolean) {
    const offSpy = jasmine.createSpyObj('OfflineIssueService', ['getProject', 'getProjects', 'getIssue']);
    const onSpy = jasmine.createSpyObj('OnlineIssueService', ['getProject', 'getProjects', 'getIssue']);

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
        }
      ]
    });

    service = TestBed.get(DefaultIssueService);
    offlineSpy = TestBed.get(OfflineIssueService);
    onlineSpy = TestBed.get(OnlineIssueService);
  }

  it('should be created', async(() => {
    setupTest(true);

    expect(service).toBeTruthy();
  }));

  it('should get an issue online', async(() => {
    setupTest(true);

    const projectKey = 'my-project';
    const issueId = '123';
    const testIssue = mockIssue;

    onlineSpy.getIssue.and.returnValue(Observable.of(testIssue));

    service.getIssue(projectKey, issueId)
      .subscribe(issue => {
        expect(issue).toEqual(testIssue);
        expect(onlineSpy.getIssue.calls.count()).toBe(1);
        expect(offlineSpy.getIssue.calls.count()).toBe(0);
      });
  }));

  it('should fallback to offline if the server is down', async(() => {
    setupTest(true);

    const projectKey = 'my-project';
    const issueId = '123';
    const testIssue = mockIssue;

    onlineSpy.getIssue.and.returnValue(Observable.throw(new HttpErrorResponse({status: 0})));
    offlineSpy.getIssue.and.returnValue(Observable.of(testIssue));

    service.getIssue(projectKey, issueId)
      .subscribe(issue => {
        expect(issue).toEqual(testIssue);
        expect(onlineSpy.getIssue.calls.count()).toBe(1);
        expect(offlineSpy.getIssue.calls.count()).toBe(1);

        // expect to skip the online call this time, now that we know the server is down
        service.getIssue(projectKey, issueId)
          .subscribe(nextIssue => {
            expect(nextIssue).toEqual(testIssue);
            expect(onlineSpy.getIssue.calls.count()).toBe(1);
            expect(offlineSpy.getIssue.calls.count()).toBe(2);
          });
      });
  }));

  it('should not stick offline if the server is only temporarily in error', async(() => {
    setupTest(true);

    const projectKey = 'my-project';
    const issueId = '123';
    const testIssue = mockIssue;

    onlineSpy.getIssue.and.returnValue(Observable.throw(new HttpErrorResponse({status: 500})));
    offlineSpy.getIssue.and.returnValue(Observable.of(testIssue));

    service.getIssue(projectKey, issueId)
      .subscribe(issue => {
        expect(issue).toEqual(testIssue);
        expect(onlineSpy.getIssue.calls.count()).toBe(1);
        expect(offlineSpy.getIssue.calls.count()).toBe(1);

        // try again but with a successful online hit
        onlineSpy.getIssue.and.returnValue(Observable.of(testIssue));
        service.getIssue(projectKey, issueId)
          .subscribe(nextIssue => {
            expect(nextIssue).toEqual(testIssue);
            expect(onlineSpy.getIssue.calls.count()).toBe(2);
            expect(offlineSpy.getIssue.calls.count()).toBe(1);
          });
      });
  }));

  it('should let other online errors bubble up', async(() => {
    setupTest(true);

    const projectKey = 'my-project';
    const issueId = '123';
    const testError = 'error!';

    onlineSpy.getIssue.and.returnValue(Observable.throw(testError));

    service.getIssue(projectKey, issueId)
      .catch(error => {
        expect(error).toEqual(testError);
        return Observable.of(error);
      })
      .subscribe(error => expect(error).toEqual(testError));
  }));

  it('should get an issue offline', async(() => {
    setupTest(false);

    const projectKey = 'my-project';
    const issueId = '123';
    const testIssue = mockIssue;

    offlineSpy.getIssue.and.returnValue(Observable.of(testIssue));

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
    const testProject = mockProject;

    onlineSpy.getProject.and.returnValue(Observable.of(mockProject));

    service.getProject(projectKey)
      .subscribe(project => {
        expect(project).toEqual(testProject);
        expect(onlineSpy.getProject.calls.count()).toBe(1);
        expect(offlineSpy.getProject.calls.count()).toBe(0);
      });
  }));

  it('should get a project offline', async(() => {
    setupTest(false);

    const projectKey = 'my-project';
    const testProject = mockProject;

    offlineSpy.getProject.and.returnValue(Observable.of(mockProject));

    service.getProject(projectKey)
      .subscribe(project => {
        expect(project).toEqual(testProject);
        expect(onlineSpy.getProject.calls.count()).toBe(0);
        expect(offlineSpy.getProject.calls.count()).toBe(1);
      });
  }));

  it('should get projects online', async(() => {
    setupTest(true);

    const testProjects = [ mockProjectSummary ];

    onlineSpy.getProjects.and.returnValue(Observable.of(testProjects));

    service.getProjects()
      .subscribe(projects => {
        expect(projects).toEqual(testProjects);
        expect(onlineSpy.getProjects.calls.count()).toBe(1);
        expect(offlineSpy.getProjects.calls.count()).toBe(0);
      });
  }));

  it('should get projects offline', async(() => {
    setupTest(false);

    const testProjects = [ mockProjectSummary ];

    offlineSpy.getProjects.and.returnValue(Observable.of(testProjects));

    service.getProjects()
      .subscribe(projects => {
        expect(projects).toEqual(testProjects);
        expect(onlineSpy.getProjects.calls.count()).toBe(0);
        expect(offlineSpy.getProjects.calls.count()).toBe(1);
      });
  }));
});
