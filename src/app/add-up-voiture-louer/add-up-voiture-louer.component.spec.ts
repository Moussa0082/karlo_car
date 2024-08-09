import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpVoitureLouerComponent } from './add-up-voiture-louer.component';

describe('AddUpVoitureLouerComponent', () => {
  let component: AddUpVoitureLouerComponent;
  let fixture: ComponentFixture<AddUpVoitureLouerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUpVoitureLouerComponent]
    });
    fixture = TestBed.createComponent(AddUpVoitureLouerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
