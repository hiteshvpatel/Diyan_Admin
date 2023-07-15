import { Component, OnInit } from '@angular/core';
import { AdminLayoutService } from '../../../layouts/admin-layout/admin-layout.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CommonService } from '../../../shared/common.service';
import { environment } from '../../../../environments/environment';
import * as moment from 'moment';
declare const $: any;
import { Sort } from '@angular/material/sort';


@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.css']
})
export class AttendanceListComponent implements OnInit {
  yearArray = new Array<number>();
  attendanceMasterList: any;
  l: number;
  p: number = 1;
  mySelect;
  noData = false;
  dt = new Date();
  TodayDate: any;
  currentTodayDate = moment(new Date()).format('yyyy-MM-DD');
  toMonth = this.dt.getMonth() + 1;
  toYear = this.dt.getFullYear();
  month = this.toMonth;
  year = this.toYear;
  d = new Date(this.year, this.month - 1);
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayName = this.days[this.d.getDay()];
  daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
  searchData = false;
  sat = [];
  sun = [];
  elementsMeta = [];
  allAttendanceMasterList;
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
  dateForAttendanceList: any[] = [];
  searchForm: FormGroup;
  searchTerm: any;
  dateWiseAttendanceData: any;
  monthWiseAttendanceData: any;
  imgUrl = environment.uploadedUrl;
  invalidYear: boolean = false;
  invalidMonth: boolean = false;

  get fSearchData(): { [key: string]: AbstractControl } {
    return this.searchForm.controls;
  }

  defaultForm() {
    this.searchForm = this.fb.group({
      name: [''],
      month: [this.month, [Validators.required]],
      year: [this.year, [Validators.required]],
    });
  }




  constructor(private commonService: CommonService, public adminLayoutService: AdminLayoutService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getYear();
    this.defaultForm();
    let params = {
      month: this.searchForm.value.month,
      year: this.searchForm.value.year
    }
    this.getAttendanceLists(params);
    this.getDateForAttendanceList();
    this.getDayNames(this.year, this.month);
    this.mySelect = 10;
    this.l = 10;
    this.TodayDate = this.dt.getDate();
    console.log(this.TodayDate);
  }
  itemsPerPage(): void {
    this.l = this.mySelect;
  }
  searchFilter(value: string): void {
    this.attendanceMasterList = this.allAttendanceMasterList.filter((val) => val.userName.toLowerCase().includes(value.toLowerCase()))
    console.log(this.attendanceMasterList);
    this.p = 1;
    if (this.attendanceMasterList.length == 0) {

      this.noData = true;
    } else {
      this.noData = false;
    }
  }

  // getWeekend(year, month) {
  //   
  //   for (var i = 1; i <= this.daysInMonth; i++) {    //looping through days in month
  //     var newDate = new Date(year, month, i)
  //     if (newDate.getDay() == 0) {   //if Sunday
  //       this.sun.push(i);
  //     }
  //     if (newDate.getDay() == 6) {   //if Saturday
  //       this.sat.push(i);
  //     }
  //   }
  // }
  getDayNames(year: number, month: number) {

    this.elementsMeta = [];
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var daysInMonth = new Date(year, month, 0).getDate();
    var weekNumber = 0
    for (let i = 1; i <= daysInMonth; i++) {
      var d = new Date(year, month - 1, i);
      var dayName = days[d.getDay()];

      if (dayName === 'Sat') {
        weekNumber = weekNumber + 1
      }
      let modal = {
        columnTitle: i + "/" + month,
        dayName: dayName,
        weekNumber: weekNumber
      };
      this.elementsMeta.push(modal);
      //console.log("dayyyyyyy",i + ' ' + dayName);
    }
    console.log("dayyyyyyy", this.elementsMeta);
  }
  counter(i: number) {
    return new Array(i);
  }

  openDetails(id: any, date: any) {
    // $("#add-attendance-details-modal").modal({ backdrop: 'static', keyboard: false, show: true });
    let Obj = {
      employeeId: id,
      fromDate: date + '/' + this.month + '/' + this.year
    }
    this.adminLayoutService.getDateWiseAttendanceData(Obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {

        this.dateWiseAttendanceData = Response.data;
        $("#add-attendance-details-modal").modal({ backdrop: 'static', keyboard: false, show: true });
      }
    });
  }
  closeAttendanceDetails() {
    $("#add-attendance-details-modal").modal("hide");
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

  getAttendanceLists(params: any) {
    this.adminLayoutService.getAttendanceMasterList(params).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.attendanceMasterList = Response.data;
        this.allAttendanceMasterList = this.attendanceMasterList;
        this.searchData = false;
        this.sortingList({ active: 'userName', direction: 'asc' });
        if (this.attendanceMasterList.length == 0) {
          this.noData = true;
        } else {
          this.noData = false;
        }
      } else {
        this.noData = true;
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }

  search() {
    if (this.toMonth >= this.searchForm.value.month) {
      this.invalidMonth = false;
    } else {
      if (this.month < this.searchForm.value.month && this.toYear > this.searchForm.value.year) {
        this.invalidMonth = false
      }
      else {
        this.invalidMonth = true;
      }
    }


    if (this.toYear >= this.searchForm.value.year) {
      this.invalidYear = false;
    } else {
      this.invalidYear = true;
    }
    if (this.searchForm.invalid || this.invalidMonth === true || this.invalidYear === true) {
      this.searchData = true;
      return;
    }
    let params = {
      month: this.searchForm.value.month,
      year: this.searchForm.value.year
    }
    this.sun = [];
    this.sat = [];
    this.month = this.searchForm.value.month;
    this.year = this.searchForm.value.year;
    this.daysInMonth = new Date(this.year, this.month, 0).getDate();
    this.getDateForAttendanceList();
    this.getAttendanceLists(params);
    this.getDayNames(this.year, this.month); // take -1 because month value getting from monthArray
  }
  onMonthChange() {
    if (this.toMonth < this.searchForm.value.month && this.searchData === true) {
      this.invalidMonth = true;
    } else {
      this.invalidMonth = false;
    }
  }
  getDateForAttendanceList() {
    this.dateForAttendanceList = [];
    if (this.searchForm.invalid) {
      this.searchData = true;
      return
    }
    let params = {
      month: this.searchForm.value.month,
      year: this.searchForm.value.year
    }

    this.adminLayoutService.getDateForAttendanceMasterList(params).subscribe((Response: any) => {
      this.dateForAttendanceList = Response.data;
      this.searchData = false;
    });
  }

  openMonthDetails(id: any, date: any) {

    let Obj = {
      employeeId: id,
      month: this.month,
      year: this.year
    }
    this.adminLayoutService.getMonthWiseAttendanceData(Obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {

        this.monthWiseAttendanceData = Response.data;
        $("#add-month-attendance-details-modal").modal({ backdrop: 'static', keyboard: false, show: true });
      }
    });
  }
  closeMonthAttendanceDetails() {
    $("#add-month-attendance-details-modal").modal("hide");
  }

  sortingList(sort: Sort) {

    const data = this.allAttendanceMasterList.slice();
    if (!sort.active || sort.direction === '') {
      this.attendanceMasterList = data;
      return;
    }

    this.attendanceMasterList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      switch (sort.active) {
        case 'userName': return compare(a.userName, b.userName, isAsc);
        default: return 0;
      }
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}