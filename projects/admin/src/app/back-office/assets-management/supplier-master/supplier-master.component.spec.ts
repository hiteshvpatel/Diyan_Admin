/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SupplierMasterComponent } from './supplier-master.component';

describe('SupplierMasterComponent', () => {
  let component: SupplierMasterComponent;
  let fixture: ComponentFixture<SupplierMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
