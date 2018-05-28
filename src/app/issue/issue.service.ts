import { Injectable } from '@angular/core';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';
import { Observable } from 'rxjs';

/**
 * The IssueService fetches issues and project information for viewing.
 */
@Injectable()
export abstract class IssueService {
  abstract getProjects(): Observable<TrackForeverProject[]>;

  abstract getProject(projectKey: string): Observable<TrackForeverProject>;

  abstract getIssue(projectKey: string, issueId: string): Observable<TrackForeverIssue>;

  abstract setProject(project: TrackForeverProject): Observable<any>;

  abstract setIssue(issue: TrackForeverIssue): Observable<any>;
}
