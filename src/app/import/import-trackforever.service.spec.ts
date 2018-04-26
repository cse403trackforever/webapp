import { TestBed, inject } from '@angular/core/testing';
import { ImportTrackForeverService } from './import-trackforever.service';
import { FetchTrackForeverService } from './api/fetch-trackforever.service';

describe('ImportTrackForeverService', () => {
  let fetchServiceStub: Partial<FetchTrackForeverService>;

  beforeEach(() => {
    // TODO implement
    fetchServiceStub = { };

    TestBed.configureTestingModule({
      providers: [
        ImportTrackForeverService,
        {
          provide: FetchTrackForeverService,
          useValue: fetchServiceStub
        }
      ],
    });
  });

  it('should be created', inject([ImportTrackForeverService], (service: ImportTrackForeverService) => {
    expect(service).toBeTruthy();
  }));
});
