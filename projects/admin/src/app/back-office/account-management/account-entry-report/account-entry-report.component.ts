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

@Component({
    selector: 'app-account-entry-report',
    templateUrl: './account-entry-report.component.html',
    styleUrls: ['./account-entry-report.component.scss']
})
export class AccountEntryReportComponent implements OnInit {

    ISeditAccountToAccountTransferMaster = false;
    accountEntryReportList: any[] = [];
    allAccountEntryReportList: any[] = [];
    l: number;
    p: number = 1;
    itemsPage: any;
    mySelect;
    searchForm: FormGroup;
    activeGroupMasterList: any[] = [];
    activeLedgerMasterList: any[] = [];
    ledgerMasterListByGroupId: any[];
    creditSubTotal: any;
    debitSubTotal: any;
    creditClosingBalance: any;
    debitClosingBalance: any;
    creditTotal: any;
    debitTotal: any;

    get fAccountEntryReportData() { return this.searchForm.controls; }
    submitedAccountEntry = false;
    noData;

    activeTab: number;
    imageList: any;
    //image: any;
    file: any;
    Image: any;
    isView: boolean;
    isCreated: boolean;
    isUpdated: boolean;
    isDeleted: boolean;
    searchTerm: any;
    todayDate = new Date();
    maxDate: NgbDateStruct = { year: this.todayDate.getFullYear(), month: this.todayDate.getMonth() + 1, day: this.todayDate.getDate() };



    constructor(public commonService: CommonService, public adminLayoutService: AdminLayoutService, public storageService: StorageService, public accountManagementService: AccountManagementService, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private spinner: NgxSpinnerService) {
        let pagePermission = { module: "accountentryreport" }
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
        this.mySelect = 999999;
        this.l = 999999;
        this.ISeditAccountToAccountTransferMaster = false;
        this.getGroupMasterActiveList();
        this.getLedgerMasterActiveList();
        //this.getAccountEntryReportList();
        this.defaultForm();
    }

    defaultForm() {
        this.searchForm = this.fb.group({
            groupId: [, [Validators.required]],
            ledgerId: [, [Validators.required]],
        });
    }

    getGroupMasterActiveList() {
        this.accountManagementService.getGroupMasterActiveList().subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.activeGroupMasterList = Response.data;
            }
        })
    }
    getLedgerMasterActiveList() {
        this.accountManagementService.getLedgerMasterActiveList().subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.activeLedgerMasterList = Response.data;
            }
        })
    }
    onGroupChange(groupId: any) {
        this.ledgerMasterListByGroupId = [];
        if (groupId != null) {
            this.ledgerMasterListByGroupId = this.activeLedgerMasterList.filter((x: any) => x.groupId === groupId._id);
        }
        this.searchForm.controls.ledgerId.setValue(null);
    }
    itemsPerPage(): void {
        this.l = this.mySelect;
    }

    getAccountEntryReportList() {

        if (this.searchForm.invalid) {
            this.submitedAccountEntry = true;
            return;
        }

        let Obj = {
            groupId: this.searchForm.value.groupId,
            ledgerId: this.searchForm.value.ledgerId
        }
        this.accountEntryReportList = [];
        this.accountManagementService.getAccountEntryReportDetailsByID(Obj).subscribe((Response: any) => {

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
