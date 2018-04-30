import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/merge';
import { TrackForeverProject } from './models/trackforever/trackforever-project';
import { TrackForeverIssue } from './models/trackforever/trackforever-issue';
import { FetchRedmineService } from './api/fetch-redmine.service';
import { RedmineIssue } from './models/redmine/redmine-issue';
import { RedmineProject } from './models/redmine/redmine-project';
import { RedmineIssueArray } from './models/redmine/redmine-issueArray';

export interface ImportRedmineArgs {
  projectName: String;
  projectID: Number;
}

@Injectable()
export class ImportRedmineService {

  constructor(private fetchService: FetchRedmineService) {
  }

  private static convertIssueToTrackForever(issue: RedmineIssue): TrackForeverIssue {
    return {
      id: issue.id.toString(),
      projectId: issue.project_id.name,
      status: issue.status.name,
      summary: issue.description,
      labels: [],
      comments: [],
      submitterName: issue.author.name,
      assignees: (issue.assigned_to) ? [issue.assigned_to.name] : [],
      timeCreated: Date.parse(issue.created_on.toString()),
      timeUpdated: Date.parse(issue.updated_on.toString()),
      timeClosed: (issue.closed_on) ? Date.parse(issue.closed_on.toString()) : -1
    };
  }

  private static convertProjectToTrackForever(project: RedmineProject): TrackForeverProject {
    return {
      id: project.id.toString(),
      ownerName: '',
      name: project.name,
      description: project.description,
      source: 'Redmine',
      issues: []
    };
  }

  importProject(args: ImportRedmineArgs): Observable<TrackForeverProject> {
    const projectName = args.projectName;
    const projectID = args.projectID;
    return Observable.forkJoin(
      this.fetchService.fetchProject(projectName),
      this.fetchService.fetchIssues(projectName, projectID, 100, 0).flatMap((issuePage: RedmineIssueArray) => {
        let i = 0;
        let pages: Observable<RedmineIssueArray> = Observable.of(issuePage);

        while (++i < Math.round(issuePage.total_count.valueOf() / 100.0)) {
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
      const issues = data[1].reduce((a, b) => a.concat(b), [])
        .map((issue: RedmineIssue) => ImportRedmineService.convertIssueToTrackForever(issue));
      project.issues = issues;

      return project;
    });
  }

}
