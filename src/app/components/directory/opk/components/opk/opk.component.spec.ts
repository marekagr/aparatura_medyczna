import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpkComponent } from './opk.component';

describe('OpkComponent', () => {
  let component: OpkComponent;
  let fixture: ComponentFixture<OpkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
