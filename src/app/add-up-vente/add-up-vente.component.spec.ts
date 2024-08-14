import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpVenteComponent } from './add-up-vente.component';

describe('AddUpVenteComponent', () => {
  let component: AddUpVenteComponent;
  let fixture: ComponentFixture<AddUpVenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUpVenteComponent]
    });
    fixture = TestBed.createComponent(AddUpVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
