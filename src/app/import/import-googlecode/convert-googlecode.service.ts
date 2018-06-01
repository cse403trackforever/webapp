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
import * as Chance from 'chance';
import { Observable, forkJoin, of, throwError, merge } from 'rxjs';
import { flatMap, reduce, map, catchError } from 'rxjs/operators';

/**
 * The argument passed into importProject.
 */
export interface ImportGooglecodeArgs {
  /**
   * The unique project name
   */
  projectName: string;

  /**
   * An option to replace user IDs with random animal names. Google Code identifies users by an assigned ID number that is consistent for
   * each issue in a project. Substituting the long ID number for a unique name can improve readability.
   */
  useRandomNames?: boolean;
}

@Injectable()
export class ConvertGooglecodeService implements ConvertService {

  constructor(private fetchService: FetchGoogleCodeService) {
  }

  /**
   * Replaces the submitterName and commenterName fields in the project with random but consistent animal names.
   * @param {TrackForeverProject} project the project to replace names in
   */
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
      console.log('failed to assign random names');
      console.log(e);
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

  /**
   * Format user ID numbers into more readable display names for the case that random names are not used.
   *
   * @param {number} id
   * @returns {string}
   */
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

    return {
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
    return {
      hash: '',
      prevHash: '',
      id: `GoogleCode:${project.name}`,
      ownerName: '',
      name: project.name,
      description: project.description,
      source: 'Google Code',
      issues: new Map()
    };
  }

  /**
   * Fetch the Google Code project in its entirety using the FetchGoogleCodeService
   * @param {string} projectName
   * @returns {Observable<[GoogleCodeProject , GoogleCodeIssue[]]>} an observable that emits the project once then completes
   */
  private fetchProject(projectName: string): Observable<[GoogleCodeProject, GoogleCodeIssue[]]> {
    // fetch the project and issues in parallel
    return forkJoin(
      this.fetchService.fetchProject(projectName),
      this.fetchService.fetchIssuePage(projectName, 1).pipe(

        // start with the first issue page to determine how many there are, then get the rest
        flatMap((issuePage: GoogleCodeIssuePage) => {
          let pages: Observable<GoogleCodeIssuePage> = of(issuePage);
          // Get each issue page 2 -> totalPages
          for (let i = 2; i <= issuePage.totalPages; i++) {
            pages = merge(pages, this.fetchService.fetchIssuePage(projectName, i));
          }

          // Map each page to an array of issues
          return pages.pipe(
            flatMap((page: GoogleCodeIssuePage) => forkJoin(
              page.issues.map((issue: GoogleCodeIssueSummary) => this.fetchService.fetchIssue(projectName, issue.id))
            )),

            // as pages are emitted, reduce them into one issue array
            reduce((acc, curr) => acc.concat(curr))
          );
        })
      )
    );
  }

  /**
   * Import Google Code Project into TrackForever format
   *
   * @param {ImportGooglecodeArgs} args
   * @returns {Observable<TrackForeverProject>} an observable that emits the converted project then completes
   */
  importProject(args: ImportGooglecodeArgs): Observable<TrackForeverProject> {
    const projectName = args.projectName;
    const useRandomNames = args.useRandomNames;
    return this.fetchProject(projectName).pipe(
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
