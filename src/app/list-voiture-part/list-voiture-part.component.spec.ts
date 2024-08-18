import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVoiturePartComponent } from './list-voiture-part.component';

describe('ListVoiturePartComponent', () => {
  let component: ListVoiturePartComponent;
  let fixture: ComponentFixture<ListVoiturePartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListVoiturePartComponent]
    });
    fixture = TestBed.createComponent(ListVoiturePartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
