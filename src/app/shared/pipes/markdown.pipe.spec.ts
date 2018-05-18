import { MarkdownPipe } from './markdown.pipe';
import { ImportSource } from '../../import/models/import-source';

describe('MarkdownPipe', () => {
  let pipe: MarkdownPipe;

  beforeEach(() => {
    pipe = new MarkdownPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null', () => {
    expect(pipe.transform(null)).toEqual('');
  });

  it('should compile markdown', () => {
    expect(pipe.transform('*wow*')).toEqual('<p><em>wow</em></p>\n');
  });

  it('should not interpret Google Code as markdown', () => {
    expect(pipe.transform('*wow*', {source: ImportSource.GoogleCode})).toEqual('*wow*');
  });

  it('should always interpret as markdown if forced', () => {
    expect(pipe.transform('*wow*', {source: ImportSource.GoogleCode, force: true}))
      .toEqual('<p><em>wow</em></p>\n');
  });
});
