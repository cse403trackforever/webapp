import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FetchRedmineService } from './fetch-redmine.service';

describe('FetchRedmineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FetchRedmineService],
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', inject([FetchRedmineService], (service: FetchRedmineService) => {
    expect(service).toBeTruthy();
  }));
});
