import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConvertService } from './convert.service';
import { DataService } from '../database/data.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class ImportService {

  constructor(
    private convertService: ConvertService,
    private dataService: DataService,
  ) { }

  public importProject(args: any): Promise<string> {
    const result = this.convertService.importProject(args).pipe(
      catchError(e => {
        if (e instanceof HttpErrorResponse && e.status === 404) {
          return throwError(new Error('The requested project could not be found'));
        }
        return throwError(e);
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
      })
      .then(project => this.dataService.addProject(project));
  }
}
