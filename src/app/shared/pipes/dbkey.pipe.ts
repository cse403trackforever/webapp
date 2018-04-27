import { Pipe, PipeTransform } from '@angular/core';
import { TrackForeverProject } from '../../import/models/trackforever/trackforever-project';

@Pipe({
  name: 'dbkey'
})
export class DbkeyPipe implements PipeTransform {

  transform(project: TrackForeverProject): string {
    return `${project.source}:${project.id}`;
  }

}
