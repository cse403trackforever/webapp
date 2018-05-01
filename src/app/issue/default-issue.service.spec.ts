import { TestBed, inject } from '@angular/core/testing';

import { DefaultIssueService } from './default-issue.service';
import { IssueService } from './issue.service';
import { ProjectSummary } from '../shared/models/project-summary';
import { Project } from '../shared/models/project';
import { Issue } from '../shared/models/issue';
import { Observable } from 'rxjs/Observable';
import { mockProjectSummary } from '../shared/models/mock/mock-project-summary';
import { mockProject } from '../shared/models/mock/mock-project';
import { mockIssue } from '../shared/models/mock/mock-issue';
import { OnlineIssueService } from './online-issue.service';
import { OfflineIssueService } from './offline-issue.service';

describe('DefaultIssueService', () => {
  let issueServiceStub: Partial<IssueService>;

  beforeEach(() => {
    issueServiceStub = {
      getProjects(): Observable<ProjectSummary[]> {
        return Observable.of([mockProjectSummary]);
      },

      getProject(projectKey: string): Observable<Project> {
        return Observable.of(mockProject);
      },

      getIssue(projectKey: string, issueId: String): Observable<Issue> {
        return Observable.of(mockIssue);
      }
    };

    TestBed.configureTestingModule({
      providers: [
        DefaultIssueService,
        {
          provide: OnlineIssueService,
          useValue: issueServiceStub
        },
        {
          provide: OfflineIssueService,
          useValue: issueServiceStub
        },
      ]
    });
  });

  it('should be created', inject([DefaultIssueService], (service: DefaultIssueService) => {
    expect(service).toBeTruthy();
  }));
});
