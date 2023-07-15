import { Component, OnInit } from '@angular/core';
import { AdminLayoutService } from '../../../layouts/admin-layout/admin-layout.service';
import { CommonService } from '../../../shared/common.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import * as Chartist from 'chartist';
import { NgxSpinnerService } from "ngx-spinner";
import { Sort } from '@angular/material/sort';
import { StorageService, StorageKey } from '../../../shared/storage.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
  selector: 'app-pending-attendance-list',
  templateUrl: './pending-attendance-list.component.html',
  styleUrls: ['./pending-attendance-list.component.scss']
})
export class PendingAttendanceListComponent implements OnInit {
  statusList: any = [];
  allPendingAttendanceList: any[] = [];
  isView: Boolean;
  isCreated: Boolean;
  isUpdated: Boolean;
  isDeleted: Boolean;

  constructor(public commonService: CommonService, public storageService: StorageService, public adminLayoutService: AdminLayoutService, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private spinner: NgxSpinnerService) {
    let pagePermission = { module: "pendingattendancelist" }
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

  dayTypeList = [
    { name: "First Half", value: 1 },
    { name: "Second Half", value: 2 },
    { name: "Full Day", value: 3 },
    { name: "Leave", value: 4 },
  ]

  ngOnInit() {
    this.defaultForm()
    this.statusList = [
      { id: 1, label: 'pending' },
      { id: 2, label: 'approve' },
      { id: 3, label: 'reject' }
    ];
    this.getPendingAttendanceList();
    this.mySelect = 5;
    this.l = 10;
  }

  noData: boolean = false;
  pendingAttendanceList: any[] = [];
  l: number;
  p: number = 1;
  itemsPage: any;
  mySelect;
  submitterSearchFormData: boolean = false;
  searchForm: FormGroup;
  searchTerm: string;

  defaultForm() {
    this.searchForm = this.fb.group({
      fromDate: [new Date(moment(new Date()).subtract(1, 'month').format('YYYY-MM-DD'))],
      toDate: [new Date()]
    });
  }

  searchFilter(value: string): void {
    this.pendingAttendanceList = this.allPendingAttendanceList.filter((val) => JSON.stringify(val).toLowerCase().includes(value.toLowerCase()))
    console.log(this.pendingAttendanceList);
    this.p = 1;
    if (this.pendingAttendanceList.length == 0) {

      this.noData = true;
    } else {
      this.noData = false;
    }
  }

  onfromDateChange() {
    this.searchForm.controls.toDate.setValue('');
  }



  itemsPerPage(): void {
    this.l = this.mySelect;
  }

  getPendingAttendanceList() {
    this.pendingAttendanceList = []
    // let dateobj = {
    //   fromDate: this.searchForm.value.fromDate ? moment(this.searchForm.value.fromDate).format('DD/MM/yyyy') : '',
    //   toDate: this.searchForm.value.toDate ? moment(this.searchForm.value.toDate).format('DD/MM/yyyy') : ''
    // }


    this.adminLayoutService.getpendingManualAttendanceList().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allPendingAttendanceList = Response.data;
        this.pendingAttendanceList = this.allPendingAttendanceList;
        this.noData = false;
      } else {
        this.noData = true;
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }

  selectedDayType: number;

  updateStatus(e, empId) {

    let params = {
      "penddingAttendanceId": empId,
      "approveType": e.id == 2 ? 1 : e.id == 3 ? 2 : 1
    }

    this.adminLayoutService.updateAttendanceStatus(params).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.commonService.notifier.notify('success', Response.meta.message);
        this.getPendingAttendanceList();
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });

  }

  sortingList(sort: Sort) {

    const data = this.allPendingAttendanceList.slice();
    if (!sort.active || sort.direction === '') {
      this.pendingAttendanceList = data;
      return;
    }

    this.pendingAttendanceList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      switch (sort.active) {
        case 'empNumber': return compare(a.empNumber, b.empNumber, isAsc);
        case 'fullName': return compare(a.fullName, b.fullName, isAsc);
        default: return 0;
      }
    });
  }

}


function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}