import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowBtnComponent } from './follow-btn.component';

describe('FollowBtnComponent', () => {
  let component: FollowBtnComponent;
  let fixture: ComponentFixture<FollowBtnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FollowBtnComponent]
    });
    fixture = TestBed.createComponent(FollowBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
