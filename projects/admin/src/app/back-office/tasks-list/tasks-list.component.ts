import { Component, OnInit } from '@angular/core';
import { AdminLayoutService } from '../../layouts/admin-layout/admin-layout.service';
import { CommonService } from '../../shared/common.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import * as Chartist from 'chartist';
import { NgxSpinnerService } from "ngx-spinner";
import { Sort } from '@angular/material/sort';
import { StorageService, StorageKey } from '../../shared/storage.service';

import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';

import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as moment from 'moment';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit {
  // model: NgbDateStruct;
  taskMasterList: any;
  l: number;
  p: number = 1;
  itemsPage: any;
  mySelect;
  noData;
  searchForm: FormGroup;
  employeeMasterList: any[] = [];
  imgURL = environment.uploadedUrl;
  submitterSearchFormData: boolean = false;
  fromDateShowValidation: boolean = false;
  EmployeeIndex: any;
  allEmployeeMasterList: any[] = [];
  showTaskCard: boolean = false;
  clickEmployeeId: any;
  get fSearachData(): { [key: string]: AbstractControl } {
    return this.searchForm.controls;
  }
  searchTerm: string;


  constructor(public commonService: CommonService, public storageService: StorageService, public adminLayoutService: AdminLayoutService, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.getEmployeeList();
    this.defaultForm();
    this.mySelect = 5;
    this.l = 10;
    this.showTaskCard = false;
  }
  itemsPerPage(): void {
    this.l = this.mySelect;
    this.p = 1;
  }

  closeTaskReport() {
    this.showTaskCard = false;
    this.EmployeeIndex = null;
    this.taskMasterList = '';
  }

  search(value: string): void {
    this.employeeMasterList = this.allEmployeeMasterList.filter((val: any) => val.userName.toLowerCase().includes(value.toLowerCase()));
    this.p = 1;
    if (this.employeeMasterList.length == 0) {

      this.noData = true;
    } else {
      this.noData = false;
    }
  }



  onReportFromDateChange(event) {
    this.searchForm.controls.reportToDate.setValue('');
  }

  defaultForm() {
    this.searchForm = this.fb.group({
      employeeId: [],
      reportFromDate: [new Date(moment(new Date()).subtract(1, 'months').format('YYYY-MM-DD'))],
      reportToDate: [new Date()]
    });
  }

  getEmployeeList() {
    this.adminLayoutService.getEmployeeLists().subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.allEmployeeMasterList = Response.data;
        this.employeeMasterList = this.allEmployeeMasterList;
        this.sortingList({ active: 'userName', direction: 'asc' })
      }

    }, (error) => {
      console.log(error.error.Message);
    });
  }
  getTaskListByEmployeeId(employeeID, index) {
    // this.showTaskCard = false;
    this.taskMasterList = '';
    this.EmployeeIndex = index;
    this.searchForm.controls.employeeId.setValue(employeeID);

    let TaskListObj = {
      employeeId: this.isNullOrUndefined(this.searchForm.value.employeeId) ? '' : this.searchForm.value.employeeId,
      fromDate: this.searchForm.value.reportFromDate ? moment(this.searchForm.value.reportFromDate).format('DD/MM/yyyy') : '',
      toDate: this.searchForm.value.reportToDate ? moment(this.searchForm.value.reportToDate).format('DD/MM/yyyy') : ''
    }

    // return;
    if (TaskListObj.employeeId !== this.clickEmployeeId) {
      this.adminLayoutService.getTaskLists(TaskListObj).subscribe((Response: any) => {

        if (Response.meta.code == 200) {
          this.taskMasterList = Response.data;
          this.clickEmployeeId = Response.data._id
          this.showTaskCard = true;
        }

      }, (error) => {
        console.log(error.error.Message);
      });
    }
  }

  isNullOrUndefined<T>(tObj: T): boolean {
    return tObj === null || tObj === undefined;
  }

  downloadExcel() {

    let userName = this.taskMasterList.firstName + ' ' + this.taskMasterList.middleName + ' ' + this.taskMasterList.lastName;


    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(userName);

    worksheet.columns = [
      //{ header: 'Customer ID', key: 'customerId', width: 32 },
      { header: 'Report Date', key: 'reportDate', width: 20 },
      { header: 'Times', key: 'times', width: 20 },
      { header: 'Project Name', key: 'projectName', width: 30 },
      { header: 'Task Description', key: 'taskDesc', width: 50 },
      { header: 'Status', key: 'status', width: 10 },
    ];

    this.taskMasterList.workReportData.forEach(e => {
      let taskStatus;
      if (e.taskstatus === 1) {
        taskStatus = 'Hold';
      }
      else if (e.taskstatus === 2) {
        taskStatus = 'In Progress';
      }
      else if (e.taskstatus === 3) {
        taskStatus = 'Complete';
      }

      worksheet.addRow({ reportDate: e.reportDate, times: e.taskHour + ' Hours ' + e.taskMinutes + ' Minutes', projectName: e.projectName, taskDesc: e.task, status: taskStatus })
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, userName + '.xlsx');
    })
  }

  sortingList(sort: Sort) {

    const data = this.allEmployeeMasterList.slice();
    if (!sort.active || sort.direction === '') {
      this.employeeMasterList = data;
      return;
    }



    this.employeeMasterList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      switch (sort.active) {
        case 'userName': return compare(a.userName, b.userName, isAsc);
        default: return 0;
      }
    });
  }


}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}