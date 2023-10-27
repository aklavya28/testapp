import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RxjsPage } from './rxjs.page';

describe('RxjsPage', () => {
  let component: RxjsPage;
  let fixture: ComponentFixture<RxjsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RxjsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
