import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PayeelistPage } from './payeelist.page';

describe('PayeelistPage', () => {
  let component: PayeelistPage;
  let fixture: ComponentFixture<PayeelistPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PayeelistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
