import { MarkdownPipe } from './markdown.pipe';

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

  it('should use gfm', () => {
    expect(pipe.transform('a@a.a'))
      .toEqual('<p><a href="mailto:a@a.a">a@a.a</a></p>\n');
  });
});
