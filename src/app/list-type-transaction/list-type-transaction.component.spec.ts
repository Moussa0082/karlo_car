import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTypeTransactionComponent } from './list-type-transaction.component';

describe('ListTypeTransactionComponent', () => {
  let component: ListTypeTransactionComponent;
  let fixture: ComponentFixture<ListTypeTransactionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListTypeTransactionComponent]
    });
    fixture = TestBed.createComponent(ListTypeTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
