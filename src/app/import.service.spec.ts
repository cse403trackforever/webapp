import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ImportService } from './import.service';

describe('ImportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ImportService ],
      imports: [ HttpClientTestingModule ]
    });
  });

  it('should be created', inject([ImportService], (service: ImportService) => {
    expect(service).toBeTruthy();
  }));
});
