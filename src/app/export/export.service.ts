import { Injectable } from '@angular/core';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import * as FileSaver from 'file-saver';
import { ConvertTrackforeverService } from '../import/import-trackforever/convert-trackforever.service';

@Injectable()
export class ExportService {

  constructor() { }

  exportProject(project: TrackForeverProject): string {
    return ConvertTrackforeverService.toJson(project);
  }

  download(project: TrackForeverProject): void {
    const file = new File([this.exportProject(project)], `${project.name}.json`, {type: 'application/json'});
    FileSaver.saveAs(file);
  }
}
