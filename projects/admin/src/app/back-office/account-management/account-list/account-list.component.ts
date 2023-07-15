import { Component, OnInit } from '@angular/core';
import { AdminLayoutService } from '../../../layouts/admin-layout/admin-layout.service';
import { CommonService } from '../../../shared/common.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import * as Chartist from 'chartist';
import { NgxSpinnerService } from "ngx-spinner";
import { Sort } from '@angular/material/sort';
import { StorageService, StorageKey } from '../../../shared/storage.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AccountManagementService } from '../account-management.service';
import * as moment from 'moment';

@Component({
    selector: 'app-account-list',
    templateUrl: './account-list.component.html',
    styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {


    ledgerMasterListByGroupId: any[];
    activeLedgerMasterList: any[];
    activeGroupMasterList: any[];
    accountMasterList: any[] = [];
    allaccountMasterList: any[] = [];
    isView: Boolean;
    isCreated: Boolean;
    isUpdated: Boolean;
    isDeleted: Boolean;
    submittedAccountListData: boolean = false;
    get fSearchFormData(): { [key: string]: AbstractControl } {
        return this.searchForm.controls;
    }

    constructor(public commonService: CommonService, public storageService: StorageService, public adminLayoutService: AdminLayoutService, public accountManagementService: AccountManagementService, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private spinner: NgxSpinnerService) {
        let pagePermission = { module: "accountlist" }
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
        this.defaultForm()
        this.getAccountList();
        this.mySelect = 5;
        this.l = 10;
    }

    noData: boolean = false;
    l: number;
    p: number = 1;
    itemsPage: any;
    mySelect;

    fromDate;
    toDate;
    submitterSearchFormData: boolean = false;
    searchForm: FormGroup;


    defaultForm() {
        this.searchForm = this.fb.group({
            fromDate: [new Date(moment(new Date()).subtract(1, 'months').format('YYYY-MM-DD')), [Validators.required]],
            toDate: [new Date()],
            groupId: [],
            ledgerId: [],
        });
    }
    onGroupChange(groupId: any) {

        this.ledgerMasterListByGroupId = [];
        if (groupId != null) {
            this.ledgerMasterListByGroupId = this.activeLedgerMasterList.filter((x: any) => x.groupId === groupId._id);
        }
        this.searchForm.controls.ledgerId.setValue(null);
    }
    onfromDateChange() {
        this.searchForm.controls.toDate.setValue('');
    }

    itemsPerPage(): void {
        this.l = this.mySelect;
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
    getAccountList() {

        if (this.searchForm.invalid) {
            this.submittedAccountListData = true;
            return
        }

        this.accountMasterList = [];


        let dateobj = {
            fromDate: this.searchForm.value.fromDate ? moment(this.searchForm.value.fromDate).format('DD/MM/yyyy') : '',
            toDate: this.searchForm.value.toDate ? moment(this.searchForm.value.toDate).format('DD/MM/yyyy') : '',
            groupId: this.isNullOrUndefined(this.searchForm.value.groupId) ? '' : this.searchForm.value.groupId,
            ledgerId: this.isNullOrUndefined(this.searchForm.value.ledgerId) ? '' : this.searchForm.value.ledgerId,
        }

        this.accountManagementService.acountEntryListDateGroupIdLedgerIdWise(dateobj).subscribe((Response: any) => {

            if (Response.meta.code == 200) {

                this.allaccountMasterList = Response.data;
                this.accountMasterList = this.allaccountMasterList;
                this.noData = false;
                this.sortingList({ active: 'transactionDate', direction: 'asc' })
            } else {
                this.noData = true;
            }
            //for select sub industry step
        }, (error) => {
            console.log(error.error.Message);
        });
    }

    deleteAccountData(deleteId: any) {
        let deleteAccountObj = {
            _id: deleteId
        }
        this.accountManagementService.deleteAccountListData(deleteAccountObj).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.getAccountList();
                this.commonService.notifier.notify('success', 'Deleted Successfully.')
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message)
            }
        })

    }


    isNullOrUndefined<T>(tObj: T): boolean {
        return tObj === null || tObj === undefined;
    }

    sortingList(sort: Sort) {

        const data = this.allaccountMasterList.slice();
        if (!sort.active || sort.direction === '') {
            this.accountMasterList = data;
            return;
        }



        this.accountMasterList = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';

            switch (sort.active) {
                case 'value': return compare(a.value, b.value, isAsc);
                case 'ledger': return compare(a.ledger, b.ledger, isAsc);
                case 'groupName': return compare(a.groupName, b.groupName, isAsc);
                case 'transactionDate': return compare(new Date(a.transactionDate), new Date(b.transactionDate), isAsc);
                default: return 0;
            }
        });
    }
}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
