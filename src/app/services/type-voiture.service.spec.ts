import { TestBed } from '@angular/core/testing';

import { TypeVoitureService } from './type-voiture.service';

describe('TypeVoitureService', () => {
  let service: TypeVoitureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeVoitureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
