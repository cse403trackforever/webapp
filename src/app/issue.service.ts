import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import { DataService } from './database/data.service';
import { TrackForeverProject } from './import/models/trackforever/trackforever-project';
import { TrackForeverIssue } from './import/models/trackforever/trackforever-issue';
import { ProjectSummary } from './shared/models/project-summary';
import { Issue } from './shared/models/issue';
import { Project } from './shared/models/project';
import { IssueSummary } from './shared/models/issue-summary';
import { environment } from '../environments/environment';

/**
 * The IssueService fetches issues and project information for viewing.
 */
@Injectable()
export class IssueService {
  constructor(
    private http: HttpClient,
    private dataService: DataService
  ) { }

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
      issues: p.issues.map(IssueService.toIssueSummary)
    };
  }

  getProjects(): Observable<ProjectSummary[]> {
    // TODO decide how to choose between online/offline usage
    if (!environment.offline) {
      return this.http.get<ProjectSummary[]>(`${environment.apiUrl}/projects`);
    }

    return new Observable((observer) => {
      const projects: ProjectSummary[] = [];
      this.dataService.getKeys().then((keys: string[]) => {
        keys.forEach((key) => {
          this.dataService.getProject(key).then((project: TrackForeverProject) => {
            projects.push(IssueService.toProjectSummary(project));
            observer.next(projects);
          });
        });
      });
    });
  }

  getProject(projectKey: string): Observable<Project> {
    if (!environment.offline) {
      return this.http.get<Project>(`${environment.apiUrl}/projects/${projectKey}`);
    }

    return Observable.fromPromise(this.dataService.getProject(projectKey)
      .then((project: TrackForeverProject) => IssueService.toProject(project))
    );
  }

  getIssue(projectKey: string, issueId: String): Observable<Issue> {
    if (!environment.offline) {
      return this.http.post<Issue>(`${environment.apiUrl}/issues`, {
        projectKey,
        issueId
      });
    }

    return Observable.fromPromise(this.dataService.getProject(projectKey)
      .then((project: TrackForeverProject) => {
        return project.issues.find((issue: TrackForeverIssue) => issue.id === issueId);
      })
    );
  }
}
