import { Injectable } from '@angular/core';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import * as FileSaver from 'file-saver';
import { ConvertTrackforeverService } from '../import/import-trackforever/convert-trackforever.service';

/**
 * A service to handle exporting a project to a JSON string or file
 */
@Injectable()
export class ExportService {

  constructor() { }

  /**
   * Get a project's JSON string representation
   *
   * @param {TrackForeverProject} project the project to convert
   * @returns {string} the JSON string representation of the project
   */
  exportProject(project: TrackForeverProject): string {
    return ConvertTrackforeverService.toJson(project);
  }

  /**
   * Pop-up a window to download a project as a JSON file.
   *
   * @param {TrackForeverProject} project the project to download
   */
  download(project: TrackForeverProject): void {
    const file = new File([this.exportProject(project)], `${project.name}.json`, {type: 'application/json'});
    FileSaver.saveAs(file);
  }
}
