import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenumasterComponent } from './menu-master.component';

describe('MenumasterComponent', () => {
    let component: MenumasterComponent;
    let fixture: ComponentFixture<MenumasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [MenumasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(MenumasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
