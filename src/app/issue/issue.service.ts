import { Injectable } from '@angular/core';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';
import { Observable } from 'rxjs';

/**
 * The IssueService fetches issues and project information for viewing.
 */
@Injectable()
export abstract class IssueService {
  /**
   * Get all projects for the signed-in user
   *
   * @returns {Observable<TrackForeverProject[]>} an observable that outputs a list of projects for a user. The observable outputs projects
   * over time and complete when the project list is complete.
   */
  abstract getProjects(): Observable<TrackForeverProject[]>;

  /**
   * Returns a project for the signed-in user
   *
   * @param {string} projectKey the project ID of the project ot retrieve
   * @returns {Observable<TrackForeverProject>} the project with an ID of projectKey. The observable emits once then completes.
   */
  abstract getProject(projectKey: string): Observable<TrackForeverProject>;

  /**
   * Get an issue for the signed-in user
   *
   * @param {string} projectKey the project ID of the issue's parent project
   * @param {string} issueId the ID of the issue to retrieve
   * @returns {Observable<TrackForeverIssue>} the issue. The observable emits once then completes.
   */
  abstract getIssue(projectKey: string, issueId: string): Observable<TrackForeverIssue>;

  /**
   * Update or add a project
   *
   * @param {TrackForeverProject} project the project to add or update
   * @returns {Observable<any>} an observable that completes when the update is complete. What this observable emits is undefined. It should
   * only be used to check for errors and completion.
   */
  abstract setProject(project: TrackForeverProject): Observable<any>;

  /**
   * Update or add an issue. This modifies the project that the issue belongs to.
   *
   * @param {TrackForeverIssue} issue the issue to add or update
   * @returns {Observable<any>} an observable indicating errors and completion
   */
  abstract setIssue(issue: TrackForeverIssue): Observable<any>;
}
