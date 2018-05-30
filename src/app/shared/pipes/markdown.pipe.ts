import { Pipe, PipeTransform } from '@angular/core';
import * as marked from 'marked';
import { ImportSource } from '../../import/models/import-source';

@Pipe({
  name: 'markdown'
})
export class MarkdownPipe implements PipeTransform {
  transform(markdown: string, options?: MarkdownPipeOptions): string {
    if (markdown == null) {
      return '';
    }

    return marked(markdown, options ? options.markedOptions : null);
  }
}

export interface MarkdownPipeOptions {
  markedOptions?: marked.MarkedOptions;
  source?: ImportSource;
}
