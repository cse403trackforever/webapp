import { Injectable } from '@angular/core';
import * as localForage from 'localforage';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { DbkeyPipe } from '../shared/pipes/dbkey.pipe';

@Injectable()
export class DataService {
  constructor(private dbkeyPipe: DbkeyPipe) { }

  /**
   * Stores a project in the database
   *
   * @param {TrackForeverProject} project the project to store
   * @returns {Promise<string>} the key generated for this project
   */
  addProject(project: TrackForeverProject): Promise<string> {
    const key: string = this.dbkeyPipe.transform(project);
    return localForage.setItem(key, project).then(() => key);
  }

  getProject(key: string): Promise<TrackForeverProject> {
    return localForage.getItem(key);
  }

  getKeys(): Promise<string[]> {
    return localForage.keys();
  }
}
