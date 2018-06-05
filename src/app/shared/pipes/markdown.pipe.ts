import { Pipe, PipeTransform } from '@angular/core';
import * as marked from 'marked';
import { ImportSource } from '../../import/models/import-source';

/**
 * A pipe to render a string as markdown and conditionally apply markdown rules based on the import source
 */
@Pipe({
  name: 'markdown'
})
export class MarkdownPipe implements PipeTransform {
  /**
   * Transform a string with markdown syntax into HTML
   *
   * @param {string} markdown a string with markdown syntax
   * @param {MarkdownPipeOptions} options options to change the source or configure markdown rules
   * @returns {string} HTML to render the string as markdown
   */
  transform(markdown: string, options?: MarkdownPipeOptions): string {
    if (markdown == null) {
      return '';
    }

    return marked(markdown, options ? options.markedOptions : null);
  }
}

/**
 * Options to the transform
 */
export interface MarkdownPipeOptions {
  /**
   * Options to be fed into the marked library
   */
  markedOptions?: marked.MarkedOptions;

  /**
   * The source of the project or issue. This may change markedOptions to more accurately render the project or issue content or disable
   * markdown entirely.
   */
  source?: ImportSource;
}
