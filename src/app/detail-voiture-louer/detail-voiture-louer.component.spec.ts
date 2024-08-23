import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailVoitureLouerComponent } from './detail-voiture-louer.component';

describe('DetailVoitureLouerComponent', () => {
  let component: DetailVoitureLouerComponent;
  let fixture: ComponentFixture<DetailVoitureLouerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailVoitureLouerComponent]
    });
    fixture = TestBed.createComponent(DetailVoitureLouerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
