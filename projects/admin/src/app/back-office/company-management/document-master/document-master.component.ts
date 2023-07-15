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

interface documentMasterData {
    documentName: string;
}


@Component({
    selector: 'app-document-master',
    templateUrl: './document-master.component.html',
    styleUrls: ['./document-master.component.scss']
})
export class DocumentMasterComponent implements OnInit {
    ISeditDocumentMaster = false;
    documentmasterList: documentMasterData[];
    alldocumentmaster: documentMasterData[];
    documentMasterList: documentMasterData[];
    l: number;
    p: number = 1;
    itemsPage: any;
    mySelect;
    documentmasterForm: FormGroup;
    x: number;
    t: number;
    searchDocument: string;
    listindex: number;
    documentmasterListlength: any;
    allimageList: any;

    get fDocumentnameData() { return this.documentmasterForm.controls; }
    submitteddocumentMasterData = false;
    public imagePath;
    imgURL: any;
    message: string;
    noData;
    noimageData;

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


    constructor(public commonService: CommonService, public adminLayoutService: AdminLayoutService, public storageService: StorageService, public companyManagementService: CompanyManagementService, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private spinner: NgxSpinnerService) {
        let pagePermission = { module: "documentmaster" }
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
        this.getDocumentmasterList();
        this.defaultForm();
    }

    defaultForm() {
        this.documentmasterForm = this.fb.group({
            _id: [''],
            documentName: ['', [Validators.required]],
        });
    }

    itemsPerPage(): void {
        this.l = this.mySelect;
    }


    addDocumentmaster() {
        $("#add-document-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
        this.ISeditDocumentMaster = false;
    }

    cancelDocumentmaster() {
        $("#add-document-modal").modal("hide");
        this.defaultForm();
        this.ISeditDocumentMaster = false;
    }
    saveDocumentmaster() {


        if (this.documentmasterForm.invalid) {
            this.submitteddocumentMasterData = true;
            return;
        }
        let documentmasterModelObj = {
            "documentName": this.documentmasterForm.controls.documentName.value,

        };


        this.companyManagementService.SavedocumentMaster(documentmasterModelObj).subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                this.submitteddocumentMasterData = false;
                this.getDocumentmasterList();
                this.defaultForm();
                this.ISeditDocumentMaster = false;
                this.commonService.notifier.notify('success', "Document Master Uploaded Successfully", Response.meta.message);
                $("#add-document-modal").modal("hide");
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message);
            }
        }, (error) => {
            console.log(error);
        });
    }

    search(value: string): void {
        this.documentmasterList = this.alldocumentmaster.filter((val: any) => val.documentName.toLowerCase().includes(value.toLowerCase()));
        this.p = 1;
        if (this.documentmasterList.length == 0) {
            this.noData = true;
        } else {
            this.noData = false;
        }
    }

    getDocumentmasterList() {

        this.companyManagementService.getdocumentMaster().subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                this.documentMasterList = Response.data;
                this.documentmasterList = this.documentMasterList
                this.alldocumentmaster = this.documentmasterList
                this.documentmasterList = this.documentMasterList.slice();
                this.documentmasterListlength = Response.data.length;
                this.sortingList({ active: 'documentName', direction: 'asc' });
                this.noData = false;
            } else {
                this.noData = true;
            }
            //for select sub industry step
        }, (error) => {
            console.log(error.error.Message);
        });
    }


    editDocumentmaster(paramsObj) {

        this.ISeditDocumentMaster = true;
        let Id: any = { '_id': paramsObj.id }
        this.companyManagementService.getdocumentMasterId(Id).subscribe((Response: any) => {

            this.documentmasterForm.controls._id.setValue(Response.data._id)
            this.documentmasterForm.controls.documentName.setValue(Response.data.documentName)
            $("#add-document-modal").modal({ backdrop: 'static', keyboard: false, show: true });;

        }, (error) => {
            ////console.log(error);
            //this.commonService.notifier.notify('error', error.error.Message);
        });
    }
    updateDocumentmaster() {


        if (this.documentmasterForm.invalid) {
            this.submitteddocumentMasterData = true;
            return;
        }
        let documentmasterModelObj = {
            "_id": this.documentmasterForm.controls._id.value,
            "documentName": this.documentmasterForm.controls.documentName.value,
        };

        this.companyManagementService.UpdatedocumentMaster(documentmasterModelObj).subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                this.submitteddocumentMasterData = false;
                this.getDocumentmasterList();
                this.defaultForm();
                this.ISeditDocumentMaster = false;
                this.commonService.notifier.notify('success', "Document Master Updated Successfully", Response.meta.message);
                $("#add-document-modal").modal("hide");
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message);
            }
        }, (error) => {
            console.log(error);
        });
    }

    statusDocumentmaster(paramsObj) {


        let statusdocumentmasterModelObj = {
            "_id": paramsObj.id,
            "status": paramsObj.status
        };


        this.companyManagementService.StatusdocumentMaster(statusdocumentmasterModelObj).subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                this.submitteddocumentMasterData = false;
                this.getDocumentmasterList();
                this.defaultForm();
                this.ISeditDocumentMaster = false;
                this.commonService.notifier.notify('success', Response.meta.message);
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message);
            }
        }, (error) => {
            console.log(error);
        });
    }

    sortingList(sort: Sort) {

        const data = this.alldocumentmaster.slice();
        if (!sort.active || sort.direction === '') {
            this.documentmasterList = data;
            return;
        }



        this.documentmasterList = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';

            switch (sort.active) {
                case 'documentName': return compare(a.documentName, b.documentName, isAsc);
                default: return 0;
            }
        });
    }

}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
