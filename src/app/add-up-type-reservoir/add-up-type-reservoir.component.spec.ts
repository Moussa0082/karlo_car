import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpTypeReservoirComponent } from './add-up-type-reservoir.component';

describe('AddUpTypeReservoirComponent', () => {
  let component: AddUpTypeReservoirComponent;
  let fixture: ComponentFixture<AddUpTypeReservoirComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUpTypeReservoirComponent]
    });
    fixture = TestBed.createComponent(AddUpTypeReservoirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
