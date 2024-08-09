import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpVoitureVendreComponent } from './add-up-voiture-vendre.component';

describe('AddUpVoitureVendreComponent', () => {
  let component: AddUpVoitureVendreComponent;
  let fixture: ComponentFixture<AddUpVoitureVendreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUpVoitureVendreComponent]
    });
    fixture = TestBed.createComponent(AddUpVoitureVendreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
