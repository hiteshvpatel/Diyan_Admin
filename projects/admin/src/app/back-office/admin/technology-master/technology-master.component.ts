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

declare const $: any;




@Component({
  selector: 'app-technology-master',
  templateUrl: './technology-master.component.html',
  styleUrls: ['./technology-master.component.scss']
})
export class TechnologyMasterComponent implements OnInit {

  ISeditTechnologymaster = false;
  technologymasterList: any[] = [];
  alltechnologymaster: any[] = [];
  technologyMasterList: any[] = [];
  l: number;
  p: number = 1;
  itemsPage: any;
  mySelect;
  technologymasterForm: FormGroup;
  x: number;
  t: number;
  listindex: number;
  technologymasterListlength: any;
  allimageList: any;

  get fTechnologynameData() { return this.technologymasterForm.controls; }
  submittedTechnologyMasterData = false;
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
  searchTerm: string;

  constructor(public commonService: CommonService, public storageService: StorageService, public adminLayoutService: AdminLayoutService, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private spinner: NgxSpinnerService) {
    let pagePermission = { module: "technologymaster" }
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
    this.ISeditTechnologymaster = false;
    this.getTechnologymasterList();
    this.defaultForm();
  }
  defaultForm() {
    this.technologymasterForm = this.fb.group({
      _id: [''],
      technologyName: ['', [Validators.required]],
    });
  }

  itemsPerPage(): void {
    this.l = this.mySelect;
  }


  addTechnologyMaster() {
    $("#add-documenttype-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
    this.ISeditTechnologymaster = false;
  }

  cancelTechnologymaster() {
    $("#add-documenttype-modal").modal("hide");
    this.defaultForm();
    this.ISeditTechnologymaster = false;
  }
  saveTechnologymaster() {


    if (this.technologymasterForm.invalid) {
      this.submittedTechnologyMasterData = true;
      return;
    }
    let documenttypemasterModelObj = {
      "technologyName": this.technologymasterForm.controls.technologyName.value,
    };

    this.adminLayoutService.SaveTechnologyMaster(documenttypemasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedTechnologyMasterData = false;
        this.getTechnologymasterList();
        this.defaultForm();
        this.ISeditTechnologymaster = false;
        this.commonService.notifier.notify('success', Response.meta.message);
        $("#add-documenttype-modal").modal("hide");
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  search(value: string): void {
    this.technologymasterList = this.alltechnologymaster.filter((val: any) => val.technologyName.toLowerCase().includes(value.toLowerCase()));
    this.p = 1;
    if (this.technologymasterList.length == 0) {
      this.noData = true;
    } else {
      this.noData = false;
    }
  }

  getTechnologymasterList() {

    this.adminLayoutService.getTechnologyMaster().subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.technologyMasterList = Response.data;
        this.technologymasterList = this.technologyMasterList
        this.alltechnologymaster = this.technologymasterList
        this.technologymasterList = this.technologyMasterList.slice();
        this.technologymasterListlength = Response.data.length;
        this.sortingList({ active: 'technologyName', direction: 'asc' })
        this.noData = false;
      } else {
        this.noData = true;
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }


  editTechnologymaster(paramsObj) {

    this.ISeditTechnologymaster = true;
    let Id: any = { '_id': paramsObj.id }
    this.adminLayoutService.getTechnologyMasterId(Id).subscribe((Response: any) => {

      this.technologymasterForm.controls._id.setValue(Response.data._id)
      this.technologymasterForm.controls.technologyName.setValue(Response.data.technologyName)
      $("#add-documenttype-modal").modal({ backdrop: 'static', keyboard: false, show: true });;

    }, (error) => {
      ////console.log(error);
      //this.commonService.notifier.notify('error', error.error.Message);
    });
  }
  updateTechnologymaster() {


    if (this.technologymasterForm.invalid) {
      this.submittedTechnologyMasterData = true;
      return;
    }
    let documenttypemasterModelObj = {
      "_id": this.technologymasterForm.controls._id.value,
      "technologyName": this.technologymasterForm.controls.technologyName.value,
    };

    this.adminLayoutService.UpdateTechnologyMaster(documenttypemasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedTechnologyMasterData = false;
        this.getTechnologymasterList();
        this.defaultForm();
        this.ISeditTechnologymaster = false;
        this.commonService.notifier.notify('success', Response.meta.message);
        $("#add-documenttype-modal").modal("hide");
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  statusTechnologymaster(paramsObj) {


    let statusTechnologymasterModelObj = {
      "_id": paramsObj.id,
      "status": paramsObj.status
    };


    this.adminLayoutService.StatusTechnologyMaster(statusTechnologymasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedTechnologyMasterData = false;
        this.getTechnologymasterList();
        this.defaultForm();
        this.ISeditTechnologymaster = false;
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

    const data = this.alltechnologymaster.slice();
    if (!sort.active || sort.direction === '') {
      this.technologymasterList = data;
      return;
    }

    this.technologymasterList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      switch (sort.active) {
        case 'technologyName': return compare(a.technologyName, b.technologyName, isAsc);
        default: return 0;
      }
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}