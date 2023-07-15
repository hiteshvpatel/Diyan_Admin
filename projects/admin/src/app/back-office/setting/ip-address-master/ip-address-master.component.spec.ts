import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IpAddressMasterComponent } from './ip-address-master.component';

describe('IpAddressMasterComponent', () => {
  let component: IpAddressMasterComponent;
  let fixture: ComponentFixture<IpAddressMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IpAddressMasterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IpAddressMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
