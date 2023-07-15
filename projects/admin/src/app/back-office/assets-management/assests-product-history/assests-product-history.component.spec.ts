import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssestsProductHistoryComponent } from './assests-product-history.component';

describe('AssestsProductHistoryComponent', () => {
  let component: AssestsProductHistoryComponent;
  let fixture: ComponentFixture<AssestsProductHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssestsProductHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssestsProductHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
