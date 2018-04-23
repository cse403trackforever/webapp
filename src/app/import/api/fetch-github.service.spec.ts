import { TestBed, inject } from '@angular/core/testing';

import { FetchGithubService } from './fetch-github.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FetchGithubService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FetchGithubService],
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', inject([FetchGithubService], (service: FetchGithubService) => {
    expect(service).toBeTruthy();
  }));
});
