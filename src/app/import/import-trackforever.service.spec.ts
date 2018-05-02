import { TestBed, inject } from '@angular/core/testing';
import { ImportTrackForeverService } from './import-trackforever.service';

describe('ImportTrackForeverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ImportTrackForeverService
      ],
    });
  });

  it('should be created', inject([ImportTrackForeverService], (service: ImportTrackForeverService) => {
    expect(service).toBeTruthy();
  }));
});
