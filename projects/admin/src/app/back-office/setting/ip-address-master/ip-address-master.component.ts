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
import { stringify } from 'querystring';

declare const $: any;

interface roleMasterData {
    roleName: string;
}

@Component({
    selector: 'app-ip-address-master',
    templateUrl: './ip-address-master.component.html',
    styleUrls: ['./ip-address-master.component.css']
})
export class IpAddressMasterComponent implements OnInit {


    ISeditIpAddress = false;
    ipAddressList: roleMasterData[];
    alliPaddress: roleMasterData[];
    IpAddressList: roleMasterData[];
    l: number;
    p: number = 1;
    itemsPage: any;
    mySelect;
    ipAddressForm: FormGroup;
    x: number;
    t: number;
    listindex: number;
    ipAddressListLength: any;

    get fTitleData() { return this.ipAddressForm.controls; }
    get fPathData() { return this.ipAddressForm.controls; }
    submittedMenuData = false;
    noData;
    perentList: any;
    isView: boolean;
    isCreated: boolean;
    isUpdated: boolean;
    isDeleted: boolean;
    searchTerm: any;

    constructor(public commonService: CommonService, public storageService: StorageService, public adminLayoutService: AdminLayoutService, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private spinner: NgxSpinnerService) {
        let pagePermission = { module: "menumaster" }
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
        this.mySelect = 5;
        this.l = 10;
        this.ISeditIpAddress = false;
        this.getIpAddressList();
        this.defaultForm();
    }
    defaultForm() {
        this.ipAddressForm = this.fb.group({
            _id: ['0'],
            ipAddress: ['', [Validators.required]],
            description: [''],
        });
    }

    itemsPerPage(): void {
        this.l = this.mySelect;
    }

    addIpAddress() {
        $("#add-menu-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
        this.ISeditIpAddress = false;
    }

    cancelIpAddress() {
        $("#add-menu-modal").modal("hide");
        this.defaultForm();
        this.ISeditIpAddress = false;
    }

    saveIpAddress() {

        if (this.ipAddressForm.invalid) {
            this.submittedMenuData = true;
            return;
        }
        let ipAddressObj = {
            "ipAddress": this.ipAddressForm.controls.ipAddress.value,
            "description": this.ipAddressForm.controls.description.value,
        };
        this.adminLayoutService.saveIpAddress(ipAddressObj).subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                $("#add-menu-modal").modal("hide");
                this.submittedMenuData = false;
                this.getIpAddressList();
                this.defaultForm();
                this.ISeditIpAddress = false;
                this.commonService.notifier.notify('success', Response.meta.message);
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message);
            }
        }, (error) => {
            console.log(error);
        });
    }

    search(value: string): void {
        this.ipAddressList = this.alliPaddress.filter((val: any) => JSON.stringify(val).toLowerCase().includes(value.toLowerCase()));
        this.p = 1;
        if (this.ipAddressList.length == 0) {
            this.noData = true;
        } else {
            this.noData = false;
        }
    }

    getIpAddressList() {

        this.adminLayoutService.getIpAddressList().subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                this.IpAddressList = Response.data;
                this.ipAddressList = this.IpAddressList.sort((a: any, b: any) => a.order - b.order)
                this.alliPaddress = this.ipAddressList
                this.ipAddressList = this.IpAddressList.slice();
                this.ipAddressListLength = Response.data.length;
                this.noData = false;
            } else {
                this.noData = true;
            }
            //for select sub industry step
        }, (error) => {
            console.log(error.error.Message);
        });
    }

    editIpAddress(paramsObj) {

        this.ISeditIpAddress = true;
        let Id: any = { '_id': paramsObj.id }
        this.adminLayoutService.getIpAddressById(Id).subscribe((Response: any) => {

            this.ipAddressForm.controls._id.setValue(Response.data._id)
            this.ipAddressForm.controls.ipAddress.setValue(Response.data.ipAddress)
            this.ipAddressForm.controls.description.setValue(Response.data.description)
            $("#add-menu-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
        }, (error) => {
            ////console.log(error);
            //this.commonService.notifier.notify('error', error.error.Message);
        });
    }
    updateIpAddress() {

        if (this.ipAddressForm.invalid) {
            this.submittedMenuData = true;
            return;
        }
        let ipAddressModelObj = {
            "_id": this.ipAddressForm.controls._id.value,
            "ipAddress": this.ipAddressForm.controls.ipAddress.value,
            "description": this.ipAddressForm.controls.description.value,
        };

        this.adminLayoutService.updateIpAddress(ipAddressModelObj).subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                $("#add-menu-modal").modal("hide");
                this.submittedMenuData = false;
                this.getIpAddressList();
                this.defaultForm();
                this.ISeditIpAddress = false;
                this.commonService.notifier.notify('success', Response.meta.message);
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message);
            }
        }, (error) => {
            console.log(error);
        });
    }

    statusIP(paramsObj) {

        let statusmenuModelObj = {
            "_id": paramsObj.id,
            "status": paramsObj.status
        };

        this.adminLayoutService.statusIpAddress(statusmenuModelObj).subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                this.submittedMenuData = false;
                this.getIpAddressList();
                this.defaultForm();
                this.ISeditIpAddress = false;
                this.commonService.notifier.notify('success', Response.meta.message);
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message);
            }
        }, (error) => {
            console.log(error);
        });
    }

    numberOnly(event): boolean {

        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 45 || charCode > 57)) {
            return false;
        }
    }
}
