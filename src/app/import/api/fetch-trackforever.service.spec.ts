import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FetchTrackForeverService } from './fetch-trackforever.service';

describe('FetchTrackForeverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FetchTrackForeverService],
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', inject([FetchTrackForeverService], (service: FetchTrackForeverService) => {
    expect(service).toBeTruthy();
  }));
});
