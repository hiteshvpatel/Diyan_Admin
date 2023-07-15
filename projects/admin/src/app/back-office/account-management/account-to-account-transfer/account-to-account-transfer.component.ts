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
    selector: 'app-account-to-account-transfer',
    templateUrl: './account-to-account-transfer.component.html',
    styleUrls: ['./account-to-account-transfer.component.scss']
})
export class AccountToAccountTransferComponent implements OnInit {


    accountToAccountTransferMasterForm: FormGroup;
    activeGroupMasterList: any[] = [];
    activeLedgerMasterList: any[] = [];
    fromLedgerMasterListByGroupId: any[];
    toLedgerMasterListByGroupId: any[];

    get fAccountToAccountTransferData() { return this.accountToAccountTransferMasterForm.controls; }
    submittedAccountToAccountTransferMaster = false;
    isView: boolean;
    isCreated: boolean;
    isUpdated: boolean;
    isDeleted: boolean;
    searchTerm: any;
    todayDate = new Date();
    maxDate: NgbDateStruct = { year: this.todayDate.getFullYear(), month: this.todayDate.getMonth() + 1, day: this.todayDate.getDate() };



    constructor(public commonService: CommonService, public adminLayoutService: AdminLayoutService, public storageService: StorageService, public accountManagementService: AccountManagementService, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private spinner: NgxSpinnerService) {
        let pagePermission = { module: "accounttoaccountmaster" }
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
        this.accountToAccountTransferMasterForm = this.fb.group({
            _id: [''],
            fromGroup: [, [Validators.required]],
            toGroup: [, [Validators.required]],
            fromLedger: [, [Validators.required]],
            toLedger: [, [Validators.required]],
            transactionDate: ['', [Validators.required]],
            value: ['', [Validators.required]],
            iscredit: ['true', [Validators.required]],
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

    onGroupChange(groupId: any, type) {

        if (type == 1) {
            this.fromLedgerMasterListByGroupId = [];
            if (groupId != null) {
                this.fromLedgerMasterListByGroupId = this.activeLedgerMasterList.filter((x: any) => x.groupId === groupId._id);
                //if (!!this.accountToAccountTransferMasterForm.value.toLedger || this.accountToAccountTransferMasterForm.value.toLedger != null) {
                //    this.fromLedgerMasterListByGroupId = this.fromLedgerMasterListByGroupId.filter((x: any) => x._id != this.accountToAccountTransferMasterForm.value.toLedger)
                //}
            }
            this.accountToAccountTransferMasterForm.controls.fromLedger.setValue(null);
        }
        else if (type == 2) {
            this.toLedgerMasterListByGroupId = [];
            if (groupId != null) {
                this.toLedgerMasterListByGroupId = this.activeLedgerMasterList.filter((x: any) => x.groupId === groupId._id);
                //if (!!this.accountToAccountTransferMasterForm.value.fromLedger || this.accountToAccountTransferMasterForm.value.fromLedger != null) {
                //    this.toLedgerMasterListByGroupId = this.toLedgerMasterListByGroupId.filter((x: any) => x._id != this.accountToAccountTransferMasterForm.value.fromLedger)
                //}
            }
            this.accountToAccountTransferMasterForm.controls.toLedger.setValue(null);
        }
    }


    saveAccountToAccountTransferMaster() {

        if (this.accountToAccountTransferMasterForm.invalid) {
            this.submittedAccountToAccountTransferMaster = true;
            return;
        }
        let iscredit: boolean = true
        if (this.accountToAccountTransferMasterForm.controls.iscredit.value === "false") {
            iscredit = false
        } else if (this.accountToAccountTransferMasterForm.controls.iscredit.value === "true") {
            iscredit = true
        }
        if (this.accountToAccountTransferMasterForm.controls.fromLedger.value === this.accountToAccountTransferMasterForm.controls.toLedger.value) {
            this.commonService.notifier.notify('error', "Please Select Different From Ledger and To Ledger.");
            return;
        }
        let accountToAccountTransfermasterModelObj = {
            fromGroup: this.accountToAccountTransferMasterForm.controls.fromGroup.value,
            toGroup: this.accountToAccountTransferMasterForm.controls.toGroup.value,
            fromLedger: this.accountToAccountTransferMasterForm.controls.fromLedger.value,
            toLedger: this.accountToAccountTransferMasterForm.controls.toLedger.value,
            value: this.accountToAccountTransferMasterForm.controls.value.value,
            iscredit: iscredit,
            description: this.accountToAccountTransferMasterForm.controls.description.value,
            transactionDate: moment(this.accountToAccountTransferMasterForm.controls.transactionDate.value).format('DD/MM/yyyy'),
        };


        this.accountManagementService.SaveAccountToAccountTransferMaster(accountToAccountTransfermasterModelObj).subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                this.submittedAccountToAccountTransferMaster = false;
                this.defaultForm();
                this.commonService.notifier.notify('success', "Account To Account Transfer Successfully.");
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message);
            }
        }, (error) => {
            console.log(error);
        });
    }

}



