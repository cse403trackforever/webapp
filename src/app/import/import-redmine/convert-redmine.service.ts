import { Injectable } from '@angular/core';
import { TrackForeverProject } from '../models/trackforever/trackforever-project';
import { TrackForeverIssue } from '../models/trackforever/trackforever-issue';
import { FetchRedmineService } from './fetch-redmine.service';
import { RedmineIssue } from './models/redmine-issue';
import { RedmineProject } from './models/redmine-project';
import { RedmineIssueArray } from './models/redmine-issueArray';
import { Observable, forkJoin, of, merge } from 'rxjs';
import { flatMap, map, reduce } from 'rxjs/operators';

/**
 * The type of argument passed into importProject
 */
export interface ImportRedmineArgs {
  /**
   * The name of the Redmine project
   */
  projectName: string;

  /**
   * The Redmine project's ID
   */
  projectID: number;

  /**
   * The URL of where the Redmine project is hosted
   */
  serverUrl: string;
}

@Injectable()
export class ConvertRedmineService {

  constructor(private fetchService: FetchRedmineService) {
  }

  private static convertIssueToTrackForever(issue: RedmineIssue): TrackForeverIssue {
    return {
      hash: '',
      prevHash: '',
      id: issue.id.toString(),
      projectId: `Redmine:${issue.project.name}`,
      status: issue.status.name,
      summary: issue.description,
      labels: [],
      comments: [],
      submitterName: issue.author.name,
      assignees: (issue.assigned_to) ? [issue.assigned_to.name] : [],
      timeCreated: Math.floor(Date.parse(issue.created_on) / 1000),
      timeUpdated: Math.floor(Date.parse(issue.updated_on) / 1000),
      timeClosed: (issue.closed_on) ? Math.floor(Date.parse(issue.closed_on) / 1000) : null
    };
  }

  private static convertProjectToTrackForever(project: RedmineProject): TrackForeverProject {
    return {
      hash: '',
      prevHash: '',
      id: `Redmine:${project.id}`,
      ownerName: '',
      name: project.name,
      description: project.description,
      source: 'Redmine',
      issues: new Map()
    };
  }

  private fetchProject(projectName: string, projectID: number, serverUrl: string): Observable<[RedmineProject, RedmineIssue[][]]> {
    return forkJoin(
      this.fetchService.fetchProject(serverUrl, projectName),
      this.fetchService.fetchIssues(serverUrl, projectName, projectID, 100, 0).pipe(
        flatMap((issuePage: RedmineIssueArray) => {
          let pages: Observable<RedmineIssueArray> = of(issuePage);

          for (let i = 1; i < Math.round(issuePage.total_count.valueOf() / 100.0); i++) {
            pages = merge(pages, this.fetchService.fetchIssues(serverUrl, projectName, projectID, 100, 100 * i));
          }

          return forkJoin(
            pages.pipe(
              flatMap((page: RedmineIssueArray) => {
                return forkJoin(
                  page.issues.map((issue: RedmineIssue) => {
                    return this.fetchService.fetchIssue(serverUrl, projectID, issue.id);
                  })
                );
              }),

              // As pages of issues are emitted, reduce them into one array
              reduce((acc: RedmineIssue[], val: RedmineIssue[]) => {
                return acc.concat(val);
              })
            )
          );
        }),
      )
    );
  }

  /**
   * Import a Redmine project into Track Forever format
   *
   * @param {ImportRedmineArgs} args
   * @returns {Observable<TrackForeverProject>}
   */
  importProject(args: ImportRedmineArgs): Observable<TrackForeverProject> {
    const projectName = args.projectName;
    const projectID = args.projectID;
    const serverUrl = args.serverUrl;
    return this.fetchProject(projectName, projectID, serverUrl).pipe(
      map((data: [RedmineProject, RedmineIssue[][]]) => {
        const project = ConvertRedmineService.convertProjectToTrackForever(data[0]);
        data[1].reduce((a, b) => a.concat(b), [])
          .map((issue: RedmineIssue) => ConvertRedmineService.convertIssueToTrackForever(issue))
          .forEach(issue => project.issues.set(issue.id, issue));

        return project;
      })
    );
  }

}
