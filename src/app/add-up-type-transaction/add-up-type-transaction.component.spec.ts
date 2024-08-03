import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpTypeTransactionComponent } from './add-up-type-transaction.component';

describe('AddUpTypeTransactionComponent', () => {
  let component: AddUpTypeTransactionComponent;
  let fixture: ComponentFixture<AddUpTypeTransactionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUpTypeTransactionComponent]
    });
    fixture = TestBed.createComponent(AddUpTypeTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
