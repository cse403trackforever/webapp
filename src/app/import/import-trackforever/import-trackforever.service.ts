import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/merge';
import { TrackForeverProject } from '../models/trackforever/trackforever-project';
import { ConvertService } from '../convert.service';
import { TrackForeverIssue } from '../models/trackforever/trackforever-issue';

@Injectable()
export class ImportTrackForeverService implements ConvertService {

  /**
   * Takes a given TrackForever object and encodes to json
   * @param obj TrackForever object to encode
   */
  static toJson(obj: TrackForeverProject | TrackForeverIssue): string {
    return JSON.stringify(obj, (key, val) => {
      if (key === 'issues') {
        return Object.assign({}, ...Array.from(val).map(([k, v]) => ({[k]: v})));
      } else {
        return val;
      }
    });
  }

  /**
   * Takes the JSON representation of a TrackForverProject and returns an instance of the object
   * @param json JSON string to parse
   */
  static fromJson(json: string): TrackForeverProject {
    return JSON.parse(json, (key, val) => {
      if (key === 'issues') {
        return new Map<string, TrackForeverIssue>(Object.entries(val));
      } else {
        return val;
      }
    });
  }

  static instanceOfComment(object: any): boolean {
    return 'commenterName' in object
      && 'content' in object;
  }

  static instanceOfIssue(object: any): boolean {
    const hasFields = 'hash' in object
      && 'prevHash' in object
      && 'id' in object
      && 'projectId' in object
      && 'status' in object
      && 'summary' in object
      && 'labels' in object
      && 'submitterName' in object
      && 'assignees' in object
      && 'timeCreated' in object
      && 'timeUpdated' in object
      && 'timeClosed' in object;

    if (!hasFields) {
      return false;
    }

    // check that all comments are correct (i.e. not the case that some comment is not a comment)
    return !object.comments.some(comment => !this.instanceOfComment(comment));
  }

  static instanceOfProject(object: any): boolean {
    const hasFields = 'hash' in object
      && 'prevHash' in object
      && 'id' in object
      && 'ownerName' in object
      && 'name' in object
      && 'description' in object
      && 'source' in object
      && 'issues' in object;

    if (!hasFields) {
      return false;
    }

    // check that all issues are correct (i.e. not the case that some issue is not an issue)
    return !Array.from(object.issues).some(issue => !this.instanceOfIssue(issue[1]));
  }

  importProject(json: string): Observable<TrackForeverProject> {
    let project: TrackForeverProject;
    try {
      project = ImportTrackForeverService.fromJson(json);
    } catch (e) {
      throw new Error('Incorrect file format. The file must be a Track Forever project json file.');
    }
    if (!ImportTrackForeverService.instanceOfProject(project)) {
      throw new Error('There are missing fields in the given object.');
    }
    return Observable.of(project);
  }

}
