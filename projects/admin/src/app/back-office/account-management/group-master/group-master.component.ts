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
  selector: 'app-group-master',
  templateUrl: './group-master.component.html',
  styleUrls: ['./group-master.component.scss']
})
export class GroupMasterComponent implements OnInit {

  ISeditGroupMaster = false;
  groupmasterList: any[] = [];
  allGroupMaster: any[] = [];
  groupMasterList: any[] = [];
  activeParentGroupList: any[] = [];
  l: number;
  p: number = 1;
  itemsPage: any;
  mySelect;
  groupMasterForm: FormGroup;
  x: number;
  t: number;
  searchDocument: string;
  listindex: number;
  groupmasterListlength: any;
  allimageList: any;
  isEditAllows: boolean = true;

  get fGroupData() { return this.groupMasterForm.controls; }
  submittedGroupMaster = false;
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
    let pagePermission = { module: "groupmaster" }
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
    this.ISeditGroupMaster = false;
    this.getGroupMasterList();

    this.defaultForm();
  }

  defaultForm() {
    this.groupMasterForm = this.fb.group({
      _id: [''],
      parentID: [null],
      groupName: ['', [Validators.required]],
    });
  }

  itemsPerPage(): void {
    this.l = this.mySelect;
  }

  getActiveParentGroupList() {
    this.accountManagementService.activeParentGroupList().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.activeParentGroupList = Response.data;
      }
    })
  }


  addGroupMaster() {
    $("#add-group-modal").modal({ backdrop: 'static', keyboard: false, show: true });
    this.getActiveParentGroupList();
    this.ISeditGroupMaster = false;
  }

  cancelGroupMaster() {
    $("#add-group-modal").modal("hide");
    this.defaultForm();
    this.ISeditGroupMaster = false;
  }
  setIsEditAllows(event: any) {
    this.isEditAllows = event.target.checked;
  }
  saveGroupMaster() {


    if (this.groupMasterForm.invalid) {
      this.submittedGroupMaster = true;
      return;
    }
    let documentmasterModelObj = {
      groupName: this.groupMasterForm.controls.groupName.value,
      parentID: this.groupMasterForm.controls.parentID.value,
      isEditAllows: this.isEditAllows
    };


    this.accountManagementService.SaveGroupMaster(documentmasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedGroupMaster = false;
        this.getGroupMasterList();
        this.defaultForm();
        this.ISeditGroupMaster = false;
        this.commonService.notifier.notify('success', "Group Master Saved Successfully");
        $("#add-group-modal").modal("hide");
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  search(value: string): void {
    this.groupmasterList = this.allGroupMaster.filter((val: any) => val.groupName.toLowerCase().includes(value.toLowerCase()));
    this.p = 1;
    if (this.groupmasterList.length == 0) {
      this.noData = true;
    } else {
      this.noData = false;
    }
  }

  getGroupMasterList() {

    this.accountManagementService.getGroupMasterDetailsList().subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.groupMasterList = Response.data;
        this.groupmasterList = this.groupMasterList
        this.allGroupMaster = this.groupmasterList
        this.groupmasterList = this.groupMasterList.slice();
        this.groupmasterListlength = Response.data.length;
        this.sortingList({ active: 'groupName', direction: 'asc' })
        this.noData = false;
      } else {
        this.noData = true;
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }


  editGroupMaster(paramsObj) {
    this.getActiveParentGroupList();
    this.ISeditGroupMaster = true;
    let Id: any = { '_id': paramsObj.id }
    this.accountManagementService.getGroupMasterDetailsByID(Id).subscribe((Response: any) => {

      this.groupMasterForm.controls._id.setValue(Response.data._id)
      this.groupMasterForm.controls.groupName.setValue(Response.data.groupName)
      this.groupMasterForm.controls.parentID.setValue(Response.data.parentID)
      this.isEditAllows = Response.data.isEditAllows;
      $("#add-group-modal").modal({ backdrop: 'static', keyboard: false, show: true });;

    }, (error) => {
      ////console.log(error);
      //this.commonService.notifier.notify('error', error.error.Message);
    });
  }
  updateGroupmaster() {


    if (this.groupMasterForm.invalid) {
      this.submittedGroupMaster = true;
      return;
    }
    let documentmasterModelObj = {
      "_id": this.groupMasterForm.controls._id.value,
      "groupName": this.groupMasterForm.controls.groupName.value,
      "parentID": this.groupMasterForm.controls.parentID.value,
      "isEditAllows": this.isEditAllows
    };

    this.accountManagementService.UpdateGroupMaster(documentmasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedGroupMaster = false;
        this.getGroupMasterList();
        this.defaultForm();
        this.ISeditGroupMaster = false;
        this.commonService.notifier.notify('success', "Group Master Updated Successfully");
        $("#add-group-modal").modal("hide");
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  statusGroupMaster(paramsObj) {


    let statusgroupmasterModelObj = {
      "_id": paramsObj.id,
      "status": paramsObj.status
    };


    this.accountManagementService.StatusGroupMaster(statusgroupmasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedGroupMaster = false;
        this.getGroupMasterList();
        this.defaultForm();
        this.ISeditGroupMaster = false;
        if (paramsObj.status == 1) {
          this.commonService.notifier.notify('success', "Group Master Active Successfully.");
        }
        else if (paramsObj.status == 2) {
          this.commonService.notifier.notify('success', "Group Master Deactive Successfully.");
        }
        // this.commonService.notifier.notify('success', Response.meta.message);
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  sortingList(sort: Sort) {

    const data = this.allGroupMaster.slice();
    if (!sort.active || sort.direction === '') {
      this.groupmasterList = data;
      return;
    }



    this.groupmasterList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      switch (sort.active) {
        case 'groupName': return compare(a.groupName, b.groupName, isAsc);
        case 'isEditAllows': return compare(a.isEditAllows, b.isEditAllows, isAsc);
        default: return 0;
      }
    });
  }

}

function compare(a: number | string | Date | Boolean, b: number | string | Date | Boolean, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}