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

declare const $: any;

@Component({
  selector: 'app-unit-master',
  templateUrl: './unit-master.component.html',
  styleUrls: ['./unit-master.component.scss']
})
export class UnitMasterComponent implements OnInit {

  ISeditUnitMaster = false;
  unitmasterList: any[] = [];
  allUnitMaster: any[] = [];
  unitMasterList: any[] = [];
  l: number;
  p: number = 1;
  itemsPage: any;
  mySelect;
  unitMasterForm: FormGroup;
  x: number;
  t: number;
  searchDocument: string;
  listindex: number;
  unitmasterListlength: any;
  allimageList: any;

  get fUnitData() { return this.unitMasterForm.controls; }
  submittedUnitMaster = false;
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


  constructor(public commonService: CommonService, public adminLayoutService: AdminLayoutService, public storageService: StorageService, public accountManagementService: AccountManagementService, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private spinner: NgxSpinnerService) {
    let pagePermission = { module: "unitmaster" }
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
    this.ISeditUnitMaster = false;
    this.getUnitMasterList();
    this.defaultForm();
  }

  defaultForm() {
    this.unitMasterForm = this.fb.group({
      _id: [''],
      unit: ['', [Validators.required]],
    });
  }

  itemsPerPage(): void {
    this.l = this.mySelect;
  }


  addUnitMaster() {
    $("#add-unit-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
    this.ISeditUnitMaster = false;
  }

  cancelUnitMaster() {
    $("#add-unit-modal").modal("hide");
    this.defaultForm();
    this.ISeditUnitMaster = false;
  }
  saveUnitMaster() {


    if (this.unitMasterForm.invalid) {
      this.submittedUnitMaster = true;
      return;
    }
    let unitmasterModelObj = {
      unit: this.unitMasterForm.controls.unit.value,
    };


    this.accountManagementService.SaveUnitMaster(unitmasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedUnitMaster = false;
        this.getUnitMasterList();
        this.defaultForm();
        this.ISeditUnitMaster = false;
        this.commonService.notifier.notify('success', "Unit Master Saved Successfully");
        $("#add-unit-modal").modal("hide");
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  search(value: string): void {
    this.unitmasterList = this.allUnitMaster.filter((val: any) => val.unit.toLowerCase().includes(value.toLowerCase()));
    this.p = 1;
    if (this.unitmasterList.length == 0) {
      this.noData = true;
    } else {
      this.noData = false;
    }
  }

  getUnitMasterList() {

    this.accountManagementService.getUnitMasterDetailsList().subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.unitMasterList = Response.data;
        this.unitmasterList = this.unitMasterList
        this.allUnitMaster = this.unitmasterList
        this.unitmasterList = this.unitMasterList.slice();
        this.unitmasterListlength = Response.data.length;
        this.sortingList({ active: 'unit', direction: 'asc' })
        this.noData = false;
      } else {
        this.noData = true;
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }


  editUnitMaster(paramsObj) {

    this.ISeditUnitMaster = true;
    let Id: any = { '_id': paramsObj.id }
    this.accountManagementService.getUnitMasterDetailsByID(Id).subscribe((Response: any) => {

      this.unitMasterForm.controls._id.setValue(Response.data._id)
      this.unitMasterForm.controls.unit.setValue(Response.data.unit)
      $("#add-unit-modal").modal({ backdrop: 'static', keyboard: false, show: true });;

    }, (error) => {
      ////console.log(error);
      //this.commonService.notifier.notify('error', error.error.Message);
    });
  }
  updateUnitmaster() {


    if (this.unitMasterForm.invalid) {
      this.submittedUnitMaster = true;
      return;
    }
    let unitmasterModelObj = {
      "_id": this.unitMasterForm.controls._id.value,
      "unit": this.unitMasterForm.controls.unit.value
    };

    this.accountManagementService.UpdateUnitMaster(unitmasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedUnitMaster = false;
        this.getUnitMasterList();
        this.defaultForm();
        this.ISeditUnitMaster = false;
        this.commonService.notifier.notify('success', "Unit Master Updated Successfully");
        $("#add-unit-modal").modal("hide");
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  statusUnitMaster(paramsObj) {


    let statusgroupmasterModelObj = {
      "_id": paramsObj.id,
      "status": paramsObj.status
    };


    this.accountManagementService.StatusUnitMaster(statusgroupmasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedUnitMaster = false;
        this.getUnitMasterList();
        this.defaultForm();
        this.ISeditUnitMaster = false;
        if (paramsObj.status == 1) {
          this.commonService.notifier.notify('success', "Unit Master Active Successfully.");
        }
        else if (paramsObj.status == 2) {
          this.commonService.notifier.notify('success', "Unit Master Deactive Successfully.");
        }
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  sortingList(sort: Sort) {

    const data = this.allUnitMaster.slice();
    if (!sort.active || sort.direction === '') {
      this.unitmasterList = data;
      return;
    }

    this.unitmasterList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      switch (sort.active) {
        case 'unit': return compare(a.unit, b.unit, isAsc);
        default: return 0;
      }
    });
  }

}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}