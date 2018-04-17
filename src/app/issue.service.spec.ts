import { TestBed, inject } from '@angular/core/testing';

import { IssueService } from './issue.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('IssueService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IssueService],
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', inject([IssueService], (service: IssueService) => {
    expect(service).toBeTruthy();
  }));
});
