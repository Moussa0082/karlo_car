import { TestBed } from '@angular/core/testing';

import { VoitureLouerService } from './voiture-louer.service';

describe('VoitureLouerService', () => {
  let service: VoitureLouerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoitureLouerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
