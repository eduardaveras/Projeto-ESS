import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricListComponent } from './historic-list.component';

describe('HistoricListComponent', () => {
  let component: HistoricListComponent;
  let fixture: ComponentFixture<HistoricListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoricListComponent]
    });
    fixture = TestBed.createComponent(HistoricListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
