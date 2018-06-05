import { Injectable } from '@angular/core';
import { TrackForeverProject } from '../models/trackforever/trackforever-project';
import { TrackForeverIssue } from '../models/trackforever/trackforever-issue';
import { FetchRedmineService } from './fetch-redmine.service';
import { RedmineIssue } from './models/redmine-issue';
import { RedmineProject } from './models/redmine-project';
import { RedmineIssueArray } from './models/redmine-issueArray';
import { Observable, of, merge, forkJoin } from 'rxjs';
import { flatMap, map, reduce } from 'rxjs/operators';
import { RedmineJournal } from './models/redmine-journal';
import { TrackForeverComment } from '../models/trackforever/trackforever-comment';

/**
 * The type of argument passed into importProject
 */
export interface ImportRedmineArgs {
  /**
   * The name of the Redmine project
   */
  projectName: string;

  /**
   * The URL of where the Redmine project is hosted
   */
  serverUrl: string;
}

@Injectable()
export class ConvertRedmineService {

  constructor(private fetchService: FetchRedmineService) {
  }

  private static convertCommentToTrackForever(comment: RedmineJournal): TrackForeverComment {
    return {
      commenterName: comment.user.name,
      content: comment.notes
    };
  }

  private static convertIssueToTrackForever(issue: RedmineIssue): TrackForeverIssue {
    // set the first comment to be the issue description
    let comments: TrackForeverComment[] = [];
    if (issue.description !== '') {
      comments.push({
        commenterName: issue.author.name,
        content: issue.description
      });
    }

    // add the other comments from the issue's journals
    const journalComments = issue.journals
      .filter(j => j.notes !== '')
      .map(ConvertRedmineService.convertCommentToTrackForever);
    comments = comments.concat(journalComments);

    return {
      hash: '',
      prevHash: '',
      id: issue.id.toString(),
      projectId: `Redmine:${issue.project.id}`,
      status: issue.status.name,
      summary: issue.subject,
      labels: [],
      comments,
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

  /**
   * Fetch all the issues for a project. The fetch service only fetches issues 100 at a time. This requests them all and concatenates them.
   *
   * @param {string} projectName
   * @param {number} projectID
   * @param {string} serverUrl
   * @returns {Observable<RedmineIssue[]>} the list of issues for the project. Emits once then completes.
   */
  private fetchIssues(projectName: string, projectID: number, serverUrl: string): Observable<RedmineIssue[]> {
    return this.fetchService.fetchIssues(serverUrl, projectName, projectID, 100, 0).pipe(
      // get the first page and use the total number of issues to get the other pages
      flatMap((issuePage: RedmineIssueArray) => {
        let pages: Observable<RedmineIssueArray> = of(issuePage);
        for (let i = 1; i < Math.ceil(issuePage.total_count / 100.0); i++) {
          pages = merge(pages, this.fetchService.fetchIssues(serverUrl, projectName, projectID, 100, 100 * i));
        }
        return pages;
      }),

      // get the issues out of each page
      // even though the issues were already fetched 100 at a time, they need to be fetched individually to get the "journals", or comments
      flatMap((page: RedmineIssueArray) =>
        forkJoin(
          page.issues.map(issue => this.fetchService.fetchIssue(serverUrl, projectID, issue.id))
        )
      ),

      // As pages of issues are emitted, reduce them into one array
      reduce((acc: RedmineIssue[], val: RedmineIssue[]) => acc.concat(val))
    );
  }

  /**
   * Fetches the project and its issues using the fetch service
   *
   * @param {string} projectName
   * @param {string} serverUrl
   * @returns {Observable<[RedmineProject , RedmineIssue[]]>} the project and issues. Emits once then completes.
   */
  private fetchProject(projectName: string, serverUrl: string): Observable<[RedmineProject, RedmineIssue[]]> {
    return this.fetchService.fetchProject(serverUrl, projectName).pipe(
      // use the project ID to fetch the issues
      flatMap((project: RedmineProject) => {
        return this.fetchIssues(projectName, project.id, serverUrl).pipe(

          // group the project and issues together as a tuple
          map((issues): [RedmineProject, RedmineIssue[]] => [project, issues])
        );
      }),
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
    const serverUrl = args.serverUrl;
    return this.fetchProject(projectName, serverUrl).pipe(
      map((data: [RedmineProject, RedmineIssue[]]) => {
        const project = ConvertRedmineService.convertProjectToTrackForever(data[0]);
        data[1].map((issue: RedmineIssue) => ConvertRedmineService.convertIssueToTrackForever(issue))
          .forEach(issue => project.issues.set(issue.id, issue));

        return project;
      })
    );
  }

}
