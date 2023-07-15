import { Component, OnInit } from '@angular/core';
import { AdminLayoutService } from '../../layouts/admin-layout/admin-layout.service';
import { CommonService } from '../../shared/common.service';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import * as Chartist from 'chartist';
import { NgxSpinnerService } from "ngx-spinner";
import { Sort } from '@angular/material/sort';
import { StorageService, StorageKey } from '../../shared/storage.service';
import { stringify } from 'querystring';

declare const $: any;


@Component({
    selector: 'app-leave-list',
    templateUrl: './leave-list.component.html',
    styleUrls: ['./leave-list.component.css']
})
export class LeaveListComponent implements OnInit {
    ISeditMenu = false;
    leaveList: any[] = [];
    allLeaveList: any[] = [];
    LeaveList: any[] = [];
    l: number;
    p: number = 1;
    leaveListByLeaveId: any[] = [];
    itemsPage: any;
    mySelect;
    noData;
    isView: boolean;
    isCreated: boolean;
    isUpdated: boolean;
    isDeleted: boolean;
    leaveStatus: any[] = [
        {
            name: 'Approved',
            value: 2
        },
        {
            name: 'Rejected',
            value: 3
        },
        {
            name: 'Cancled',
            value: 4
        },
    ]
    selectedLeaveStatus = 1;
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
    month = new Date().getMonth() + 1;
    year = new Date().getFullYear()
    leaveStatusID: any;
    remark: any;
    leaveTypeStatus = null;
    leaveUpdateStatus: any;
    leaveUpdateStatusbefore: any;
    searchTerm = '';
    leaveStatusType = [
        { name: "All", value: 0 },
        { name: "Pending", value: 1 },
        { name: "Approved", value: 2 },
        { name: "Rejected", value: 3 },
        { name: "Cancled", value: 4 }
    ]

    constructor(public commonService: CommonService, public route: ActivatedRoute, public storageService: StorageService, public adminLayoutService: AdminLayoutService, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private spinner: NgxSpinnerService) {
        let pagePermission = { module: "leavelist" }
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

    ngOnInit() {
        this.getLeaveList();
        this.getYear()
        this.noData = false;
        this.mySelect = 5;
        this.l = 10;
        this.ISeditMenu = false;
        this.leaveTypeStatus = this.leaveStatusType[1].value;

        if (this.router.url.includes('leave-list-search')) {
            this.route.queryParams.subscribe((x: any) => {
                this.month = parseInt(x.month);
                this.year = x.year;
                this.searchTerm = x.name;
                this.leaveTypeStatus = 2
            });
        }
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


    itemsPerPage(): void {
        this.l = this.mySelect;
        this.p = 1;
    }

    addLeave() {
        $("#add-leave-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
        this.ISeditMenu = false;
    }

    cancelLeave() {
        $("#add-leave-modal").modal("hide");
        this.ISeditMenu = false;
    }


    getLeaveList() {
        this.leaveList = []
        let obj = {
            month: this.month == null ? '' : this.month,
            year: this.year == null ? '' : this.year
        }
        this.adminLayoutService.getUserWiseLeaveList(obj).subscribe((Response: any) => {

            if (Response.meta.code == 200) {

                this.LeaveList = Response.data;
                this.leaveList = this.LeaveList;
                this.allLeaveList = this.leaveList;
                this.leaveList = this.LeaveList.slice();
                this.sortingList({ active: 'userName', direction: 'asc' })
                this.p = 1;
                this.noData = false;
                this.search(this.searchTerm, this.leaveTypeStatus);

            } else {
                this.noData = true;
            }
            //for select sub industry step
        }, (error) => {
            console.log(error.error.Message);
        });
    }

    search(value: string, leaveType: any): void {
        if (leaveType != 0) {
            this.leaveList = this.allLeaveList.filter((val) => val.userName.toLowerCase().includes(value.toLowerCase()) && leaveType == val.leaveStatus);
            this.p = 1;
            if (this.leaveList.length == 0) {
                this.noData = true;
            } else {
                this.noData = false;
            }
        }
        else {
            this.leaveList = this.allLeaveList.filter((val) => val.userName.toLowerCase().includes(value.toLowerCase()));
            this.p = 1;
            if (this.leaveList.length == 0) {
                this.noData = true;
            } else {
                this.noData = false;
            }
        }
    }

    empUserName: any;
    empNo: any;

    getLeaveListByLeaveId(obj: any) {
        let Obj = {
            leaveID: obj.id,
            employeeId: obj.empId
        }
        this.adminLayoutService.getLeaveListByEmpLeaveId(Obj).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.empUserName = obj.name;
                this.empNo = obj.empNo;
                this.leaveListByLeaveId = Response.data.sort((a, b) => {
                    let Adate = new Date(a.date.split('/')[2] + '-' + a.date.split('/')[1] + '-' + a.date.split('/')[0]);
                    let Bdate = new Date(b.date.split('/')[2] + '-' + b.date.split('/')[1] + '-' + b.date.split('/')[0])
                    return (Adate < Bdate ? -1 : 1) * (true ? 1 : -1)
                });
                $("#leave-List-LeaveID-modal").modal({ backdrop: 'static', keyboard: false, show: true });
            }
        })
    }

    cancelLeaveListLeaveIdModal() {
        this.leaveListByLeaveId = []
        $("#leave-List-LeaveID-modal").modal('hide');
    }

    onChangeLeaveStatus() {

        if (!this.leaveUpdateStatus) {
            if (this.leaveUpdateStatus == 4 || this.leaveUpdateStatus == 3) {
                if (!this.remark) {
                    this.submittedLeaveApproveRejectRemark = true;
                    return
                }
            }
            this.submittedLeaveApproveReject = true;
            return
        }
        else {
            if (this.leaveUpdateStatus == 4 || this.leaveUpdateStatus == 3) {
                if (!this.remark) {
                    this.submittedLeaveApproveRejectRemark = true;
                    return
                }
            }
        }
        let Obj = {
            _id: this.leaveStatusID,
            leaveStatus: this.leaveUpdateStatus,
            remark: this.remark
        }
        this.adminLayoutService.updateLeaveStatus(Obj).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.leaveList = []
                this.submittedLeaveApproveReject = false;
                this.submittedLeaveApproveRejectRemark = false;
                this.leaveUpdateStatus = null;
                this.leaveUpdateStatusbefore = null;
                this.remark = ''
                $("#approve-reject-modal").modal('hide');
                this.getLeaveList();
            }
        })
    }
    submittedLeaveApproveReject: boolean = false
    submittedLeaveApproveRejectRemark: boolean = false
    openUpdateLeaveStatusModal(data: any) {
        this.submittedLeaveApproveReject = false;
        this.submittedLeaveApproveRejectRemark = false;
        this.leaveUpdateStatus = null;
        this.leaveUpdateStatusbefore = null;
        this.remark = ''
        this.leaveStatusID = data.id;
        this.leaveUpdateStatus = data.status == 1 ? null : data.status;
        this.leaveUpdateStatusbefore = data.status;
        $("#approve-reject-modal").modal({ backdrop: 'static', keyboard: false, show: true });
    }

    cancleLeaveStatusModal() {
        this.submittedLeaveApproveReject = false;
        this.submittedLeaveApproveRejectRemark = false;
        this.leaveUpdateStatus = null;
        this.leaveUpdateStatusbefore = null;
        this.remark = ''
        $("#approve-reject-modal").modal('hide');
    }

    sortingList(sort: Sort) {

        const data = this.allLeaveList.slice();
        if (!sort.active || sort.direction === '') {
            this.leaveList = data;
            return;
        }

        this.leaveList = data.sort((a, b) => {
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
