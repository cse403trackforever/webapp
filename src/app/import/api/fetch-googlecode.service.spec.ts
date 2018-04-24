import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FetchGoogleCodeService } from './fetch-googlecode.service';

describe('FetchGithubService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FetchGoogleCodeService],
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', inject([FetchGoogleCodeService], (service: FetchGoogleCodeService) => {
    expect(service).toBeTruthy();
  }));
});
