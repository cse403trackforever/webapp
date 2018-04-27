import { TestBed, inject } from '@angular/core/testing';

import { ConvertService } from './convert.service';

describe('ConvertService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConvertService]
    });
  });

  it('should be created', inject([ConvertService], (service: ConvertService) => {
    expect(service).toBeTruthy();
  }));
});
