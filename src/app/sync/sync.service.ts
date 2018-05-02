import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';

/**
 * The IssueService fetches issues and project information for viewing.
 */
@Injectable()
export class SyncService {

  // TODO: receive hashes from server and then request new projects/issues

  // TODO: auto merge issues/projects that don't need intervention

  // TODO: surface user facing merge tool

  /**
   * Calculates new hash for the given project.
   * To be sent to server for validation and set as the new hash once merge complete.
   * @param project project to calculate hash for
   */
  getNewHash(project: TrackForeverProject): void {
    const hashes = {
      project: null,
      issues: []
    };
    project.issues.forEach((issue: TrackForeverIssue): void => {
      hashes.issues.push(CryptoJS.SHA3(JSON.stringify(issue)).toString());
    });
    hashes.project = CryptoJS.SHA3(JSON.stringify(project)).toString();
  }
}
