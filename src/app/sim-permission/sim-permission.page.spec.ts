import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimPermissionPage } from './sim-permission.page';

describe('SimPermissionPage', () => {
  let component: SimPermissionPage;
  let fixture: ComponentFixture<SimPermissionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SimPermissionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
