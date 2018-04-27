import { TestBed, inject } from '@angular/core/testing';

import { DataService } from './data.service';
import { DbkeyPipe } from '../shared/pipes/dbkey.pipe';

describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataService, DbkeyPipe]
    });
  });

  it('should be created', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
  }));
});
