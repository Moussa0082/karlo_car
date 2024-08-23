import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailVoitureComponent } from './detail-voiture.component';

describe('DetailVoitureComponent', () => {
  let component: DetailVoitureComponent;
  let fixture: ComponentFixture<DetailVoitureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailVoitureComponent]
    });
    fixture = TestBed.createComponent(DetailVoitureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
