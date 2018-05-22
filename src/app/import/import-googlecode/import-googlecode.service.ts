import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/reduce';
import { TrackForeverProject } from '../models/trackforever/trackforever-project';
import { TrackForeverIssue } from '../models/trackforever/trackforever-issue';
import { TrackForeverComment } from '../models/trackforever/trackforever-comment';
import { FetchGoogleCodeService } from './fetch-googlecode.service';
import { GoogleCodeIssue } from './models/googlecode-issue';
import { GoogleCodeComment } from './models/googlecode-comment';
import { GoogleCodeProject } from './models/googlecode-project';
import { GoogleCodeIssuePage } from './models/googlecode-issuepage';
import { GoogleCodeIssueSummary } from './models/googlecode-issuesummary';
import { ConvertService } from '../convert.service';
import { SyncService } from '../../sync/sync.service';

@Injectable()
export class ImportGoogleCodeService implements ConvertService {

  constructor(private fetchService: FetchGoogleCodeService) {
  }

  private static convertIssueToTrackForever(issue: GoogleCodeIssue, projectId: string): TrackForeverIssue {
    const newIssue = {
      hash: '',
      prevHash: '',
      id: issue.id.toString(),
      projectId: `GoogleCode:${projectId}`,
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
    newIssue.hash = SyncService.getHash(newIssue, false);
    return newIssue;
  }

  private static convertCommentToTrackForever(comment: GoogleCodeComment): TrackForeverComment {
    return {
      commenterName: comment.id.toString(),
      content: comment.content
    };
  }

  private static convertProjectToTrackForever(project: GoogleCodeProject, projectName: string): TrackForeverProject {
    const newProject = {
      hash: '',
      prevHash: '',
      id: `GoogleCode:${project.name}`,
      ownerName: '',
      name: project.name,
      description: project.description,
      source: 'Google Code',
      issues: new Map()
    };
    newProject.hash = SyncService.getHash(newProject, false);
    return newProject;
  }

  // Import GitHub Project into TrackForever format
  importProject(projectName: string): Observable<TrackForeverProject> {
    return Observable.forkJoin(
      this.fetchService.fetchProject(projectName),
      this.fetchService.fetchIssuePage(projectName, 1)
        .flatMap((issuePage: GoogleCodeIssuePage) => {
          let pages: Observable<GoogleCodeIssuePage> = Observable.of(issuePage);
          // Get each issue page 2 -> totalPages
          for (let i = 2; i <= issuePage.totalPages; i++) {
            pages = Observable.merge(pages, this.fetchService.fetchIssuePage(projectName, i));
          }

          // Map each page to an array of issues
          return pages.flatMap((page: GoogleCodeIssuePage) => Observable.forkJoin(
            page.issues.map((issue: GoogleCodeIssueSummary) => this.fetchService.fetchIssue(projectName, issue.id))
          )).reduce((acc, curr) => acc.concat(curr));
        })
    ).map((data: [GoogleCodeProject, GoogleCodeIssue[]]) => {
      const project = ImportGoogleCodeService.convertProjectToTrackForever(data[0], projectName);
      data[1]
        .map((issue: GoogleCodeIssue) => ImportGoogleCodeService.convertIssueToTrackForever(issue, data[0].name))
        .forEach(issue => project.issues.set(issue.id, issue));

      return project;
    });
  }

}