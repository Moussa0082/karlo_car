import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDemandeReservationComponent } from './list-demande-reservation.component';

describe('ListDemandeReservationComponent', () => {
  let component: ListDemandeReservationComponent;
  let fixture: ComponentFixture<ListDemandeReservationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListDemandeReservationComponent]
    });
    fixture = TestBed.createComponent(ListDemandeReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
