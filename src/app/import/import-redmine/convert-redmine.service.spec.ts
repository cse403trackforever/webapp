import { TestBed, inject } from '@angular/core/testing';

import { FetchRedmineService } from './fetch-redmine.service';
import { ConvertRedmineService } from './convert-redmine.service';
import { RedmineProject } from './models/redmine-project';
import { mockRedmineProject } from './models/mock/mock-redmine-project';
import { RedmineIssueArray } from './models/redmine-issueArray';
import { mockRedmineIssueArray } from './models/mock/mock-redmine-issueArray';
import { RedmineIssue } from './models/redmine-issue';
import { mockRedmineTrackForeverProject } from './models/mock/mock-redmine-trackforever-project';
import { Observable, of } from 'rxjs';

describe('ConvertRedmineService', () => {
  let fetchServiceStub: Partial<FetchRedmineService>;

  beforeEach(() => {
    fetchServiceStub = {
      fetchProject(projectName: string): Observable<RedmineProject> {
        return of(mockRedmineProject);
      },
      fetchIssues(projectName: string, projectID: number, limit: number, offset: number): Observable<RedmineIssueArray> {
        return of(mockRedmineIssueArray);
      },
      fetchIssue(projectID: number, issueID: number): Observable<RedmineIssue> {
        return of(mockRedmineIssueArray.issues.find(issue => issue.id === issueID));
      },
      setBaseUrl(url: string) {}
    };

    TestBed.configureTestingModule({
      providers: [
        ConvertRedmineService,
        {
          provide: FetchRedmineService,
          useValue: fetchServiceStub
        }
      ],
    });
  });

  it('should be created', inject([ConvertRedmineService], (service: ConvertRedmineService) => {
    expect(service).toBeTruthy();
  }));
  it('should not crash', inject([ConvertRedmineService], (service: ConvertRedmineService) => {
    service.importProject({ projectName: '',  projectID: 5, serverUrl: '' });
  }));
  it('should be correct', inject([ConvertRedmineService], (service: ConvertRedmineService) => {
    service.importProject({ projectName: '',  projectID: 5, serverUrl: '' })
      .subscribe(r => {
        expect(r).toEqual(mockRedmineTrackForeverProject);
      });
  }));
});
