import { TestBed } from '@angular/core/testing';

import { ExportService } from './export.service';
import { TrackForeverProject } from '../import/models/trackforever/trackforever-project';
import { mockTrackforeverProject } from '../import/models/trackforever/mock/mock-trackforever-project';
import * as FileSaver from 'file-saver';
import Spy = jasmine.Spy;

describe('ExportService', () => {
  let service: ExportService;
  let fileSaverSpy: Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExportService]
    });

    service = TestBed.get(ExportService);
    fileSaverSpy = spyOn(FileSaver, 'saveAs');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should export', () => {
    const p: TrackForeverProject = mockTrackforeverProject;
    const s = service.exportProject(p);
    expect(s).toEqual(JSON.stringify(p, (key, val) => {
      if (key === 'issues') {
        return Array.from(val);
      } else {
        return val;
      }
    }));
  });

  it('should download', () => {
    const p: TrackForeverProject = mockTrackforeverProject;

    fileSaverSpy.and.callFake(() => {});

    service.download(p);

    expect(fileSaverSpy.calls.count()).toEqual(1);
    const file: File = fileSaverSpy.calls.mostRecent().args[0];
    expect(file.name).toEqual(`${p.name}.json`);
    expect(file.type).toEqual('application/json');
  });
});
