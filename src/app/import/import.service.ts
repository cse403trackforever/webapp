import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConvertService } from './convert.service';
import { DataService } from '../database/data.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { forkJoin, from, throwError } from 'rxjs';
import { mergeMap, catchError, first } from 'rxjs/operators';
import { TrackForeverProject } from './models/trackforever/trackforever-project';
import { AuthUser } from '../shared/models/auth-user';

@Injectable()
export class ImportService {

  constructor(
    private convertService: ConvertService,
    private dataService: DataService,
    private authService: AuthenticationService,
  ) { }

  public importProject(args: any): Promise<string> {
    const result = forkJoin(
      this.authService.getUser().pipe(first()),
      this.convertService.importProject(args).pipe(
        catchError(e => {
          if (e instanceof HttpErrorResponse && e.status === 404) {
            return throwError(new Error('The requested project could not be found'));
          }
          return throwError(e);
        })
      )
    ).pipe(
      mergeMap(res => {
        const user: AuthUser = res[0];
        const project: TrackForeverProject = res[1];
        return from(this.dataService.addProject(project, user.uid));
      })
    );

    return result.toPromise()
      .catch(e => {
        console.error(e);
        if (!e.message) {
          return Promise.reject(e);
        } else {
          return Promise.reject(e.message);
        }
      });
  }
}
