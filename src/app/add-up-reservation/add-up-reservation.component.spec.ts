import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpReservationComponent } from './add-up-reservation.component';

describe('AddUpReservationComponent', () => {
  let component: AddUpReservationComponent;
  let fixture: ComponentFixture<AddUpReservationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUpReservationComponent]
    });
    fixture = TestBed.createComponent(AddUpReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
