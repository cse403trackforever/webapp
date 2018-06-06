import { Injectable } from '@angular/core';
import { TrackForeverProject } from '../models/trackforever/trackforever-project';
import { ConvertService } from '../convert.service';
import { TrackForeverIssue } from '../models/trackforever/trackforever-issue';
import { Observable, of } from 'rxjs';

/**
 * A service for importing Track Forever projects from a JSON file
 */
@Injectable()
export class ConvertTrackforeverService implements ConvertService {

  /**
   * Takes a given TrackForever object and encodes to json
   * @param obj TrackForever object to encode
   */
  static toJson(obj: TrackForeverProject | TrackForeverProject[] | TrackForeverIssue, includeIssues: boolean = true): string {
    return JSON.stringify(obj, (key, val) => {
      if (key === 'issues') {
        if (includeIssues) {
          return Object.assign({}, ...Array.from(val).map(([k, v]) => ({[k]: v})));
        } else {
          return undefined;
        }
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

  /**
   * Convert json array of projects to array of objects
   * @param json array of projects in json form
   */
  static fromJsonArray(json: string): TrackForeverProject[] {
    return this.fromJson(json) as any;
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

  /**
   * Import a project from a JSON string representation
   *
   * @param {string} json the string representation of a project
   * @returns {Observable<TrackForeverProject>} an observable that emits the imported project once then completes
   */
  importProject(json: string): Observable<TrackForeverProject> {
    let project: TrackForeverProject;
    try {
      project = ConvertTrackforeverService.fromJson(json);
    } catch (e) {
      throw new Error('Incorrect file format. The file must be a Track Forever project json file.');
    }
    if (!ConvertTrackforeverService.instanceOfProject(project)) {
      throw new Error('There are missing fields in the given object.');
    }
    return of(project);
  }

}
