import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpTypeVoitureComponent } from './add-up-type-voiture.component';

describe('AddUpTypeVoitureComponent', () => {
  let component: AddUpTypeVoitureComponent;
  let fixture: ComponentFixture<AddUpTypeVoitureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUpTypeVoitureComponent]
    });
    fixture = TestBed.createComponent(AddUpTypeVoitureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
