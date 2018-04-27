import { Injectable } from '@angular/core';
import { TrackForeverProject } from './models/trackforever/trackforever-project';
import { Observable } from 'rxjs/Observable';

@Injectable()
export abstract class ConvertService {

  protected constructor() { }

  abstract importProject(args: any): Observable<TrackForeverProject>;
}
