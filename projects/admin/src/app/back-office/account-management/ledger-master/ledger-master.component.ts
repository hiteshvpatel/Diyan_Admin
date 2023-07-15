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
  selector: 'app-ledger-master',
  templateUrl: './ledger-master.component.html',
  styleUrls: ['./ledger-master.component.scss']
})
export class LedgerMasterComponent implements OnInit {

  ISeditLedgerMaster = false;
  ledgermasterList: any[] = [];
  allLedgerMaster: any[] = [];
  ledgerMasterList: any[] = [];
  l: number;
  p: number = 1;
  itemsPage: any;
  mySelect;
  ledgerMasterForm: FormGroup;
  x: number;
  t: number;
  searchDocument: string;
  listindex: number;
  ledgermasterListlength: any;
  allimageList: any;
  activeGroupMasterList: any[] = [];
  activeUnitMasterList: any[] = [];

  get fLedgerData() { return this.ledgerMasterForm.controls; }
  submittedLedgerMaster = false;
  isEditable: any;
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
    let pagePermission = { module: "ledgermaster" }
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
    this.ISeditLedgerMaster = false;
    this.getGroupMasterActiveList();
    this.getUnitMasterActiveList();
    this.getLedgerMasterList();
    this.defaultForm();
  }

  defaultForm() {
    this.ledgerMasterForm = this.fb.group({
      _id: [''],
      groupId: [, [Validators.required]],
      unitId: [],
      ledger: ['', [Validators.required]],
    });
  }

  getGroupMasterActiveList() {
    this.accountManagementService.getGroupMasterActiveList().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.activeGroupMasterList = Response.data;
      }
    })
  }
  getUnitMasterActiveList() {
    this.accountManagementService.getUnitMasterActiveList().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.activeUnitMasterList = Response.data;
      }
    })
  }

  itemsPerPage(): void {
    this.l = this.mySelect;
  }


  addLedgerMaster() {
    $("#add-ledger-modal").modal({ backdrop: 'static', keyboard: false, show: true });
    this.ISeditLedgerMaster = false;
  }

  cancelLedgerMaster() {
    $("#add-ledger-modal").modal("hide");
    this.defaultForm();
    this.ISeditLedgerMaster = false;
  }
  saveLedgerMaster() {


    if (this.ledgerMasterForm.invalid) {
      this.submittedLedgerMaster = true;
      return;
    }
    let ledgermasterModelObj = {
      groupId: this.ledgerMasterForm.controls.groupId.value,
      unitId: this.ledgerMasterForm.controls.unitId.value == null ? '' : this.ledgerMasterForm.controls.unitId.value,
      ledger: this.ledgerMasterForm.controls.ledger.value,
      isEditable: true
    };


    this.accountManagementService.SaveLedgerMaster(ledgermasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedLedgerMaster = false;
        this.getLedgerMasterList();
        this.defaultForm();
        this.ISeditLedgerMaster = false;
        this.commonService.notifier.notify('success', "Ledger Master Saved Successfully");
        $("#add-ledger-modal").modal("hide");
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  search(value: string): void {
    this.ledgermasterList = this.allLedgerMaster.filter((val: any) => JSON.stringify(val).toLowerCase().includes(value.toLowerCase()));
    this.p = 1;
    if (this.ledgermasterList.length == 0) {
      this.noData = true;
    } else {
      this.noData = false;
    }
  }

  getLedgerMasterList() {

    this.accountManagementService.getLedgerMasterDetailsList().subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.ledgerMasterList = Response.data;
        this.ledgermasterList = this.ledgerMasterList
        this.allLedgerMaster = this.ledgermasterList
        this.ledgermasterList = this.ledgerMasterList.slice();
        this.ledgermasterListlength = Response.data.length;
        this.sortingList({ active: 'ledger', direction: 'asc' })
        this.noData = false;
      } else {
        this.noData = true;
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }


  editLedgerMaster(paramsObj) {

    this.ISeditLedgerMaster = true;
    let Id: any = { '_id': paramsObj.id }
    this.accountManagementService.getLedgerMasterDetailsByID(Id).subscribe((Response: any) => {

      this.ledgerMasterForm.controls._id.setValue(Response.data._id);
      this.ledgerMasterForm.controls.ledger.setValue(Response.data.ledger);
      this.ledgerMasterForm.controls.groupId.setValue(Response.data.groupId);
      this.ledgerMasterForm.controls.unitId.setValue(Response.data.unitId);
      this.isEditable = {
        isEditable: Response.data.isEditable,
        groupName: Response.data.groupName,
        ledger: Response.data.ledger,
      };
      $("#add-ledger-modal").modal({ backdrop: 'static', keyboard: false, show: true });

    }, (error) => {
      ////console.log(error);
      //this.commonService.notifier.notify('error', error.error.Message);
    });
  }
  updateLedgermaster() {


    if (this.ledgerMasterForm.invalid) {
      this.submittedLedgerMaster = true;
      return;
    }
    let ledgermasterModelObj = {
      _id: this.ledgerMasterForm.controls._id.value,
      groupId: this.ledgerMasterForm.controls.groupId.value,
      unitId: this.ledgerMasterForm.controls.unitId.value == null ? '' : this.ledgerMasterForm.controls.unitId.value,
      ledger: this.ledgerMasterForm.controls.ledger.value,
      isEditable: true
    };

    this.accountManagementService.UpdateLedgerMaster(ledgermasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedLedgerMaster = false;
        this.getLedgerMasterList();
        this.defaultForm();
        this.ISeditLedgerMaster = false;
        this.commonService.notifier.notify('success', "Ledger Master Updated Successfully");
        $("#add-ledger-modal").modal("hide");
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  statusLedgerMaster(paramsObj) {


    let statusgroupmasterModelObj = {
      "_id": paramsObj.id,
      "status": paramsObj.status
    };


    this.accountManagementService.StatusLedgerMaster(statusgroupmasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedLedgerMaster = false;
        this.getLedgerMasterList();
        this.defaultForm();
        this.ISeditLedgerMaster = false;
        if (paramsObj.status == 1) {
          this.commonService.notifier.notify('success', "Ledger Master Active Successfully.");
        }
        else if (paramsObj.status == 2) {
          this.commonService.notifier.notify('success', "Ledger Master Deactive Successfully.");
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

    const data = this.allLedgerMaster.slice();
    if (!sort.active || sort.direction === '') {
      this.ledgermasterList = data;
      return;
    }



    this.ledgermasterList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      switch (sort.active) {
        case 'ledger': return compare(a.ledger, b.ledger, isAsc);
        case 'unit': return compare(a.unit, b.unit, isAsc);
        case 'groupName': return compare(a.groupName, b.groupName, isAsc);
        default: return 0;
      }
    });
  }

}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
