import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/merge';
import { TrackForeverProject } from './models/trackforever/trackforever-project';
import { TrackForeverIssue } from './models/trackforever/trackforever-issue';
import { TrackForeverComment } from './models/trackforever/trackforever-comment';
import { FetchTrackForeverService } from './api/fetch-trackforever.service';
import { ConvertService } from './convert.service';

@Injectable()
export class ImportTrackForeverService implements ConvertService {

  constructor(private fetchService: FetchTrackForeverService) {
  }

  instanceOf(object: any): object is TrackForeverProject {
    return 'id' in object && 'ownerName' in object && 'name' in object
    && 'description' in object && 'source' in object && 'issues' in object;
  }

  importProject(json: String): Observable<TrackForeverProject> {
    try {
      const project = JSON.parse(json.toString());
      if (!this.instanceOf(project)) {
        throw new Error('There are missing fields in the given opbject.');
      }
      return Observable.of(project);
    } catch (e) {
      console.error(e);
      throw new Error('Incorrect file format. The file must be a Track Forever project json file.');
    }
  }

}
