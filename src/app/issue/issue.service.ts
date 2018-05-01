import { Observable } from 'rxjs/Observable';
import { ProjectSummary } from '../shared/models/project-summary';
import { Issue } from '../shared/models/issue';
import { Project } from '../shared/models/project';
import { Injectable } from '@angular/core';

/**
 * The IssueService fetches issues and project information for viewing.
 */
@Injectable()
export abstract class IssueService {
  abstract getProjects(): Observable<ProjectSummary[]>;

  abstract getProject(projectKey: string): Observable<Project>;

  abstract getIssue(projectKey: string, issueId: String): Observable<Issue>;
}
