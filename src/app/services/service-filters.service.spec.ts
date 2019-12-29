import { TestBed } from '@angular/core/testing';

import { ServiceFiltersService } from './service-filters.service';

describe('RegisterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiceFiltersService = TestBed.get(ServiceFiltersService);
    expect(service).toBeTruthy();
  });
});