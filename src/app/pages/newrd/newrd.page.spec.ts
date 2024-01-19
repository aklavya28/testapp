import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewrdPage } from './newrd.page';

describe('NewrdPage', () => {
  let component: NewrdPage;
  let fixture: ComponentFixture<NewrdPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NewrdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
