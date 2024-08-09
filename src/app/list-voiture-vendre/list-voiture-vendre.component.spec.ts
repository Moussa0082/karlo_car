import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVoitureVendreComponent } from './list-voiture-vendre.component';

describe('ListVoitureVendreComponent', () => {
  let component: ListVoitureVendreComponent;
  let fixture: ComponentFixture<ListVoitureVendreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListVoitureVendreComponent]
    });
    fixture = TestBed.createComponent(ListVoitureVendreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
