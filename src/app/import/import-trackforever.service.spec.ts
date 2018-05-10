import { TestBed, async } from '@angular/core/testing';
import { ImportTrackForeverService } from './import-trackforever.service';
import { mockTrackforeverProject } from './models/trackforever/mock/mock-trackforever-project';

describe('ImportTrackForeverService', () => {
  let service: ImportTrackForeverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ImportTrackForeverService
      ],
    });

    service = TestBed.get(ImportTrackForeverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should import', async(() => {
    const p = <any> mockTrackforeverProject;
    const json = JSON.stringify(p, (key, val) => {
      if (key === 'issues') {
        return Array.from(val);
      } else {
        return val;
      }
    });
    service.importProject(json)
      .subscribe(project => expect(project).toEqual(mockTrackforeverProject));
  }));

  it('should fail if in the wrong format', async(() => {
    expect(() => service.importProject('hello world!'))
      .toThrow(new Error('Incorrect file format. The file must be a Track Forever project json file.'));
  }));

  it('should fail if missing a comment field', async(() => {
    const p = <any> mockTrackforeverProject;
    const json = JSON.stringify(p, (key, val) => {
      if (key === 'issues') {
        return Array.from(val);
      } else {
        return val;
      }
    });
    const s = json.replace('"content"', '"something-else"');

    expect(() => service.importProject(s))
      .toThrow(new Error('There are missing fields in the given object.'));
  }));

  it('should fail if missing an issue field', async(() => {
    const p = <any> mockTrackforeverProject;
    const json = JSON.stringify(p, (key, val) => {
      if (key === 'issues') {
        return Array.from(val);
      } else {
        return val;
      }
    });
    const s = json.replace('"labels"', '"fables"');

    expect(() => service.importProject(s))
      .toThrow(new Error('There are missing fields in the given object.'));
  }));

  it('should fail if missing a project field', async(() => {
    const p = <any> mockTrackforeverProject;
    const json = JSON.stringify(p, (key, val) => {
      if (key === 'issues') {
        return Array.from(val);
      } else {
        return val;
      }
    });
    const s = json.replace('"source"', '"???"');

    expect(() => service.importProject(s))
      .toThrow(new Error('There are missing fields in the given object.'));
  }));
});
