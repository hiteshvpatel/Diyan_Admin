import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Admingeneralsettingcomponent } from './general-setting.component';

describe('Admingeneralsettingcomponent', () => {
    let component: Admingeneralsettingcomponent;
    let fixture: ComponentFixture<Admingeneralsettingcomponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [Admingeneralsettingcomponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(Admingeneralsettingcomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
