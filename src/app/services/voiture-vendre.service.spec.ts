import { TestBed } from '@angular/core/testing';

import { VoitureVendreService } from './voiture-vendre.service';

describe('VoitureVendreService', () => {
  let service: VoitureVendreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoitureVendreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
