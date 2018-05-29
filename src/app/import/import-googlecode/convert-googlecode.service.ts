import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
import * as Chance from 'chance';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { merge, flatMap, reduce, map, catchError } from 'rxjs/operators';

export interface ImportGooglecodeArgs {
  projectName: string;
  userRandomNames?: boolean;
}

@Injectable()
export class ConvertGooglecodeService implements ConvertService {

  constructor(private fetchService: FetchGoogleCodeService) {
  }

  private static insertSillyNames(project: TrackForeverProject): void {
    // find number of unique ids
    const idMap = new Map();
    project.issues.forEach((issue, issueId) => {
      issue.comments.forEach(comment => {
        idMap.set(comment.commenterName, '');
      });
    });

    // generate unique names
    const pChance: Chance.Chance = new Chance.Chance(project.name);
    try {
      const ids = pChance.unique(pChance.animal, idMap.size);
      let i = 0;
      idMap.forEach((name, id) => {
        idMap.set(id, ids[i]);
        i++;
      });
    } catch (e) {
      // can get a range error if there aren't enough animals for the number of IDs
      // give up and use default IDs
      return;
    }

    // replace the ids with the unique names
    project.issues.forEach((issue, issueId) => {
      issue.submitterName = idMap.get(issue.submitterName);
      issue.comments.forEach(comment => {
        comment.commenterName = idMap.get(comment.commenterName);
      });
    });
  }

  private static formatUserId(id: number): string {
    return `User #${id}`;
  }

  private static convertIssueToTrackForever(issue: GoogleCodeIssue, projectId: string): TrackForeverIssue {
    const comments = issue.comments.map((comment: GoogleCodeComment) => this.convertCommentToTrackForever(comment));

    /*
    The first comment of every Google Code issue represents the issue's subject body.
    Therefore the timestamp and commenter ID for the first comment represent the issue's timeCreated and submitter ID.
     */
    const timeCreated = issue.comments[0].timestamp;
    const submitterName = ConvertGooglecodeService.formatUserId(issue.comments[0].commenterId);

    const newIssue = {
      hash: '',
      prevHash: '',
      id: issue.id.toString(),
      projectId: `GoogleCode:${projectId}`,
      status: issue.status,
      summary: issue.summary,
      labels: issue.labels,
      comments,
      submitterName,
      assignees: [],
      timeCreated,
      timeUpdated: null,
      timeClosed: null
    };
    newIssue.hash = SyncService.getHash(newIssue, false);
    return newIssue;
  }

  private static convertCommentToTrackForever(comment: GoogleCodeComment): TrackForeverComment {
    if (comment.content.length === 0) {
      comment.content = '(No comment was entered for this change.)';
    }

    return {
      commenterName: ConvertGooglecodeService.formatUserId(comment.commenterId),
      content: comment.content
    };
  }

  private static convertProjectToTrackForever(project: GoogleCodeProject): TrackForeverProject {
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

  // Import Google Code Project into TrackForever format
  importProject(args: ImportGooglecodeArgs): Observable<TrackForeverProject> {
    const projectName = args.projectName;
    const useRandomNames = args.userRandomNames;
    return forkJoin(
      this.fetchService.fetchProject(projectName),
      this.fetchService.fetchIssuePage(projectName, 1)
        .pipe(flatMap((issuePage: GoogleCodeIssuePage) => {
          let pages: Observable<GoogleCodeIssuePage> = of(issuePage);
          // Get each issue page 2 -> totalPages
          for (let i = 2; i <= issuePage.totalPages; i++) {
            pages = pages.pipe(merge(this.fetchService.fetchIssuePage(projectName, i)));
          }

          // Map each page to an array of issues
          return pages.pipe(
            flatMap((page: GoogleCodeIssuePage) => forkJoin(
              page.issues.map((issue: GoogleCodeIssueSummary) => this.fetchService.fetchIssue(projectName, issue.id))
            )),
            reduce((acc, curr) => acc.concat(curr))
          );
        }))
    ).pipe(
      map((data: [GoogleCodeProject, GoogleCodeIssue[]]) => {
        const project = ConvertGooglecodeService.convertProjectToTrackForever(data[0]);
        data[1]
          .map((issue: GoogleCodeIssue) => ConvertGooglecodeService.convertIssueToTrackForever(issue, data[0].name))
          .forEach(issue => project.issues.set(issue.id, issue));

        if (useRandomNames) {
          ConvertGooglecodeService.insertSillyNames(project);
        }

        return project;
      }),
      catchError((e) => {
        if (e instanceof HttpErrorResponse && e.status === 403) {
          return throwError(new Error('You do not have access to the issues for this project.'));
        }
        return throwError(e);
      })
    );
  }
}
