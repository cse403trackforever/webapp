import { Injectable } from '@angular/core';
import { ConvertService } from './convert.service';
import { DataService } from '../database/data.service';

@Injectable()
export class ImportService {

  constructor(
    private convertService: ConvertService,
    private dataService: DataService,
  ) { }

  public importProject(args: any): Promise<string> {
    const result = this.convertService.importProject(args);
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
