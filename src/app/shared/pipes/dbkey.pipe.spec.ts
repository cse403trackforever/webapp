import { DbkeyPipe } from './dbkey.pipe';
import { mockTrackforeverProject } from '../../import/models/trackforever/mock/mock-trackforever-project';

describe('DbkeyPipe', () => {
  it('create an instance', () => {
    const pipe = new DbkeyPipe();
    expect(pipe).toBeTruthy();
  });

  it('should transform', () => {
    const pipe = new DbkeyPipe();
    expect(pipe.transform(mockTrackforeverProject)).toBe('Google Code:my-project');
  });
});
