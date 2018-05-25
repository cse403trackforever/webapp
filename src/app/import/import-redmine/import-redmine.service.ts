import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/merge';
import { TrackForeverProject } from '../models/trackforever/trackforever-project';
import { TrackForeverIssue } from '../models/trackforever/trackforever-issue';
import { FetchRedmineService } from './fetch-redmine.service';
import { RedmineIssue } from './models/redmine-issue';
import { RedmineProject } from './models/redmine-project';
import { RedmineIssueArray } from './models/redmine-issueArray';
import { SyncService } from '../../sync/sync.service';

export interface ImportRedmineArgs {
  projectName: string;
  projectID: number;
  serverUrl: string;
}

@Injectable()
export class ImportRedmineService {

  constructor(private fetchService: FetchRedmineService) {
  }

  private static convertIssueToTrackForever(issue: RedmineIssue): TrackForeverIssue {
    const newIssue = {
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
    newIssue.hash = SyncService.getHash(newIssue, false);
    return newIssue;
  }

  private static convertProjectToTrackForever(project: RedmineProject): TrackForeverProject {
    const newProject = {
      hash: '',
      prevHash: '',
      id: `Redmine:${project.id}`,
      ownerName: '',
      name: project.name,
      description: project.description,
      source: 'Redmine',
      issues: new Map()
    };
    newProject.hash = SyncService.getHash(newProject, false);
    return newProject;
  }

  importProject(args: ImportRedmineArgs): Observable<TrackForeverProject> {
    this.fetchService.setBaseUrl(args.serverUrl);
    const projectName = args.projectName;
    const projectID = args.projectID;
    return Observable.forkJoin(
      this.fetchService.fetchProject(projectName),
      this.fetchService.fetchIssues(projectName, projectID, 100, 0).flatMap((issuePage: RedmineIssueArray) => {
        let pages: Observable<RedmineIssueArray> = Observable.of(issuePage);

        for (let i = 1; i < Math.round(issuePage.total_count.valueOf() / 100.0); i++) {
          pages = Observable.merge(pages, this.fetchService.fetchIssues(projectName, projectID, 100, 100 * i));
        }

        return Observable.forkJoin(
          pages.flatMap((page: RedmineIssueArray) => {
            return Observable.forkJoin(
              page.issues.map((issue: RedmineIssue) => {
                return this.fetchService.fetchIssue(projectID, issue.id);
              })
            );
          })
        );
      })
    ).map((data: [RedmineProject, RedmineIssue[][]]) => {
      const project = ImportRedmineService.convertProjectToTrackForever(data[0]);
      data[1].reduce((a, b) => a.concat(b), [])
        .map((issue: RedmineIssue) => ImportRedmineService.convertIssueToTrackForever(issue))
        .forEach(issue => project.issues.set(issue.id, issue));

      return project;
    });
  }

}
