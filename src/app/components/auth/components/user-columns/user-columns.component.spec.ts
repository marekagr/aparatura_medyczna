import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserColumnsComponent } from './user-columns.component';

describe('UserColumnsComponent', () => {
  let component: UserColumnsComponent;
  let fixture: ComponentFixture<UserColumnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserColumnsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
