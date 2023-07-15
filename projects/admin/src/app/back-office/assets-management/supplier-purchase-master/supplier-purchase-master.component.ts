import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { AssetsManagementService } from '../assets-management.service';
import { environment } from '../../../../environments/environment';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

declare const $: any;


@Component({
  selector: 'app-supplier-purchase-master',
  templateUrl: './supplier-purchase-master.component.html',
  styleUrls: ['./supplier-purchase-master.component.scss']
})
export class SupplierPurchaseMasterComponent implements OnInit {

  supplierPurchaseList: any[] = [];
  allsupplierPurchase: any[] = [];
  SupplierPurchaseList: any[] = [];
  l: number;
  p: number = 1;
  itemsPage: any;
  mySelect;
  supplierPurchaseListlength: any;
  purchaseList: any;
  noData;
  isView: Boolean
  isCreated: Boolean
  isUpdated: Boolean
  isDeleted: Boolean

  constructor(public commonService: CommonService, public adminLayoutService: AdminLayoutService, public storageService: StorageService, public assetsmanagementService: AssetsManagementService, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private spinner: NgxSpinnerService) {
    let pagePermission = { module: "supplierpurchasemaster" }
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
    this.getSupplierPurchaseList();
  }

  itemsPerPage(): void {
    this.l = this.mySelect;
  }

  search(value: string): void {
    this.supplierPurchaseList = this.allsupplierPurchase.filter((val: any) => JSON.stringify(val).toLowerCase().includes(value.toLowerCase()));
    this.p = 1;
    if (this.supplierPurchaseList.length == 0) {

      this.noData = true;
    } else {
      this.noData = false;
    }
  }

  getSupplierPurchaseList() {

    this.assetsmanagementService.getSupplierPurchaseMaster().subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.SupplierPurchaseList = Response.data;
        this.supplierPurchaseList = this.SupplierPurchaseList;
        this.allsupplierPurchase = this.supplierPurchaseList
        this.supplierPurchaseList = this.SupplierPurchaseList.slice();
        this.supplierPurchaseListlength = Response.data.length;
        this.sortingList({ active: 'supplierName', direction: 'asc' })
        this.noData = false;
      } else {
        this.noData = true;
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }

  sortingList(sort: Sort) {

    const data = this.allsupplierPurchase.slice();
    if (!sort.active || sort.direction === '') {
      this.supplierPurchaseList = data;
      return;
    }



    this.supplierPurchaseList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      if (sort.active == 'purchaseDate') {
        console.log(new Date(moment(a.purchaseDate).format('yyyy-MM-DD')))
      }

      switch (sort.active) {
        case 'supplierName': return compare(a.supplierName, b.supplierName, isAsc);
        case 'InvoiceNumber': return compare(a.InvoiceNumber, b.InvoiceNumber, isAsc);
        case 'purchaseDate': return compare(new Date(moment(a.purchaseDate).format('yyyy-MM-DD')), new Date(moment(b.purchase).format('yyyy-MM-DD')), isAsc);
        default: return 0;
      }
    });
  }

}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}