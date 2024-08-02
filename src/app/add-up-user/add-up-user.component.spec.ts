import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpUserComponent } from './add-up-user.component';

describe('AddUpUserComponent', () => {
  let component: AddUpUserComponent;
  let fixture: ComponentFixture<AddUpUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUpUserComponent]
    });
    fixture = TestBed.createComponent(AddUpUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
