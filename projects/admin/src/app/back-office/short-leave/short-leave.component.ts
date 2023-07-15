import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminLayoutService } from '../../layouts/admin-layout/admin-layout.service';
import { CommonService } from '../../shared/common.service';
declare const $: any;

@Component({
  selector: 'app-short-leave',
  templateUrl: './short-leave.component.html',
  styleUrls: ['./short-leave.component.css']
})
export class ShortLeaveComponent implements OnInit {

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
  empShortLeaveList: any[] = [];
  allEmployeeShortLeaveList: any[] = [];
  ShortLeaveList: any[] = [];
  month = new Date().getMonth() + 1;
  year = new Date().getFullYear()

  noData;

  remark = '';
  cancleWFHID: any;
  searchTerm = '';



  constructor(public commonService: CommonService, public adminLayoutService: AdminLayoutService, private fb: FormBuilder, private router: Router, private spinner: NgxSpinnerService) {

  }

  ngOnInit(): void {
    this.getYear();
    this.getShortLeaveListData();
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

  getShortLeaveListData() {
    this.empShortLeaveList = [];
    this.allEmployeeShortLeaveList = [];
    let obj = {
      month: this.month == null ? '' : this.month,
      year: this.year == null ? '' : this.year
    }
    this.adminLayoutService.getShortLeaveListDataAllList(obj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.ShortLeaveList = Response.data;
        this.empShortLeaveList = this.ShortLeaveList;
        this.allEmployeeShortLeaveList = this.empShortLeaveList;
        this.empShortLeaveList = this.ShortLeaveList.slice();
        this.noData = false;
        this.search(this.searchTerm)
      } else {
        this.noData = true;
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }

  search(value: string): void {
    this.empShortLeaveList = this.allEmployeeShortLeaveList.filter((val) => val.userName.toLowerCase().includes(value.toLowerCase()));
    if (this.empShortLeaveList.length == 0) {
      this.noData = true;
    } else {
      this.noData = false;
    }
  }

  sortingList(sort: Sort) {

    const data = this.allEmployeeShortLeaveList.slice();
    if (!sort.active || sort.direction === '') {
      this.empShortLeaveList = data;
      return;
    }

    this.empShortLeaveList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'userName': return compare(a.userName, b.userName, isAsc);
        default: return 0;
      }
    });
  }

  rejectShortLeaveRemarkModal() {
    this.remark = ''
    $("#reject-emp-short-leave-modal").modal('hide');
  }

  rejectEmployeeShortLeaveModalOpen(id: any) {

    this.cancleWFHID = id;
    this.remark = '';
    $("#reject-emp-short-leave-modal").modal({ backdrop: 'static', keyboard: false, show: true });

    // swal({
    //   title: "Reject Short Leave",
    //   text: "Are you sure to Reject this user Short Leave ?",
    //   icon: "warning",
    //   closeOnClickOutside: false,
    //   buttons: ['Cancel', true],
    //   dangerMode: true,
    // }).then((willDelete) => {
    //   if (willDelete) {

    //   }
    // })
  }

  rejectShortLeaveSave() {

    let Obj = {
      _id: this.cancleWFHID,
      shortLeavestatus: 3,
      remark: this.remark,
    }

    this.adminLayoutService.updateShortLeaveStatus(Obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.getShortLeaveListData()
        this.remark = '';
        this.commonService.notifier.notify('success', "Short Leave Rejected Successfully.");
        $("#reject-emp-short-leave-modal").modal('hide');
      }
      else {
        this.commonService.notifier.notify('success', Response.meta.message);
      }
    })
  }

  approveEmployeeShortLeave(id: any) {

    let Obj = {
      _id: id,
      shortLeavestatus: 2,
    }
    this.adminLayoutService.updateShortLeaveStatus(Obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.commonService.notifier.notify('success', "Short Leave Approved Successfully.");
        this.getShortLeaveListData()
      }
      else {
        this.commonService.notifier.notify('success', Response.meta.message);
      }
    })

    // swal({
    //   title: "Approve Short Leave",
    //   text: "Are you sure to Approve this user Short Leave?",
    //   icon: "warning",
    //   closeOnClickOutside: false,
    //   buttons: ['Cancel', true],
    //   dangerMode: true,
    // }).then((willDelete) => {
    //   if (willDelete) {

    //   }
    // })


  }

}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}