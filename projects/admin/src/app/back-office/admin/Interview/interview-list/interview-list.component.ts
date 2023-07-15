import { Component, OnInit } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import * as Chartist from 'chartist';
import { NgxSpinnerService } from "ngx-spinner";
import { Sort } from '@angular/material/sort';
import { CommonService } from '../../../../../../src/app/shared/common.service';
import { StorageService } from '../../../../../../src/app/shared/storage.service';
import { AdminLayoutService } from '../../../../../../src/app/layouts/admin-layout/admin-layout.service';

declare const $: any;

@Component({
  selector: 'app-interview-list',
  templateUrl: './interview-list.component.html',
  styleUrls: ['./interview-list.component.css']
})
export class InterviewListComponent implements OnInit {

  l: number;
  p: number = 1;
  itemsPage: any;
  noData;
  mySelect;
  isView: boolean;
  isCreated: boolean;
  isUpdated: boolean;
  isDeleted: boolean;

  interviewList: any[] = [];
  allinterviewMasterList: any[] = [];
  interviewMasterList: any[] = [];
  interviewListlength: any;


  constructor(public commonService: CommonService, public storageService: StorageService, public adminLayoutService: AdminLayoutService, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private spinner: NgxSpinnerService) {
    let pagePermission = { module: "interview" }
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

  ngOnInit(): void {
    this.noData = false;
    this.mySelect = 5;
    this.l = 10;
    this.getInterviewList();
  }

  getInterviewList() {

    this.adminLayoutService.getInterviewDetailsList().subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.interviewMasterList = Response.data;
        this.interviewList = this.interviewMasterList
        this.allinterviewMasterList = this.interviewList
        this.interviewList = this.interviewMasterList.slice();
        this.interviewListlength = Response.data.length;
        this.sortingList({ active: 'firstName', direction: 'asc' });
        this.noData = false;
      } else {
        this.noData = true;
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }

  itemsPerPage(): void {
    this.l = this.mySelect;
  }

  search(value: string): void {
    this.interviewList = this.allinterviewMasterList.filter((val: any) => val.firstName.toLowerCase().includes(value.toLowerCase()));
    this.p = 1;
    if (this.interviewList.length == 0) {
      this.noData = true;
    } else {
      this.noData = false;
    }
  }

  statusInterview(paramsObj) {

    let statusdesignationmasterModelObj = {
      "_id": paramsObj.id,
      "status": paramsObj.status
    };


    this.adminLayoutService.StatusInterview(statusdesignationmasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.getInterviewList();
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

    const data = this.allinterviewMasterList.slice();
    if (!sort.active || sort.direction === '') {
      this.interviewList = data;
      return;
    }

    this.interviewList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      switch (sort.active) {
        case 'userName': return compare(a.userName, b.userName, isAsc);
        case 'p_Email': return compare(a.p_Email, b.p_Email, isAsc);
        case 'p_Mobile': return compare(a.p_Mobile, b.p_Mobile, isAsc);
        case 'designationName': return compare(a.designationName, b.designationName, isAsc);
        case 'stage': return compare(a.stage, b.stage, isAsc);
        default: return 0;
      }
    });
  }

}



function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}