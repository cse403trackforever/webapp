import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/merge';
import { TrackForeverProject } from './models/trackforever/trackforever-project';
import { TrackForeverIssue } from './models/trackforever/trackforever-issue';
import { TrackForeverComment } from './models/trackforever/trackforever-comment';
import { FetchGoogleCodeService } from './api/fetch-googlecode.service';
import { GoogleCodeIssue } from './models/googlecode/googlecode-issue';
import { GoogleCodeComment } from './models/googlecode/googlecode-comment';
import { GoogleCodeProject } from './models/googlecode/googlecode-project';
import { GoogleCodeIssuePage } from './models/googlecode/googlecode-issuepage';
import { GoogleCodeIssueSummary } from './models/googlecode/googlecode-issuesummary';
import { ConvertService } from './convert.service';

@Injectable()
export class ImportGoogleCodeService implements ConvertService {

  constructor(private fetchService: FetchGoogleCodeService) {
  }

  private static convertIssueToTrackForever(issue: GoogleCodeIssue, projectId: string): TrackForeverIssue {
    return {
      hash: '',
      id: issue.id.toString(),
      projectId: projectId,
      status: issue.status,
      summary: issue.summary,
      labels: issue.labels,
      comments: issue.comments.map((comment: GoogleCodeComment) => this.convertCommentToTrackForever(comment)),
      submitterName: 'Anonymous',
      assignees: [],
      timeCreated: -1,
      timeUpdated: -1,
      timeClosed: -1
    };
  }

  private static convertCommentToTrackForever(comment: GoogleCodeComment): TrackForeverComment {
    return {
      commenterName: comment.id.toString(),
      content: comment.content
    };
  }

  private static convertProjectToTrackForever(project: GoogleCodeProject, projectName: string): TrackForeverProject {
    return {
      hash: JSON.stringify(project),
      id: project.name,
      ownerName: '',
      name: project.name,
      description: project.description,
      source: 'Google Code',
      issues: []
    };
  }

  // Import GitHub Project into TrackForever format
  importProject(projectName: string): Observable<TrackForeverProject> {
    return Observable.forkJoin(
      this.fetchService.fetchProject(projectName),
      this.fetchService.fetchIssuePage(projectName, 1).flatMap((issuePage: GoogleCodeIssuePage) => {
        let i = 1;
        let pages: Observable<GoogleCodeIssuePage> = Observable.of(issuePage);
        // Get each issue page 2 -> totalPages
        while (++i < issuePage.totalPages) {
          pages = Observable.merge(pages, this.fetchService.fetchIssuePage(projectName, i));
        }

        // Map each page to an array of issues
        return Observable.forkJoin(
          pages.flatMap((page: GoogleCodeIssuePage) => {
            return Observable.forkJoin(
              page.issues.map((issue: GoogleCodeIssueSummary) => {
                return this.fetchService.fetchIssue(projectName, issue.id);
              })
            );
          })
        );
      })
    ).map((data: [GoogleCodeProject, GoogleCodeIssue[][]]) => {
      const project = ImportGoogleCodeService.convertProjectToTrackForever(data[0], projectName);
      const issues = data[1].reduce((a, b) => a.concat(b), [])
        .map((issue: GoogleCodeIssue) => ImportGoogleCodeService.convertIssueToTrackForever(issue, data[0].name));
      project.issues = issues;

      return project;
    });
  }

}
