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
    return this.convertService.importProject(args)
      .toPromise()
      .then(project => this.dataService.addProject(project));
  }

}
