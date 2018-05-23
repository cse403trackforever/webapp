import { Injectable } from '@angular/core';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import * as FileSaver from 'file-saver';
import { ImportTrackForeverService } from '../import/import-trackforever/import-trackforever.service';

@Injectable()
export class ExportService {

  constructor() { }

  exportProject(project: TrackForeverProject): string {
    return ImportTrackForeverService.toJson(project);
  }

  download(project: TrackForeverProject): void {
    const file = new File([this.exportProject(project)], `${project.name}.json`, {type: 'application/json'});
    FileSaver.saveAs(file);
  }
}
