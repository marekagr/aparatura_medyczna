import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutscomponentsmainmainComponent } from './layoutscomponentsmainmain.component';

describe('LayoutscomponentsmainmainComponent', () => {
  let component: LayoutscomponentsmainmainComponent;
  let fixture: ComponentFixture<LayoutscomponentsmainmainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayoutscomponentsmainmainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutscomponentsmainmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
