import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTypeReservoirComponent } from './list-type-reservoir.component';

describe('ListTypeReservoirComponent', () => {
  let component: ListTypeReservoirComponent;
  let fixture: ComponentFixture<ListTypeReservoirComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListTypeReservoirComponent]
    });
    fixture = TestBed.createComponent(ListTypeReservoirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
