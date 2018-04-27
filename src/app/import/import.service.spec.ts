import { TestBed, inject } from '@angular/core/testing';

import { ImportService } from './import.service';
import { ConvertService } from './convert.service';
import { Observable } from 'rxjs/Observable';
import { TrackForeverProject } from './models/trackforever/trackforever-project';
import { mockTrackforeverProject } from './models/trackforever/mock/mock-trackforever-project';
import { DataService } from '../database/data.service';

describe('ImportService', () => {
  let convertServiceStub: Partial<ConvertService>;
  let dataServiceStub: Partial<DataService>;

  beforeEach(() => {
    convertServiceStub = {
      importProject(args: any): Observable<TrackForeverProject> {
        return Observable.of(mockTrackforeverProject);
      }
    };

    dataServiceStub = {
      addProject(project: TrackForeverProject): Promise<string> {
        return new Promise(() => '123');
      }
    };

    TestBed.configureTestingModule({
      providers: [
        ImportService,
        {
          provide: ConvertService,
          useValue: convertServiceStub
        },
        {
          provide: DataService,
          useValue: dataServiceStub
        },
      ]
    });
  });

  it('should be created', inject([ImportService], (service: ImportService) => {
    expect(service).toBeTruthy();
  }));
});
