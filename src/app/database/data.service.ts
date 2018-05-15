import { Injectable } from '@angular/core';
import * as localForage from 'localforage';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';

@Injectable()
export class DataService {
  constructor() { }

  /**
   * Stores a project in the database
   *
   * @param {TrackForeverProject} project the project to store
   * @returns {Promise<string>} the key generated for this project
   */
  addProject(project: TrackForeverProject): Promise<string> {
    return localForage.setItem(project.id, project).then(() => project.id);
  }

  getProject(key: string): Promise<TrackForeverProject> {
    return localForage.getItem(key);
  }

  getKeys(): Promise<string[]> {
    return localForage.keys();
  }
}
