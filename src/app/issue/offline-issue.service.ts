import { Injectable } from '@angular/core';
import { DataService } from '../database/data.service';
import { IssueService } from './issue.service';
import { Observable } from 'rxjs/Observable';
import { Issue } from '../shared/models/issue';
import { Project } from '../shared/models/project';
import { ProjectSummary } from '../shared/models/project-summary';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';
import { IssueSummary } from '../shared/models/issue-summary';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import 'rxjs/add/observable/fromPromise';

/**
 * Fetches issues from an offline database
 */
@Injectable()
export class OfflineIssueService implements IssueService {

  constructor(private dataService: DataService) { }

  private static toProjectSummary(p: TrackForeverProject): ProjectSummary {
    return {
      id: p.id,
      ownerName: p.ownerName,
      name: p.name,
      description: p.description,
      source: p.source
    };
  }

  private static toIssueSummary(i: TrackForeverIssue): IssueSummary {
    return {
      id: i.id,
      projectId: i.projectId,
      status: i.status,
      summary: i.summary,
      labels: i.labels,
      numComments: i.comments.length,
      submitterName: i.submitterName,
      assignees: i.assignees,
      timeCreated: i.timeCreated,
      timeUpdated: i.timeUpdated,
      timeClosed: i.timeClosed
    };
  }

  private static toProject(p: TrackForeverProject): Project {
    return {
      id: p.id,
      ownerName: p.ownerName,
      name: p.name,
      description: p.description,
      source: p.source,
      issues: p.issues.map(OfflineIssueService.toIssueSummary)
    };
  }

  getIssue(projectKey: string, issueId: String): Observable<Issue> {
    return Observable.fromPromise(this.dataService.getProject(projectKey)
      .then((project: TrackForeverProject) => {
        return project.issues.find((issue: TrackForeverIssue) => issue.id === issueId);
      })
    );
  }

  getProject(projectKey: string): Observable<Project> {
    return Observable.fromPromise(this.dataService.getProject(projectKey)
      .then((project: TrackForeverProject) => OfflineIssueService.toProject(project))
    );
  }

  getProjects(): Observable<ProjectSummary[]> {
    return new Observable((observer) => {
      const projects: ProjectSummary[] = [];
      this.dataService.getKeys().then((keys: string[]) => {
        keys.forEach((key) => {
          this.dataService.getProject(key).then((project: TrackForeverProject) => {
            projects.push(OfflineIssueService.toProjectSummary(project));
            observer.next(projects);
          });
        });
      });
    });
  }
}
