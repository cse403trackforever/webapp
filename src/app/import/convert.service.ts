import { Injectable } from '@angular/core';
import { TrackForeverProject } from './models/trackforever/trackforever-project';
import { Observable } from 'rxjs';

/**
 * A service for getting and converting a project from another issue tracker to a Track Forever project
 */
@Injectable()
export abstract class ConvertService {

  protected constructor() { }

  /**
   * Get and convert a project from another issue tracker to a Track Forever project
   *
   * @param args The inputs necessary to fetch the project. Varies between ConvertService implementations.
   * @returns {Observable<TrackForeverProject>} an observable that emits the converted project once then completes.
   */
  abstract importProject(args: any): Observable<TrackForeverProject>;
}
