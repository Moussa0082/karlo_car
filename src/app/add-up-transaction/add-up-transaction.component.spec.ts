import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpTransactionComponent } from './add-up-transaction.component';

describe('AddUpTransactionComponent', () => {
  let component: AddUpTransactionComponent;
  let fixture: ComponentFixture<AddUpTransactionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUpTransactionComponent]
    });
    fixture = TestBed.createComponent(AddUpTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
