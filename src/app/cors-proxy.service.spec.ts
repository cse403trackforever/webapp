import { TestBed, inject } from '@angular/core/testing';

import { CorsProxyService } from './cors-proxy.service';

describe('CorsProxyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CorsProxyService]
    });
  });

  it('should be created', inject([CorsProxyService], (service: CorsProxyService) => {
    expect(service).toBeTruthy();
  }));
});
