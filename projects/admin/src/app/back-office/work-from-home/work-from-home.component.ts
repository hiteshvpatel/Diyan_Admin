import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminLayoutService } from '../../layouts/admin-layout/admin-layout.service';
import { CommonService } from '../../shared/common.service';
import { StorageService } from '../../shared/storage.service';
declare const $: any;

@Component({
  selector: 'app-work-from-home',
  templateUrl: './work-from-home.component.html',
  styleUrls: ['./work-from-home.component.css']
})
export class WorkFromHomeComponent implements OnInit {


  monthArray = [
    { value: 1, month: 'January' },
    { value: 2, month: 'February' },
    { value: 3, month: 'March' },
    { value: 4, month: 'April' },
    { value: 5, month: 'May' },
    { value: 6, month: 'June' },
    { value: 7, month: 'July' },
    { value: 8, month: 'August' },
    { value: 9, month: 'September' },
    { value: 10, month: 'October' },
    { value: 11, month: 'November' },
    { value: 12, month: 'December' },
  ];
  yearArray: any[] = [];
  workFromHomeList: any[] = [];
  allWorkFromHomeList: any[] = [];
  WorkFromHomeList: any[] = [];
  month = new Date().getMonth() + 1;
  year = new Date().getFullYear()
  l: number;
  p: number = 1;
  itemsPage: any;
  mySelect;
  noData;
  isView: boolean;
  isCreated: boolean;
  isUpdated: boolean;
  isDeleted: boolean;
  remark = '';
  approveRejectedByName = '';
  submittedWFHRemark: boolean = false
  cancleWFHID: any;
  searchTerm = '';
  wfhTypeStatus = null;
  wfhStatusType = [
    { name: "All", value: 0 },
    { name: "Pending", value: 1 },
    { name: "Approved", value: 2 },
    { name: "Rejected", value: 3 },
    { name: "Cancled", value: 4 }
  ]


  constructor(public commonService: CommonService, public storageService: StorageService, public adminLayoutService: AdminLayoutService, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private spinner: NgxSpinnerService) {
    let pagePermission = { module: "workfromhome" }
    this.adminLayoutService.getpagePermission(pagePermission).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.isView = Response.data.isView;
        this.isUpdated = Response.data.isUpdated;
        if (this.isView === false) {
          this.router.navigate(['admin/dashboard']);
        }
      }
    }, (error) => {
      console.log(error.error.Message);
    });
  }

  ngOnInit(): void {
    this.getYear();
    this.getWorkFromHomeList();
    this.l = 10;
    this.wfhTypeStatus = this.wfhStatusType[1].value;
  }

  getYear() {
    let CurrentYear = new Date().getFullYear()

    let startYear = 2019;

    while (startYear <= CurrentYear) {
      this.yearArray.push(startYear++)
    }
    console.log(this.yearArray);

    return this.yearArray.reverse()
  }

  getWorkFromHomeList() {
    this.workFromHomeList = []
    let obj = {
      month: this.month == null ? '' : this.month,
      year: this.year == null ? '' : this.year
    }
    this.adminLayoutService.getWorkFromHomeList(obj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.WorkFromHomeList = Response.data;
        this.workFromHomeList = this.WorkFromHomeList;
        this.allWorkFromHomeList = this.workFromHomeList;
        this.workFromHomeList = this.WorkFromHomeList.slice();
        this.sortingList({ active: 'userName', direction: 'asc' })
        this.p = 1;
        this.noData = false;
        this.search(this.searchTerm, this.wfhTypeStatus)
      } else {
        this.noData = true;
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }

  search(value: string, wfhTypeStatus: any): void {
    if (wfhTypeStatus != 0) {
      this.workFromHomeList = this.allWorkFromHomeList.filter((val) => val.userName.toLowerCase().includes(value.toLowerCase()) && wfhTypeStatus == val.workFromHomeStatus);
      this.p = 1;
      if (this.workFromHomeList.length == 0) {
        this.noData = true;
      } else {
        this.noData = false;
      }
    }
    else {
      this.workFromHomeList = this.allWorkFromHomeList.filter((val) => val.userName.toLowerCase().includes(value.toLowerCase()));
      this.p = 1;
      if (this.workFromHomeList.length == 0) {
        this.noData = true;
      } else {
        this.noData = false;
      }
    }
  }

  sortingList(sort: Sort) {

    const data = this.allWorkFromHomeList.slice();
    if (!sort.active || sort.direction === '') {
      this.workFromHomeList = data;
      return;
    }

    this.workFromHomeList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'userName': return compare(a.userName, b.userName, isAsc);
        default: return 0;
      }
    });
  }

  rejectWFHRemarkModal() {
    this.remark = ''
    this.submittedWFHRemark = false;
    this.approveRejectedByName = '';
    $("#reject-WFH-modal").modal('hide');
  }

  ApprovedWFHRemarkModal() {
    this.submittedWFHRemark = false;
    this.approveRejectedByName = '';
    $("#approve-WFH-modal").modal('hide');
  }

  rejectWFHRemarkModalOpen(id: any) {
    this.cancleWFHID = id;
    this.remark = '';
    this.approveRejectedByName = '';
    this.submittedWFHRemark = false;
    $("#reject-WFH-modal").modal({ backdrop: 'static', keyboard: false, show: true });
  }

  approveWFHRemarkModalOpen(id: any) {
    this.cancleWFHID = id;
    this.approveRejectedByName = '';
    this.submittedWFHRemark = false;
    $("#approve-WFH-modal").modal({ backdrop: 'static', keyboard: false, show: true });
  }

  rejectWorkFromHome() {

    if (!this.remark) {
      this.submittedWFHRemark = true;
      return
    }

    let Obj = {
      workFromHomeId: this.cancleWFHID,
      workFromHomeStatus: 2,
      remark: this.remark,
      // workFromHomeRejectedBy: this.approveRejectedByName
    }

    this.adminLayoutService.workFromHomeStatusUpdate(Obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.getWorkFromHomeList()
        this.remark = '';
        this.approveRejectedByName = '';
        this.submittedWFHRemark = false;
        $("#reject-WFH-modal").modal('hide');
      }
    })
  }
  approveWorkFromHome(id: any) {

    // if (!this.approveRejectedByName) {
    //   this.submittedWFHRemark = true;
    //   return
    // }

    let Obj = {
      workFromHomeId: id,
      workFromHomeStatus: 1,
      // workFromHomeRejectedBy: this.approveRejectedByName
    }

    this.adminLayoutService.workFromHomeStatusUpdate(Obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.getWorkFromHomeList()
        this.approveRejectedByName = '';
        this.submittedWFHRemark = false;
        $("#approve-WFH-modal").modal('hide');
      }
    })
  }


}


function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
