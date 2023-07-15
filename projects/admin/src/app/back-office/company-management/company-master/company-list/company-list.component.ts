import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AdminLayoutService } from '../../../../layouts/admin-layout/admin-layout.service';
import { CommonService } from '../../../../shared/common.service';
import { environment } from '../../../../../environments/environment';
import { StorageService, StorageKey } from '../../../../shared/storage.service';
import { CoreHelperService } from '../../../../Providers/core-helper/core-helper.service';
declare const $: any;
import * as moment from 'moment';
import { NgSelectConfig } from '@ng-select/ng-select';
import { parse } from 'path';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CompanyManagementService } from '../../company-management.service';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {
  allEmployeeCompanyList: any[] = [];
  employeeCompanyList: any[] = [];
  l: number;
  p: number = 1;
  itemsPage: any;
  mySelect;
  noData;
  searchTerm: any;
  isView: Boolean;
  isCreated: Boolean;
  isUpdated: Boolean;
  isDeleted: Boolean;

  constructor(private http: HttpClient, private fb: FormBuilder, public companyManagementService: CompanyManagementService, public storageService: StorageService, private coreHelper: CoreHelperService, private route: ActivatedRoute, private router: Router, public commonService: CommonService, public adminLayoutService: AdminLayoutService) {
    let pagePermission = { module: "companylist" }
    this.adminLayoutService.getpagePermission(pagePermission).subscribe((Response: any) => {

      if (Response.meta.code == 200) {

        this.isView = Response.data.isView;
        this.isCreated = Response.data.isCreated;
        this.isUpdated = Response.data.isUpdated;
        this.isDeleted = Response.data.isDeleted;
        if (this.isView === false) {
          this.router.navigate(['admin/dashboard']);
        }

      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }

  ngOnInit() {
    this.getCompanyInformationDetailsList();
    this.mySelect = 5;
    this.l = 5;
  }

  itemsPerPage(): void {
    this.l = this.mySelect;
  }

  getCompanyInformationDetailsList() {
    this.companyManagementService.getCompanyDetailsList().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allEmployeeCompanyList = Response.data;
        this.employeeCompanyList = this.allEmployeeCompanyList;
        this.sortingList({ active: 'companyName', direction: 'asc' });
      }
      else {
        this.employeeCompanyList = [];
      }
    });
  }

  search(value: any): void {
    this.employeeCompanyList = this.allEmployeeCompanyList.filter((val: any) => JSON.stringify(val).toLowerCase().includes(value.toLowerCase()));
    this.p = 1;
    if (this.employeeCompanyList.length == 0) {
      this.noData = true;
    } else {
      this.noData = false;
    }
  }

  statusCompanymaster(paramsObj) {


    let statusCompanyObj = {
      "_id": paramsObj.id,
      "status": paramsObj.status
    };


    this.companyManagementService.StatusCompanyMaster(statusCompanyObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.getCompanyInformationDetailsList();
        this.commonService.notifier.notify('success', Response.meta.message);
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  sortingList(sort: Sort) {

    const data = this.allEmployeeCompanyList.slice();
    if (!sort.active || sort.direction === '') {
      this.employeeCompanyList = data;
      return;
    }



    this.employeeCompanyList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      switch (sort.active) {
        case 'companyName': return compare(a.companyName, b.companyName, isAsc);
        case 'companyEmail': return compare(a.companyEmail, b.companyEmail, isAsc);
        case 'companyMobile': return compare(a.companyMobile, b.companyMobile, isAsc);
        case 'companyTelephone': return compare(a.companyTelephone, b.companyTelephone, isAsc);
        case 'companyWebsite': return compare(a.companyWebsite, b.companyWebsite, isAsc);
        default: return 0;
      }
    });
  }

}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
