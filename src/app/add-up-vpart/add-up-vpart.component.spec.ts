import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpVPartComponent } from './add-up-vpart.component';

describe('AddUpVPartComponent', () => {
  let component: AddUpVPartComponent;
  let fixture: ComponentFixture<AddUpVPartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUpVPartComponent]
    });
    fixture = TestBed.createComponent(AddUpVPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
