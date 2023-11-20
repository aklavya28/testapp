import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransferHistoryPage } from './transfer-history.page';

describe('TransferHistoryPage', () => {
  let component: TransferHistoryPage;
  let fixture: ComponentFixture<TransferHistoryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TransferHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
