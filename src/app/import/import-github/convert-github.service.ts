import { Injectable } from '@angular/core';
import { FetchGithubService } from './fetch-github.service';
import { GitHubProject } from './models/github-project';
import { GitHubIssue } from './models/github-issue';
import { GitHubLabel } from './models/github-label';
import { GitHubComment } from './models/github-comment';
import { GitHubOwner } from './models/github-owner';
import { TrackForeverProject } from '../models/trackforever/trackforever-project';
import { TrackForeverIssue } from '../models/trackforever/trackforever-issue';
import { TrackForeverComment } from '../models/trackforever/trackforever-comment';
import { ConvertService } from '../convert.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, of, throwError, merge } from 'rxjs';
import { flatMap, map, catchError, reduce } from 'rxjs/operators';

/**
 * The argument object to be passed into importProject.
 *
 * e.g. for the project at kelloggm/checker-framework, the object would be
 * {
 *   ownerName: 'kelloggm',
 *   projectName: 'checker-framework'
 * }
 */
export interface ImportGithubArgs {
  /**
   * The GitHub owner name for the project to import
   */
  ownerName: string;

  /**
   * The GitHub project name
   */
  projectName: string;
}

/**
 * A service to get and convert a GitHub project into a Track Forever project
 */
@Injectable()
export class ConvertGithubService implements ConvertService {

  constructor(private fetchService: FetchGithubService) {
  }

  private static convertIssueToTrackForever(issue: GitHubIssue, projectId: number, ghComments: Array<GitHubComment>): TrackForeverIssue {
    // Don't convert PRs
    if (issue.pull_request) {
      return null;
    }

    let comments: TrackForeverComment[] = [];
    if (issue.body) {
      comments.push({
        content: issue.body,
        commenterName: issue.user.login
      });
    }
    comments = comments.concat(ghComments.map(ConvertGithubService.convertCommentToTrackForever));

    return {
      hash: '',
      prevHash: '',
      id: issue.number.toString(),
      projectId: `GitHub:${projectId}`,
      status: issue.state,
      summary: issue.title,
      labels: issue.labels.map((label: GitHubLabel) => label.name),
      comments: comments,
      submitterName: issue.user.login,
      assignees: issue.assignees.map((owner: GitHubOwner) => owner.login),
      timeCreated: (issue.created_at) ? Math.floor(Date.parse(issue.created_at) / 1000) : null,
      timeUpdated: (issue.updated_at) ? Math.floor(Date.parse(issue.updated_at) / 1000) : null,
      timeClosed: (issue.closed_at) ? Math.floor(Date.parse(issue.closed_at) / 1000) : null
    };
  }

  private static convertCommentToTrackForever(comment: GitHubComment): TrackForeverComment {
    return {
      commenterName: comment.user.login,
      content: comment.body
    };
  }

  private static convertProjectToTrackForever(project: GitHubProject, projectName: string): TrackForeverProject {
    return {
      hash: '',
      prevHash: '',
      id: `GitHub:${project.id}`,
      ownerName: project.owner.login,
      name: projectName,
      description: project.description || '',
      source: 'GitHub',
      issues: new Map()
    };
  }

  /**
   * Fetch a complete representation of a GitHub project using the FetchGithubService
   *
   * @param {string} ownerName
   * @param {string} projectName
   * @returns {Observable<[GitHubProject , [GitHubIssue , GitHubComment[]][]]>} an observable of the complete project that emits once then
   * completes
   */
  private fetchProject(ownerName: string, projectName: string): Observable<[GitHubProject, [GitHubIssue, GitHubComment[]][]]> {
    const regex = /\<\S*page=(\d+)\>; rel="last"/gm;

    // fetch project and issues in parallel
    return forkJoin(
      this.fetchService.fetchProject(ownerName, projectName),
      this.fetchService.fetchIssues(ownerName, projectName, 1).pipe(

        // map the fetched issues into an array of tuples containing the issue and its comments
        flatMap((response: HttpResponse<GitHubIssue[]>): Observable<[GitHubIssue, GitHubComment[]][]> => {
          const link = response.headers.get('link');
          // Assume only one page unless link header is set
          let lastIndex = 1;
          if (link) {
            const matches = regex.exec(link);
            lastIndex = Number.parseInt(matches[1]);
          }

          // construct an observable that emits each page of issues as they are fetched
          let pages = of(response.body);
          for (let i = 2; i <= lastIndex; i++) {
            pages = merge(pages, this.fetchService.fetchIssues(ownerName, projectName, i).pipe(map(p => p.body)));
          }

          // fetch the comments in parallel
          return pages.pipe(
            flatMap(resp =>
              forkJoin(
                resp.map(issue => this.fetchService.fetchComments(issue.comments_url).pipe(
                  map((comments: GitHubComment[]): [GitHubIssue, GitHubComment[]] => [issue, comments]))
                )
              )
            )
          );
        }),

        // As pages of issue-comment tuples are emitted, reduce them into one array
        reduce((acc: [GitHubIssue, GitHubComment[]][], val: [GitHubIssue, GitHubComment[]][]) => {
          return acc.concat(val);
        })
      )
    );
  }

  /**
   * Import GitHub Project into TrackForever format
   *
   * @param {ImportGithubArgs} args the owner and project name for the project to import
   * @returns {Observable<TrackForeverProject>} an observable that emits the converted project then completes
   */
  importProject(args: ImportGithubArgs): Observable<TrackForeverProject> {
    const ownerName = args.ownerName;
    const projectName = args.projectName;

    return this.fetchProject(ownerName, projectName).pipe(

      // convert the fetched project into a Track Forever project
      map((data: [GitHubProject, [GitHubIssue, GitHubComment[]][]]): TrackForeverProject => {
        const githubProject: GitHubProject = data[0];
        const githubIssuesAndComments: [GitHubIssue, GitHubComment[]][] = data[1];

        // convert project
        const project: TrackForeverProject = ConvertGithubService.convertProjectToTrackForever(data[0], projectName);

        // convert issues
        githubIssuesAndComments
          .map((githubIssueAndComment: [GitHubIssue, GitHubComment[]]): TrackForeverIssue => {
            const githubIssue: GitHubIssue = githubIssueAndComment[0];
            const githubComments: GitHubComment[] = githubIssueAndComment[1];

            return ConvertGithubService.convertIssueToTrackForever(githubIssue, githubProject.id, githubComments);
          })

          // filter out pull requests which were set to null
          .filter(e => e)

          // set the project's issues
          .forEach(issue => project.issues.set(issue.id, issue));

        return project;
      }),
      catchError((e) => {
        if (e instanceof HttpErrorResponse && e.status === 403) {
          return throwError(new Error('You either do not have access to the issues for this project or have been rate limited by GitHub.'));
        }
        return throwError(e);
      })
    );
  }

}
