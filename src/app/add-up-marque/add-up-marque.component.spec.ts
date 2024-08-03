import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpMarqueComponent } from './add-up-marque.component';

describe('AddUpMarqueComponent', () => {
  let component: AddUpMarqueComponent;
  let fixture: ComponentFixture<AddUpMarqueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUpMarqueComponent]
    });
    fixture = TestBed.createComponent(AddUpMarqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
