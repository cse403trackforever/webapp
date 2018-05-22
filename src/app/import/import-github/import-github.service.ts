import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/forkJoin';
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
import { HttpResponse } from '@angular/common/http';

export interface ImportGithubArgs {
  ownerName: string;
  projectName: string;
}

@Injectable()
export class ImportGithubService implements ConvertService {

  constructor(private fetchService: FetchGithubService) {
  }

  private static convertIssueToTrackForever(issue: GitHubIssue, projectId: number, ghComments: Array<GitHubComment>): TrackForeverIssue {
    let comments: TrackForeverComment[] = [];
    if (issue.body) {
      comments.push({
        content: issue.body,
        commenterName: issue.user.login
      });
    }
    comments = comments.concat(ghComments.map(ImportGithubService.convertCommentToTrackForever));

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
      timeCreated: (issue.created_at) ? Date.parse(issue.created_at) : -1,
      timeUpdated: (issue.updated_at) ? Date.parse(issue.updated_at) : -1,
      timeClosed: (issue.closed_at) ? Date.parse(issue.closed_at) : -1
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
  importProject(args: ImportGithubArgs): Observable<TrackForeverProject> {
    const ownerName = args.ownerName;
    const projectName = args.projectName;
    const regex = /\<\S*page=(\d+)\>; rel="last"/gm;
    // fetch project and issues in parallel
    return Observable.forkJoin(
      this.fetchService.fetchProject(ownerName, projectName),
      this.fetchService.fetchIssues(ownerName, projectName, 1)
        .flatMap((response: HttpResponse<GitHubIssue[]>): Observable<[GitHubIssue, GitHubComment[]][]> => {
          const link = response.headers.get('link');
          // Assume only one page unless link header is set
          let lastIndex = 1;
          if (link) {
            const matches = regex.exec(link);
            lastIndex = Number.parseInt(matches[1]);
          }
          let pages = Observable.of(response);

          for (let i = 2; i <= lastIndex; i++) {
            pages = Observable.merge(pages, this.fetchService.fetchIssues(ownerName, projectName, i));
          }

          // fetch the comments in parallel
          return pages.flatMap(resp =>
            Observable.forkJoin(
                resp.body.map(issue => this.fetchService.fetchComments(issue.comments_url)
              .map((comments: GitHubComment[]): [GitHubIssue, GitHubComment[]] => [issue, comments]))
            )
          );
        })
    ).map((data: [GitHubProject, [GitHubIssue, GitHubComment[]][]]): TrackForeverProject => {
      const githubProject: GitHubProject = data[0];
      const githubIssuesAndComments: [GitHubIssue, GitHubComment[]][] = data[1];

      // convert project
      const project: TrackForeverProject = ImportGithubService.convertProjectToTrackForever(data[0], projectName);

      // convert issues
      githubIssuesAndComments.map((githubIssueAndComment: [GitHubIssue, GitHubComment[]]): TrackForeverIssue => {
        const githubIssue: GitHubIssue = githubIssueAndComment[0];
        const githubComments: GitHubComment[] = githubIssueAndComment[1];

        return ImportGithubService.convertIssueToTrackForever(githubIssue, githubProject.id, githubComments);
      }).forEach(issue => project.issues.set(issue.id, issue));

      return project;
    });
  }

}
