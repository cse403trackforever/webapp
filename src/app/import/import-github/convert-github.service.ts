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
import { SyncService } from '../../sync/sync.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { flatMap, map, merge, catchError } from 'rxjs/operators';

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

    const newIssue = {
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
    newIssue.hash = SyncService.getHash(newIssue, false);
    return newIssue;
  }

  private static convertCommentToTrackForever(comment: GitHubComment): TrackForeverComment {
    return {
      commenterName: comment.user.login,
      content: comment.body
    };
  }

  private static convertProjectToTrackForever(project: GitHubProject, projectName: string): TrackForeverProject {
    const newProject = {
      hash: '',
      prevHash: '',
      id: `GitHub:${project.id}`,
      ownerName: project.owner.login,
      name: projectName,
      description: project.description || '',
      source: 'GitHub',
      issues: new Map()
    };
    newProject.hash = SyncService.getHash(newProject, false);
    return newProject;
  }

  // Import GitHub Project into TrackForever format
  importProject(ownerName: string, projectName: string): Observable<TrackForeverProject> {
    const regex = /\<\S*page=(\d+)\>; rel="last"/gm;
    // fetch project and issues in parallel
    return forkJoin(
      this.fetchService.fetchProject(ownerName, projectName),
      this.fetchService.fetchIssues(ownerName, projectName, 1)
        .pipe(flatMap((response: HttpResponse<GitHubIssue[]>): Observable<[GitHubIssue, GitHubComment[]][]> => {
          const link = response.headers.get('link');
          // Assume only one page unless link header is set
          let lastIndex = 1;
          if (link) {
            const matches = regex.exec(link);
            lastIndex = Number.parseInt(matches[1]);
          }

          let pages = of(response.body);
          for (let i = 2; i <= lastIndex; i++) {
            pages = pages.pipe(merge(this.fetchService.fetchIssues(ownerName, projectName, i).pipe(map(p => p.body))));
          }

          // fetch the comments in parallel
          return pages.pipe(flatMap(resp =>
            forkJoin(
                resp.map(issue => this.fetchService.fetchComments(issue.comments_url)
                  .pipe(map((comments: GitHubComment[]): [GitHubIssue, GitHubComment[]] => [issue, comments])))
            )
          ));
        }))
    ).pipe(
      map((data: [GitHubProject, [GitHubIssue, GitHubComment[]][]]): TrackForeverProject => {
        const githubProject: GitHubProject = data[0];
        const githubIssuesAndComments: [GitHubIssue, GitHubComment[]][] = data[1];

        // convert project
        const project: TrackForeverProject = ConvertGithubService.convertProjectToTrackForever(data[0], projectName);

        // convert issues
        githubIssuesAndComments.map((githubIssueAndComment: [GitHubIssue, GitHubComment[]]): TrackForeverIssue => {
          const githubIssue: GitHubIssue = githubIssueAndComment[0];
          const githubComments: GitHubComment[] = githubIssueAndComment[1];

          return ConvertGithubService.convertIssueToTrackForever(githubIssue, githubProject.id, githubComments);
        }).filter(e => e).forEach(issue => project.issues.set(issue.id, issue));

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
