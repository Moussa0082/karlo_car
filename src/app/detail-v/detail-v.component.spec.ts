import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailVComponent } from './detail-v.component';

describe('DetailVComponent', () => {
  let component: DetailVComponent;
  let fixture: ComponentFixture<DetailVComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailVComponent]
    });
    fixture = TestBed.createComponent(DetailVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
