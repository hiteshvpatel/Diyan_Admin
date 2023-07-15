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
import { StorageService } from '../../../shared/storage.service';
import { AccountManagementService } from '../account-management.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

declare const $: any;

@Component({
    selector: 'app-group-wise-account-entry-report',
    templateUrl: './group-wise-account-entry-report.component.html',
    styleUrls: ['./group-wise-account-entry-report.component.scss']
})
export class GroupWiseAccountEntryReportComponent implements OnInit {

    accountEntryReportList: any[] = [];
    searchForm: FormGroup;
    activeGroupMasterList: any[] = [];

    get fGroupWiseAccountEntryReportData() { return this.searchForm.controls; }
    submitedGroupWiseAccountEntry = false;
    noData;


    isView: boolean;
    isCreated: boolean;
    isUpdated: boolean;
    isDeleted: boolean;

    creditSubTotal: any;
    debitSubTotal: any;
    creditClosingBalance: any;
    debitClosingBalance: any;
    creditTotal: any;
    debitTotal: any;

    constructor(public commonService: CommonService, public adminLayoutService: AdminLayoutService, public storageService: StorageService, public accountManagementService: AccountManagementService, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private spinner: NgxSpinnerService) {
        let pagePermission = { module: "groupwiseaccountentryreport" }
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
        this.noData = false;
        this.getGroupMasterActiveList();
        this.defaultForm();
    }

    defaultForm() {
        this.searchForm = this.fb.group({
            groupId: [, [Validators.required]],
        });
    }

    getGroupMasterActiveList() {
        this.accountManagementService.getGroupMasterActiveList().subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.activeGroupMasterList = Response.data;
            }
        })
    }

    getGroupWiseAccountEntryReportList() {

        if (this.searchForm.invalid) {
            this.submitedGroupWiseAccountEntry = true;
            return;
        }

        let Obj = {
            groupId: this.searchForm.value.groupId,
        }
        this.accountEntryReportList = [];

        this.accountManagementService.getGroupWiseAccountEntryReportDetailsByID(Obj).subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                this.accountEntryReportList = Response.data[0].allData;
                this.creditSubTotal = Response.data[0].creditBalance;
                this.debitSubTotal = Response.data[0].debitBalance;
                if (Response.data[0].closingBalance > 0) {
                    this.debitClosingBalance = Math.abs(Response.data[0].closingBalance)
                    this.creditClosingBalance = 0;
                } else if (Response.data[0].closingBalance < 0) {
                    this.creditClosingBalance = Math.abs(Response.data[0].closingBalance)
                    this.debitClosingBalance = 0;
                }
                this.creditTotal = this.creditSubTotal + this.creditClosingBalance
                this.debitTotal = this.debitSubTotal + this.debitClosingBalance
                this.noData = false;
            } else {
                this.noData = true;
            }
            //for select sub industry step
        }, (error) => {
            console.log(error.error.Message);
        });
    }

}
