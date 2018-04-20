import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { FetchGithubService } from './api/fetch-github.service';
import { ProjectPageComponent } from '../project-page/project-page.component';
import { GitHubProject } from './models/github/github-project';
import { GitHubIssue } from './models/github/github-issue';
import { GitHubLabel } from './models/github/github-label';
import { GitHubComment } from './models/github/github-comment';
import { GitHubOwner } from './models/github/github-owner';
import { TrackForeverProject } from './models/trackforever/trackforever-project';
import { TrackForeverIssue } from './models/trackforever/trackforever-issue';
import { TrackForeverComment } from './models/trackforever/trackforever-comment';

@Injectable()
export class ImportGithubService {

  constructor(private fetchService: FetchGithubService) { }

  // Import GitHub Project into TrackForever format
  importProject(ownerName: String, projectName: String): Observable<TrackForeverProject> {
    return this.fetchService.fetchProject(ownerName, projectName)
      .map((project: GitHubProject) => {
        // Create project
        const newProject: TrackForeverProject = {
          id: project.id.toString(),
          ownerName: project.owner.login,
          name: projectName,
          description: project.description || '',
          source: 'GitHub',
          issues: []
        };

        // Fetch issues and add to new project
        this.fetchService.fetchIssues(ownerName, projectName).subscribe((issues) => {
          newProject.issues = issues.map((issue: GitHubIssue) => {
            // Create Issue
            const newIssue: TrackForeverIssue = {
              id: issue.number.toString(),
              projectId: project.id.toString(),
              status: issue.state,
              summary: issue.body,
              labels: issue.labels.map((label: GitHubLabel) => label.name),
              comments: [],
              submitterName: issue.user.login,
              assignees: issue.assignees.map((owner: GitHubOwner) => owner.login),
              timeCreated: (issue.created_at) ? Date.parse(issue.created_at.toString()) : -1,
              timeUpdated: (issue.updated_at) ? Date.parse(issue.updated_at.toString()) : -1,
              timeClosed: (issue.closed_at) ? Date.parse(issue.closed_at.toString()) : -1
            };

            // Fetch comments and add to new issue
            this.fetchService.fetchComments(issue.comments_url).subscribe((comments: GitHubComment[]) => {
              newIssue.comments = comments.map((comment): TrackForeverComment => {
                // Create comment
                return {
                  commenterName: comment.user.login,
                  content: comment.body
                };
              });
            });

            return newIssue;
          });
        });

        return newProject;
      });
  }

}
