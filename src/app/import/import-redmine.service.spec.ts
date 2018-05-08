import { TestBed, inject } from '@angular/core/testing';

import { FetchRedmineService } from './api/fetch-redmine.service';
import { ImportRedmineService } from './import-redmine.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { RedmineProject } from './models/redmine/redmine-project';
import { mockRedmineProject } from './models/redmine/mock/mock-redmine-project';
import { RedmineIssueArray } from './models/redmine/redmine-issueArray';
import { mockRedmineIssueArray } from './models/redmine/mock/mock-redmine-issueArray';
import { RedmineIssue } from './models/redmine/redmine-issue';
import { mockRedmineTrackForeverProject } from './models/redmine/mock/mock-redmine-trackforever-project';

describe('ImportRedmineService', () => {
  let fetchServiceStub: Partial<FetchRedmineService>;

  beforeEach(() => {
    fetchServiceStub = {
      fetchProject(projectName: string): Observable<RedmineProject> {
        return Observable.of(mockRedmineProject);
      },
      fetchIssues(projectName: string, projectID: Number, limit: Number, offset: Number): Observable<RedmineIssueArray> {
        return Observable.of(mockRedmineIssueArray);
      },
      fetchIssue(projectID: Number, issueID: Number): Observable<RedmineIssue> {
        return Observable.of(mockRedmineIssueArray.issues.find(issue => issue.id === issueID));
      }
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
      projectID: 5
    });
  }));
  it('should be correct', inject([ImportRedmineService], (service: ImportRedmineService) => {
    service.importProject({
      projectName: '',
      projectID: 5
    }).subscribe(r => {
      // TODO remove these two lines when the hash branch is merged in
      r.hash = mockRedmineTrackForeverProject.hash;
      r.issues.forEach(i => i.hash = mockRedmineTrackForeverProject.issues.find(ir => ir.id === i.id).hash);

      expect(r).toEqual(mockRedmineTrackForeverProject);
    });
  }));
});
