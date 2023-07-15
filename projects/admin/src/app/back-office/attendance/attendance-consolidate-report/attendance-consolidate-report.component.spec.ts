import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceConsolidateReportComponent } from './attendance-consolidate-report.component';

describe('AttendanceConsolidateReportComponent', () => {
  let component: AttendanceConsolidateReportComponent;
  let fixture: ComponentFixture<AttendanceConsolidateReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceConsolidateReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceConsolidateReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
