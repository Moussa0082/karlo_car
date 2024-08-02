import { TestBed } from '@angular/core/testing';

import { ReservoirService } from './reservoir.service';

describe('ReservoirService', () => {
  let service: ReservoirService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservoirService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
