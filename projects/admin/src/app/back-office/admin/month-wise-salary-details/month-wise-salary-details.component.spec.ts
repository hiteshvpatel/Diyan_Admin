import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthWiseSalaryDetailsComponent } from './month-wise-salary-details.component';

describe('MonthWiseSalaryDetailsComponent', () => {
  let component: MonthWiseSalaryDetailsComponent;
  let fixture: ComponentFixture<MonthWiseSalaryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthWiseSalaryDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthWiseSalaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
