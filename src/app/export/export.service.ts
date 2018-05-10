import { Injectable } from '@angular/core';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import * as FileSaver from 'file-saver';

@Injectable()
export class ExportService {

  constructor() { }

  exportProject(project: TrackForeverProject): string {
    return JSON.stringify(project, (key, val) => {
      if (key === 'issues') {
        return Array.from(val);
      } else {
        return val;
      }
    });
  }

  download(project: TrackForeverProject): void {
    const file = new File([this.exportProject(project)], `${project.name}.json`, {type: 'application/json'});
    FileSaver.saveAs(file);
  }
}
