import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddbankPage } from './addbank.page';

describe('AddbankPage', () => {
  let component: AddbankPage;
  let fixture: ComponentFixture<AddbankPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddbankPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
