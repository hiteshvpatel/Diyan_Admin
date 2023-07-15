import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginnavbarComponent } from './login-navbar.component';

describe('LoginnavbarComponent', () => {
    let component: LoginnavbarComponent;
    let fixture: ComponentFixture<LoginnavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [LoginnavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(LoginnavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
