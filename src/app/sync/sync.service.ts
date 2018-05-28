import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { TrackForeverIssue } from '../import/models/trackforever/trackforever-issue';
import { OfflineIssueService } from '../issue/offline-issue.service';
import { OnlineIssueService } from '../issue/online-issue.service';
import { HashResponse } from './hash-response';
import { Observable, forkJoin, throwError, from } from 'rxjs';
import { mergeMap, mergeAll, map, catchError, last, concatAll } from 'rxjs/operators';

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
  static getHash(object: TrackForeverProject|TrackForeverIssue, prev: boolean = true): string {
    return CryptoJS.SHA3(JSON.stringify(object, (key: string, value) => {
      if ((key === 'prevHash' && prev) || (key === 'hash' && !prev) || key === 'issues') {
        return undefined;
      } else {
        return value;
      }
    })).toString();
  }

  /**
   * Reports true iff there have been changes to the given project
   * @param object project or issue to check
   */
  static hasChanged(object: TrackForeverProject|TrackForeverIssue): boolean {
    const hash = this.getHash(object, false);
    // Compare calculated hashes
    return hash !== object.hash;
  }

  constructor(private offlineIssueService: OfflineIssueService, private onlineIssueService: OnlineIssueService) { }

  private updateProject(updatedProject: TrackForeverProject): Observable<string> {
    let o: Observable<TrackForeverProject>;
    if (SyncService.hasChanged(updatedProject)) {
      // TODO: merge here!
      // set o to a Observable<TrackForeverProject>
    } else {
      // Make sure not to delete existing issues attached to the project
      o = this.onlineIssueService.getProject(updatedProject.id);
    }
    return o.pipe(mergeMap(p => this.offlineIssueService.setProject(p)));
  }

  private updateProjects(projToUpdate: Array<TrackForeverProject>): Observable<string> {
    return from(projToUpdate).pipe(map(p => this.updateProject(p)), mergeAll());
  }

  private updateIssue(updatedIssue: TrackForeverIssue, projectId: string): Observable<string> {
    let o: Observable<TrackForeverIssue>;
    if (SyncService.hasChanged(updatedIssue)) {
      // TODO: merge here!
      // set o to a Observable<TrackForeverIssue>
    } else {
      // Update locally unmodified issues
      o = this.onlineIssueService.getIssue(projectId, updatedIssue.id);
    }
    return o.pipe(mergeMap(newIssue => this.offlineIssueService.setIssues(projectId, [newIssue])));
  }

  private getTasks(projects: Array<TrackForeverProject>, remoteHashes: Map<string, HashResponse>): SyncTask {
    const task: SyncTask = {
      // Lists of projects
      projToFetch: [],
      projToUpdate: [],
      projToSend: [],

      // Maps of project ids to issues
      issuesToFetch: new Map(),
      issuesToUpdate: new Map(),
      issuesToSend: new Map()
    };

    // Check each project
    projects.forEach(project => {
      const hash = remoteHashes.get(project.id);
      // Catch case where remote doesn't have this project yet
      if (!hash) {
        // Mark to be sent
        task.projToSend.push(project);
        return;
      } else if (project.hash !== remoteHashes.get(project.id).project) {
        // Mark to be fetched
        task.projToUpdate.push(project);
      }

      task.issuesToSend.set(project.id, []);
      task.issuesToUpdate.set(project.id, []);

      // Check each issue
      project.issues.forEach(issue => {
        const issueHash = hash.issues.get(issue.id);
        // Catch case where remote doesn't have this issue yet
        if (!issueHash) {
          // Mark to be sent
          task.issuesToSend.get(project.id).push(issue);
        } else if (issue.hash !== issueHash) {
          // Mark to be fetched
          task.issuesToUpdate.get(project.id).push(issue);
        }
        // We're done with this issue, so remove
        hash.issues.delete(issue.id);
      });

      // Add remaining items as new issues to get
      task.issuesToFetch.set(project.id, Array.from(hash.issues.values()));
      remoteHashes.delete(project.id);
    });

    // Add remaining items as new projects to get
    remoteHashes.forEach(projectHash => task.projToFetch.push(projectHash.project));

    return task;
  }

  private executeTask(task: SyncTask): Observable<any> {
    console.log('executing sync task');
    console.log(task);
    // Make request for the wanted projects and issues
    const reqProjects: Observable<string> = this.onlineIssueService.getRequestedProjects(task.projToFetch)
      .pipe(
        mergeMap(newProjects => newProjects.map(e => this.offlineIssueService.setProject(e))),
        mergeAll()
      );
    const reqIssues: Observable<string> = this.onlineIssueService.getRequestedIssues(task.issuesToFetch)
      .pipe(
        mergeMap(newIssues => {
          const obs: Observable<string>[] = [];
          newIssues.forEach((val, key) => obs.push(this.offlineIssueService.setIssues(key, val)));
          return obs;
        }),
        mergeAll()
      );

    console.log('Sending proj');
    // Send new projects and issues
    const sendProjects: Observable<any> = this.onlineIssueService.setProjects(task.projToSend);
    const sendIssues: Observable<any> = this.onlineIssueService.setIssues(task.issuesToSend);

    // On request return check for merge conflicts.
    // If there are do merge and send back to server
    // Else update offline storage
    const updateAll: Observable<any> = this.updateProjects(task.projToUpdate)
      .pipe(
        mergeMap(() => {
          const obs: Observable<string>[] = [];
          task.issuesToUpdate.forEach((updatedIssues, projectId) => {
            updatedIssues.forEach(updatedIssue => {
              obs.push(this.updateIssue(updatedIssue, projectId));
            });
          });
          return obs;
        }),
        mergeAll()
      );

    console.log('do fork join');
    // do it all in parallel
    return forkJoin(
      reqProjects,
      reqIssues,
      sendProjects,
      sendIssues,
      updateAll
    );
  }

  sync(): Observable<any> {
    console.log('start sync');
    return forkJoin(
      this.offlineIssueService.getProjects().pipe(last()),
      this.onlineIssueService.getHashes()
    ).pipe(
      map(r => {
        console.log('got here!');
        console.log(r);
        return this.executeTask(this.getTasks(r[0], r[1]));
      }),
      catchError(e => {
        console.error(e);
        return throwError(e);
      }),
      concatAll()
    );
  }
}

interface SyncTask {
  // Lists of projects
  projToFetch: Array<string>;
  projToUpdate: Array<TrackForeverProject>;
  projToSend: Array<TrackForeverProject>;

  // Maps of project ids to issues
  issuesToFetch: Map<string, Array<string>>;
  issuesToUpdate: Map<string, Array<TrackForeverIssue>>;
  issuesToSend: Map<string, Array<TrackForeverIssue>>;
}
