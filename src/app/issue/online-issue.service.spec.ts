import { TestBed, inject } from '@angular/core/testing';

import { OnlineIssueService } from './online-issue.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OnlineIssueService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OnlineIssueService],
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', inject([OnlineIssueService], (service: OnlineIssueService) => {
    expect(service).toBeTruthy();
  }));
});
