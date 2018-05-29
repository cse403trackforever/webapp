import { mockTrackforeverProject } from './../models/trackforever/mock/mock-trackforever-project';
import { TestBed, async } from '@angular/core/testing';
import { ConvertTrackforeverService } from './convert-trackforever.service';

describe('ConvertTrackforeverService', () => {
  let service: ConvertTrackforeverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConvertTrackforeverService
      ],
    });

    service = TestBed.get(ConvertTrackforeverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should import', async(() => {
    const json = ConvertTrackforeverService.toJson(mockTrackforeverProject);
    service.importProject(json)
      .subscribe(project => expect(project).toEqual(mockTrackforeverProject));
  }));

  it('should fail if in the wrong format', async(() => {
    expect(() => service.importProject('hello world!'))
      .toThrow(new Error('Incorrect file format. The file must be a Track Forever project json file.'));
  }));

  it('should fail if missing a comment field', async(() => {
    const json = ConvertTrackforeverService.toJson(mockTrackforeverProject);
    const s = json.replace('"content"', '"something-else"');

    expect(() => service.importProject(s))
      .toThrow(new Error('There are missing fields in the given object.'));
  }));

  it('should fail if missing an issue field', async(() => {
    const json = ConvertTrackforeverService.toJson(mockTrackforeverProject);
    const s = json.replace('"labels"', '"fables"');

    expect(() => service.importProject(s))
      .toThrow(new Error('There are missing fields in the given object.'));
  }));

  it('should fail if missing a project field', async(() => {
    const json = ConvertTrackforeverService.toJson(mockTrackforeverProject);
    const s = json.replace('"source"', '"???"');

    expect(() => service.importProject(s))
      .toThrow(new Error('There are missing fields in the given object.'));
  }));
});
