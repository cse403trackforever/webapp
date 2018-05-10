import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';

/**
 * The IssueService fetches issues and project information for viewing.
 */
@Injectable()
export class SyncService {

  /**
   * Calculates the hash for a given project or issue ignoring the previous hash and the associated issues
   * @param object project or issue to get the hash for
   * @param prev whether to generate the current hash or the new one
   * false is for current, true is for next
   */
  static getHash(object: TrackForeverProject|TrackForeverIssue, prev: Boolean = true): string {
    return CryptoJS.SHA3(JSON.stringify(object, (key: string, value) => {
      if ((key === 'prevHash' && prev) || (key === 'hash' && !prev) || key === 'issues') {
        return undefined;
      } else {
        return value;
      }
    })).toString();
  }

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
