import { Injectable } from '@angular/core';
import * as localForage from 'localforage';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { Observable } from 'rxjs';

@Injectable()
export class DataService {
  private storeMap: Map<string, LocalForage>;

  constructor() {
    this.storeMap = new Map();
  }

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
   * Stores a project in the database
   *
   * @param {TrackForeverProject} project the project to store
   * @param {string} uid AuthUser user id to bind this project to
   * @returns {Promise<string>} the key generated for this project
   */
  addProject(project: TrackForeverProject, uid: string): Promise<string> {
    return this.getStore(uid).setItem(project.id, project).then(() => project.id);
  }

  getProject(projectId: string, uid: string): Promise<TrackForeverProject> {
    return this.getStore(uid).getItem(projectId);
  }

  getProjects(uid: string): Observable<TrackForeverProject[]> {
    return new Observable((observer) => {
      const projects: Array<TrackForeverProject> = [];
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

  getKeys(uid: string): Promise<string[]> {
    return this.getStore(uid).keys();
  }
}
