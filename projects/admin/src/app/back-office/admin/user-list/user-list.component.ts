import { HttpClient } from '@angular/common/http';
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
import { environment } from '../../../../environments/environment';

declare const $: any;

interface userMasterData {
    userName: string;
    email: string;
    roleName: string;
    status: string;
}

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css']
})
export class UserlistComponent implements OnInit {

    usermasterList: userMasterData[];
    allusermaster: userMasterData[];
    userMasterList: userMasterData[];
    l: number;
    p: number = 1;
    itemsPage: any;
    mySelect;
    usermasterListlength: any;
    noData;
    searchTerm: string;
    isView: boolean;
    isCreated: boolean;
    isUpdated: boolean;
    isDeleted: boolean;
    imgUrl = environment.uploadedUrl;
    selectedActiveDeActive = 1;

    constructor(private http: HttpClient, public commonService: CommonService, public storageService: StorageService, public adminLayoutService: AdminLayoutService, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private spinner: NgxSpinnerService) {
        let pagePermission = { module: "employeelist" }
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
        }, (error) => {
            console.log(error.error.Message);
        });
    }

    ngOnInit() {
        // this.getUserList();
        this.noData = false;
        this.mySelect = 8;
        this.l = 8;
        this.onChangeStatus(this.selectedActiveDeActive)
    }


    itemsPerPage(): void {
        this.l = this.mySelect;
        this.p = 1;
    }

    addEmployee() {
        this.router.navigate(['/admin/add-new-employee']);
    }

    activeDeactiveDataList = [
        {
            name: "All",
            value: 0
        },
        {
            name: "Active",
            value: 1
        },
        {
            name: "Deactive",
            value: 2
        }
    ]

    onChangeStatus(value: any) {
        this.p = 1
        this.adminLayoutService.getuserMaster().subscribe((Response: any) => {

            if (Response.meta.code == 200) {

                if (value == 0) {
                    this.userMasterList = Response.data;
                    this.allusermaster = this.userMasterList;
                    this.usermasterList = this.userMasterList
                }
                else if (value == 1) {
                    this.userMasterList = Response.data.filter((x: any) => {
                        return x.empCompanyInfoData?.status === 1;
                    });
                    this.allusermaster = this.userMasterList;
                    this.usermasterList = this.userMasterList
                }
                else if (value == 2) {
                    this.userMasterList = Response.data.filter((x: any) => {
                        return x.empCompanyInfoData == null || x.empCompanyInfoData?.status == 2
                    });
                    this.allusermaster = this.userMasterList;
                    this.usermasterList = this.userMasterList
                }
            }
        })

        // this.usermasterList = 
    }

    getUserList() {

        this.adminLayoutService.getuserMaster().subscribe((Response: any) => {

            if (Response.meta.code == 200) {

                this.userMasterList = Response.data;
                this.allusermaster = this.userMasterList;
                this.usermasterList = this.userMasterList
                this.noData = false;
            } else {
                this.noData = true;
            }
            //for select sub industry step
        }, (error) => {
            console.log(error.error.Message);
        });
    }

    generateLedger() {
        this.adminLayoutService.generateLedger().subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.commonService.notifier.notify('success', 'Ledger Created Successfully.')
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message)
            }
        })
    }

    statusUser(paramsObj) {

        let statususerModelObj = {
            "_id": paramsObj.id,
            "status": paramsObj.status
        };


        this.adminLayoutService.Statususer(statususerModelObj).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                // this.getUserList();
                this.onChangeStatus(this.selectedActiveDeActive)
                this.commonService.notifier.notify('success', Response.meta.message);
            }
            else {
                this.commonService.notifier.notify('success', Response.meta.message);
            }
        }, (error) => {
            console.log(error);
        });



    }

    search(value: string): void {

        this.usermasterList = this.allusermaster.filter((val) => JSON.stringify(val).toLowerCase().includes(value.toLowerCase()));
        this.userMasterList = this.usermasterList
        this.p = 1;
        if (this.usermasterList.length == 0) {
            this.noData = true;
        } else {
            this.noData = false;
        }
    }

    sortData(sort: Sort) {

        const data = this.userMasterList.slice();
        if (!sort.active || sort.direction === '') {
            this.usermasterList = data;
            return;
        }

        this.usermasterList = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'userName': return compare(a.userName, b.userName, isAsc);
                case 'email': return compare(a.email, b.email, isAsc);
                case 'roleName': return compare(a.roleName, b.roleName, isAsc);
                case 'status': return compare(a.status, b.status, isAsc);
                default: return 0;
            }
        });
    }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
