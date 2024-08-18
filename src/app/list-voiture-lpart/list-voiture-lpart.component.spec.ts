import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVoitureLPartComponent } from './list-voiture-lpart.component';

describe('ListVoitureLPartComponent', () => {
  let component: ListVoitureLPartComponent;
  let fixture: ComponentFixture<ListVoitureLPartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListVoitureLPartComponent]
    });
    fixture = TestBed.createComponent(ListVoitureLPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
