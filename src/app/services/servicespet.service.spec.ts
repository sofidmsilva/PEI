import { TestBed } from '@angular/core/testing';

import { ServicespetService } from './servicespet.service';

describe('ServicespetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServicespetService = TestBed.get(ServicespetService);
    expect(service).toBeTruthy();
  });
});
