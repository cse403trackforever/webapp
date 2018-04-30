import { TestBed, inject } from '@angular/core/testing';

import { FetchRedmineService } from './api/fetch-redmine.service';
import { ImportRedmineService } from './import-redmine.service';

describe('ImportRedmineService', () => {
  let fetchServiceStub: Partial<FetchRedmineService>;

  beforeEach(() => {
    // TODO implement
    fetchServiceStub = { };

    TestBed.configureTestingModule({
      providers: [
        ImportRedmineService,
        {
          provide: FetchRedmineService,
          useValue: fetchServiceStub
        }
      ],
    });
  });

  it('should be created', inject([ImportRedmineService], (service: ImportRedmineService) => {
    expect(service).toBeTruthy();
  }));
});
