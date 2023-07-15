import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolewisemenuComponent } from './role-wise-menu.component';

describe('RolewisemenuComponent', () => {
    let component: RolewisemenuComponent;
    let fixture: ComponentFixture<RolewisemenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [RolewisemenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(RolewisemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
