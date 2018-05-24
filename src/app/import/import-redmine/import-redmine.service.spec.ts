import { TestBed, inject } from '@angular/core/testing';

import { FetchRedmineService } from './fetch-redmine.service';
import { ImportRedmineService } from './import-redmine.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { RedmineProject } from './models/redmine-project';
import { mockRedmineProject } from './models/mock/mock-redmine-project';
import { RedmineIssueArray } from './models/redmine-issueArray';
import { mockRedmineIssueArray } from './models/mock/mock-redmine-issueArray';
import { RedmineIssue } from './models/redmine-issue';
import { mockRedmineTrackForeverProject } from './models/mock/mock-redmine-trackforever-project';

describe('ImportRedmineService', () => {
  let fetchServiceStub: Partial<FetchRedmineService>;

  beforeEach(() => {
    fetchServiceStub = {
      fetchProject(projectName: string): Observable<RedmineProject> {
        return Observable.of(mockRedmineProject);
      },
      fetchIssues(projectName: string, projectID: number, limit: number, offset: number): Observable<RedmineIssueArray> {
        return Observable.of(mockRedmineIssueArray);
      },
      fetchIssue(projectID: number, issueID: number): Observable<RedmineIssue> {
        return Observable.of(mockRedmineIssueArray.issues.find(issue => issue.id === issueID));
      },
      setBaseUrl(url: string) {}
    };

    TestBed.configureTestingModule({
      providers: [
        ImportRedmineService,
        {
          provide: FetchRedmineService,
          useValue: fetchServiceStub
        }
      ],
    });
  });

  it('should be created', inject([ImportRedmineService], (service: ImportRedmineService) => {
    expect(service).toBeTruthy();
  }));
  it('should not crash', inject([ImportRedmineService], (service: ImportRedmineService) => {
    service.importProject({
      projectName: '',
      projectID: 5,
      serverUrl: ''
    });
  }));
  it('should be correct', inject([ImportRedmineService], (service: ImportRedmineService) => {
    service.importProject({
      projectName: '',
      projectID: 5,
      serverUrl: ''
    }).subscribe(r => {
      expect(r).toEqual(mockRedmineTrackForeverProject);
    });
  }));
});
