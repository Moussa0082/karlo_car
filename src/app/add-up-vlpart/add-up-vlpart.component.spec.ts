import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpVLPartComponent } from './add-up-vlpart.component';

describe('AddUpVLPartComponent', () => {
  let component: AddUpVLPartComponent;
  let fixture: ComponentFixture<AddUpVLPartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUpVLPartComponent]
    });
    fixture = TestBed.createComponent(AddUpVLPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
