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
import * as moment from 'moment';
declare const $: any;

@Component({
    selector: 'app-account-entry-master',
    templateUrl: './account-entry-master.component.html',
    styleUrls: ['./account-entry-master.component.scss']
})

export class AccountEntryMasterComponent implements OnInit {


    accountEntryMasterForm: FormGroup;

    activeGroupMasterList: any[] = [];
    activeLedgerMasterList: any[] = [];
    ledgerMasterListByGroupId: any[] = [];

    get fAccountEntryMasterData() { return this.accountEntryMasterForm.controls; }
    submittedAccountEntryMaster = false;

    isView: boolean;
    isCreated: boolean;
    isUpdated: boolean;
    isDeleted: boolean;
    searchTerm: any;
    todayDate = new Date();
    maxDate: NgbDateStruct = { year: this.todayDate.getFullYear(), month: this.todayDate.getMonth() + 1, day: this.todayDate.getDate() };



    constructor(public commonService: CommonService, public adminLayoutService: AdminLayoutService, public storageService: StorageService, public accountManagementService: AccountManagementService, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private spinner: NgxSpinnerService) {
        let pagePermission = { module: "accountentrymaster" }
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
        this.getGroupMasterActiveList();
        this.getLedgerMasterActiveList();
        this.defaultForm();
    }

    defaultForm() {
        this.accountEntryMasterForm = this.fb.group({
            _id: [''],
            groupId: [, [Validators.required]],
            ledgerId: [, [Validators.required]],
            transactionDate: ['', [Validators.required]],
            value: ['', [Validators.required]],
            iscredit: ['', [Validators.required]],
            description: ['', [Validators.required]],
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
        this.accountEntryMasterForm.controls.ledgerId.setValue(null);
    }
    onTransactionDateChange(event) {
        if (event.year != null || event.month != null || event.day != null) {

        }
        else {
            this.accountEntryMasterForm.controls.transactionDate.setValue('');
        }
    }

    saveAccountEntryMaster() {


        if (this.accountEntryMasterForm.invalid) {
            this.submittedAccountEntryMaster = true;
            return;
        }
        let iscredit: boolean = true
        if (this.accountEntryMasterForm.controls.iscredit.value === "false") {
            iscredit = false
        } else if (this.accountEntryMasterForm.controls.iscredit.value === "true") {
            iscredit = true
        }
        let accountEntryMasterModelObj = {
            groupId: this.accountEntryMasterForm.controls.groupId.value,
            ledgerId: this.accountEntryMasterForm.controls.ledgerId.value,
            value: this.accountEntryMasterForm.controls.value.value,
            iscredit: iscredit,
            description: this.accountEntryMasterForm.controls.description.value,
            transactionDate: moment(this.accountEntryMasterForm.controls.transactionDate.value).format('DD/MM/yyyy'),
        };


        this.accountManagementService.SaveAccountEntryMaster(accountEntryMasterModelObj).subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                this.submittedAccountEntryMaster = false;
                this.defaultForm();
                this.commonService.notifier.notify('success', "Account Entry Master Saved Successfully.");
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message);
            }
        }, (error) => {
            console.log(error);
        });
    }

}
