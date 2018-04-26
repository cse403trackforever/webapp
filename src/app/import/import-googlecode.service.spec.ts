import { TestBed, inject } from '@angular/core/testing';

import { FetchGoogleCodeService } from './api/fetch-googlecode.service';
import { ImportGoogleCodeService } from './import-googlecode.service';

describe('ImportGoogleCodeService', () => {
  let fetchServiceStub: Partial<FetchGoogleCodeService>;

  beforeEach(() => {
    // TODO implement
    fetchServiceStub = { };

    TestBed.configureTestingModule({
      providers: [
        ImportGoogleCodeService,
        {
          provide: FetchGoogleCodeService,
          useValue: fetchServiceStub
        }
      ],
    });
  });

  it('should be created', inject([ImportGoogleCodeService], (service: ImportGoogleCodeService) => {
    expect(service).toBeTruthy();
  }));
});
