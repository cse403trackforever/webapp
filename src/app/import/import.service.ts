import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConvertService } from './convert.service';
import { DataService } from '../database/data.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { forkJoin, from, throwError } from 'rxjs';
import { mergeMap, catchError, first } from 'rxjs/operators';
import { TrackForeverProject } from './models/trackforever/trackforever-project';
import { AuthUser } from '../shared/models/auth-user';

/**
 * A service to import projects, convert them, and store them locally.
 * To import from a supported issue tracker, provide the corresponding ConvertService implementation.
 */
@Injectable()
export class ImportService {

  constructor(
    private convertService: ConvertService,
    private dataService: DataService,
    private authService: AuthenticationService,
  ) { }

  /**
   * Fetch and convert a project from another issue tracker using the provided ConvertService, then store it in an offline database under
   * the signed-in user.
   *
   * @param args The arguments to be passed into the ConvertService
   * @returns {Promise<string>} a Promise of the projectId that resolves when the import completes
   */
  public importProject(args: any): Promise<string> {
    // get the user and import the project in parallel using forkJoin
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

      // store the project in the database under the user's uid
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
