import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTypeVoitureComponent } from './list-type-voiture.component';

describe('ListTypeVoitureComponent', () => {
  let component: ListTypeVoitureComponent;
  let fixture: ComponentFixture<ListTypeVoitureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListTypeVoitureComponent]
    });
    fixture = TestBed.createComponent(ListTypeVoitureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
