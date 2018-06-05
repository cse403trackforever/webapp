import { Injectable } from '@angular/core';
import * as localForage from 'localforage';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { Observable } from 'rxjs';

/**
 * A service to interface with a local IndexedDB database using LocalForage
 */
@Injectable()
export class DataService {
  /**
   * A map from user uid to their store (database)
   */
  private storeMap: Map<string, LocalForage>;

  constructor() {
    this.storeMap = new Map();
  }

  /**
   * Get a user's store and create it if it does not exist
   *
   * @param {string} uid the user's ID from firebase
   * @returns {LocalForage} the user's LocalForage store
   */
  private getStore(uid: string): LocalForage {
    if (!this.storeMap.has(uid)) {
      const store = localForage.createInstance({
        name: uid
      });
      this.storeMap.set(uid, store);
    }
    return this.storeMap.get(uid);
  }

  /**
   * Stores a project in the user's database
   *
   * @param {TrackForeverProject} project the project to store
   * @param {string} uid AuthUser user id to bind this project to
   * @returns {Promise<string>} the key generated for this project
   */
  addProject(project: TrackForeverProject, uid: string): Promise<string> {
    return this.getStore(uid).setItem(project.id, project).then(() => project.id);
  }

  /**
   * Get a project from the user's database
   *
   * @param {string} projectId the ID of the project to get
   * @param {string} uid the user's ID
   * @returns {Promise<TrackForeverProject>} a Promise of the requested project
   */
  getProject(projectId: string, uid: string): Promise<TrackForeverProject> {
    return this.getStore(uid).getItem(projectId);
  }

  /**
   * Get all the projects from a user's database
   *
   * @param {string} uid the user's ID
   * @returns {Observable<TrackForeverProject[]>} an observable of the user's projects. Emits the empty list, then emits a more complete
   * list of project on every emission until the list is complete, then completes.
   */
  getProjects(uid: string): Observable<TrackForeverProject[]> {
    return new Observable((observer) => {
      const projects: Array<TrackForeverProject> = [];
      observer.next([]);
      this.getKeys(uid).then((keys: Array<string>) => {
        Promise.all(keys.map((key) => {
          return this.getProject(key, uid).then((project: TrackForeverProject) => {
            projects.push(project);
            observer.next(projects);
          });
        })).then(() => observer.complete());
      });
    });
  }

  /**
   * Get all of the project IDs from a user's database
   *
   * @param {string} uid the user's ID
   * @returns {Promise<string[]>} a promise of the IDs for all the user's projects
   */
  getKeys(uid: string): Promise<string[]> {
    return this.getStore(uid).keys();
  }
}
