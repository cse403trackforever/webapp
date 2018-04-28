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
    let result = null;
    try {
      result = this.convertService.importProject(args);
    } catch (e) {
      // Return a reject with the error message
      return Promise.reject(e.message);
    }
    return result.toPromise()
    .then(project => this.dataService.addProject(project));
  }

}
