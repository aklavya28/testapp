import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboadPage } from './dashboad.page';

describe('DashboadPage', () => {
  let component: DashboadPage;
  let fixture: ComponentFixture<DashboadPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DashboadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
