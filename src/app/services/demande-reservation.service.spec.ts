import { TestBed } from '@angular/core/testing';

import { DemandeReservationService } from './demande-reservation.service';

describe('DemandeReservationService', () => {
  let service: DemandeReservationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemandeReservationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
