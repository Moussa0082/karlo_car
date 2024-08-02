import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpRoleComponent } from './add-up-role.component';

describe('AddUpRoleComponent', () => {
  let component: AddUpRoleComponent;
  let fixture: ComponentFixture<AddUpRoleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUpRoleComponent]
    });
    fixture = TestBed.createComponent(AddUpRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
