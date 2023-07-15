import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserwisemenuComponent } from './user-wise-menu.component';

describe('UserwisemenuComponent', () => {
    let component: UserwisemenuComponent;
    let fixture: ComponentFixture<UserwisemenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [UserwisemenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(UserwisemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
