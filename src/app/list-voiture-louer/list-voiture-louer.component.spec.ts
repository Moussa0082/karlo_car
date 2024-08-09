import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVoitureLouerComponent } from './list-voiture-louer.component';

describe('ListVoitureLouerComponent', () => {
  let component: ListVoitureLouerComponent;
  let fixture: ComponentFixture<ListVoitureLouerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListVoitureLouerComponent]
    });
    fixture = TestBed.createComponent(ListVoitureLouerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
