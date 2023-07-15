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
import { CompanyManagementService } from '../company-management.service';

declare const $: any;

interface templatetMasterData {
    templateName: string;
}


@Component({
    selector: 'app-template-master',
    templateUrl: './template-master.component.html',
    styleUrls: ['./template-master.component.scss']
})
export class TemplateMasterComponent implements OnInit {
    ISeditTemplateMaster = false;
    ISeditDocumentMaster = false;
    // documentmasterList: documentMasterData[];
    // alldocumentmaster: documentMasterData[];
    // documentMasterList: documentMasterData[];
    l: number;
    p: number = 1;
    itemsPage: any;
    mySelect;
    documentmasterForm: FormGroup;
    x: number;
    t: number;
    listindex: number;
    documentmasterListlength: any;
    allimageList: any;
    templateName: any;
    templeteName: boolean = false;
    templeteMasterList: any[] = [];
    templeteId: any;
    allTempleteMasterList: any[] = [];

    get fDocumentnameData() { return this.documentmasterForm.controls; }
    submitteddocumentMasterData = false;
    public imagePath;
    imgURL: any;
    message: string;
    noData;
    noimageData;
    searchTerm: string;

    activeTab: number;
    imageList: any;
    //image: any;
    file: any;
    Image: any;
    isView: boolean;
    isCreated: boolean;
    isUpdated: boolean;
    isDeleted: boolean;

    itemName: boolean = false;
    amount: boolean = false;
    discount: boolean = false;
    cgst: boolean = false;
    sgst: boolean = false;
    igst: boolean = false;
    quantity: boolean = false;
    hours: boolean = false;
    rate: boolean = false;
    hsnCode: boolean = false;
    description: boolean = false;


    constructor(public commonService: CommonService, public adminLayoutService: AdminLayoutService, public storageService: StorageService, public companyManagementService: CompanyManagementService, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private spinner: NgxSpinnerService) {
        let pagePermission = { module: "templatemaster" }
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
        this.ISeditDocumentMaster = false;
        this.getTempleteList()
        // this.defaultForm();
    }
    itemsPerPage(): void {
        this.l = this.mySelect;
    }
    search(value: string): void {

        this.templeteMasterList = this.allTempleteMasterList.filter((val) => val.templateName.toLowerCase().includes(value.toLowerCase()));
        this.p = 1;

        if (this.templeteMasterList.length == 0) {
            this.noData = true;
        } else {
            this.noData = false;
        }
    }

    // defaultForm() {
    //     this.documentmasterForm = this.fb.group({
    //         _id: [''],
    //         documentName: ['', [Validators.required]],
    //     });
    // }

    addTempatemaster() {
        $("#add-template-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
        this.ISeditTemplateMaster = false;
        this.templateName = '';
        this.templeteName = false;
        this.itemName = false;
        this.amount = false;
        this.discount = false;
        this.cgst = false;
        this.sgst = false;
        this.igst = false;
        this.quantity = false;
        this.hours = false;
        this.rate = false;
        this.hsnCode = false;
        this.description = false;
    }
    cancelTemplatemaster() {
        $("#add-template-modal").modal("hide");
        this.ISeditTemplateMaster = false;
        this.templateName = '';
        this.templeteName = false;
        this.itemName = false;
        this.amount = false;
        this.discount = false;
        this.cgst = false;
        this.sgst = false;
        this.igst = false;
        this.quantity = false;
        this.hours = false;
        this.rate = false;
        this.hsnCode = false;
        this.description = false;
    }

    setIsEventName(event: any, checkBoxName: string) {

        if (checkBoxName == 'itemName') {
            this.itemName = event.checked;
        }
        else if (checkBoxName == 'amount') {
            this.amount = event.checked;
        }
        else if (checkBoxName == 'discount') {
            this.discount = event.checked;
        }
        else if (checkBoxName == 'cgst') {
            this.cgst = event.checked;
        }
        else if (checkBoxName == 'sgst') {
            this.sgst = event.checked;
        }
        else if (checkBoxName == 'igst') {
            this.igst = event.checked;
        }
        else if (checkBoxName == 'quantity') {
            this.quantity = event.checked;
        }
        else if (checkBoxName == 'hours') {
            this.hours = event.checked;
        }
        else if (checkBoxName == 'rate') {
            this.rate = event.checked;
        }
        else if (checkBoxName == 'hsnCode') {
            this.hsnCode = event.checked;
        }
        else if (checkBoxName == 'description') {
            this.description = event.checked;
        }
    }

    onTempleteName(e: any) {
        if (e) {
            this.templeteName = false;
        }
        else {
            this.templeteName = true;
        }
    }

    getTempleteList() {
        this.companyManagementService.getTempleteList().subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.allTempleteMasterList = Response.data;
                this.templeteMasterList = this.allTempleteMasterList;
                this.noData = false;
                this.sortingList({ active: 'templateName', direction: 'asc' })
            }
            else {
                this.noData = true
            }
        })
    }

    saveTemplatemaster() {

        if (!this.templateName || this.templateName == null) {
            this.templeteName = true;
            return
        }

        let templeteObj = {
            templateName: this.templateName,
            itemName: this.itemName,
            amount: this.amount,
            discount: this.discount,
            CGST: this.cgst,
            SGST: this.sgst,
            IGST: this.igst,
            description: this.description,
            HSNCode: this.hsnCode,
            hours: this.hours,
            rate: this.rate,
            quantity: this.quantity,
        }
        this.companyManagementService.SaveTempleteMaster(templeteObj).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.templateName = '';
                this.templeteName = false;
                this.itemName = false;
                this.amount = false;
                this.discount = false;
                this.cgst = false;
                this.sgst = false;
                this.igst = false;
                this.quantity = false;
                this.hours = false;
                this.rate = false;
                this.hsnCode = false;
                this.description = false;
                this.ISeditTemplateMaster = false;
                this.getTempleteList();
                $("#add-template-modal").modal("hide");
                this.commonService.notifier.notify('success', "Template Saved Successfully.");
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message);
            }
        });

    }

    updateTemplatemaster() {

        if (!this.templateName || this.templateName == null) {
            this.templeteName = true;
            return
        }

        let templeteObj = {
            _id: this.templeteId,
            templateName: this.templateName,
            itemName: this.itemName,
            amount: this.amount,
            discount: this.discount,
            CGST: this.cgst,
            SGST: this.sgst,
            IGST: this.igst,
            description: this.description,
            HSNCode: this.hsnCode,
            hours: this.hours,
            rate: this.rate,
            quantity: this.quantity,
        }
        this.companyManagementService.UpdateTempleteMaster(templeteObj).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.templateName = '';
                this.templeteName = false;
                this.itemName = false;
                this.amount = false;
                this.discount = false;
                this.cgst = false;
                this.sgst = false;
                this.igst = false;
                this.quantity = false;
                this.hours = false;
                this.rate = false;
                this.hsnCode = false;
                this.description = false;
                this.ISeditTemplateMaster = false;
                $("#add-template-modal").modal("hide");
                this.getTempleteList();
                this.commonService.notifier.notify('success', "Template Updated Successfully.");
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message);
            }
        });

    }

    getTempleteListByID(templeteId) {
        this.ISeditTemplateMaster = true;
        let Obj = {
            _id: templeteId
        }
        this.companyManagementService.getTempleteListById(Obj).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.templateName = Response.data.templateName;
                this.itemName = Response.data.itemName;
                this.amount = Response.data.amount;
                this.discount = Response.data.discount;
                this.cgst = Response.data.CGST;
                this.sgst = Response.data.SGST;
                this.igst = Response.data.IGST;
                this.description = Response.data.description;
                this.hsnCode = Response.data.HSNCode;
                this.hours = Response.data.hours;
                this.rate = Response.data.rate;
                this.quantity = Response.data.quantity;
                this.templeteId = Response.data._id;
                $("#add-template-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
            }
        })

    }


    sortingList(sort: Sort) {

        const data = this.allTempleteMasterList.slice();
        if (!sort.active || sort.direction === '') {
            this.templeteMasterList = data;
            return;
        }



        this.templeteMasterList = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';

            switch (sort.active) {
                case 'templateName': return compare(a.templateName, b.templateName, isAsc);
                default: return 0;
            }
        });
    }



}
function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
