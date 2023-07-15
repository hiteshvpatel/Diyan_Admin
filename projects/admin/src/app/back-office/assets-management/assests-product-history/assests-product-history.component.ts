import { Component, OnInit } from '@angular/core';
import { AdminLayoutService } from '../../../layouts/admin-layout/admin-layout.service';
import { CommonService } from '../../../shared/common.service';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { Sort } from '@angular/material/sort';
import { StorageService } from '../../../shared/storage.service';
import { AssetsManagementService } from '../assets-management.service';
import * as moment from 'moment';

@Component({
  selector: 'app-assests-product-history',
  templateUrl: './assests-product-history.component.html',
  styleUrls: ['./assests-product-history.component.css']
})
export class AssestsProductHistoryComponent implements OnInit {

  assetsProductHistoryList: any[] = [];
  allAssetsProductHistoryList: any[] = [];
  AssetsProductHistoryList: any[] = [];
  l: number;
  p: number = 1;
  itemsPage: any;
  mySelect;
  assetsProductHistoryListlength: any;
  noData;
  isView: Boolean
  isCreated: Boolean
  isUpdated: Boolean
  isDeleted: Boolean;
  assestProductId: any;

  constructor(public commonService: CommonService, public route: ActivatedRoute, public adminLayoutService: AdminLayoutService, public storageService: StorageService, public assetsmanagementService: AssetsManagementService, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private spinner: NgxSpinnerService) {
    let pagePermission = { module: "productmaster" }
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

    this.route.params.subscribe((x: any) => {
      this.assestProductId = x.id;
    })

  }

  ngOnInit() {
    this.noData = false;
    this.mySelect = 5;
    this.l = 10;
    this.getAssetsProductHistoryList();
  }

  itemsPerPage(): void {
    this.l = this.mySelect;
  }

  search(value: string): void {
    this.assetsProductHistoryList = this.allAssetsProductHistoryList.filter((val: any) => JSON.stringify(val).toLowerCase().includes(value.toLowerCase()));
    this.p = 1;
    if (this.assetsProductHistoryList.length == 0) {
      this.noData = true;
    } else {
      this.noData = false;
    }
  }

  getAssetsProductHistoryList() {
    let Obj = {
      AssetProductId: this.assestProductId
    }

    this.assetsmanagementService.getAssetsProductHistoryList(Obj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.AssetsProductHistoryList = Response.data;
        this.assetsProductHistoryList = this.AssetsProductHistoryList;
        this.allAssetsProductHistoryList = this.assetsProductHistoryList
        this.assetsProductHistoryList = this.AssetsProductHistoryList.slice();
        this.assetsProductHistoryListlength = Response.data.length;
        this.sortingList({ active: 'employeeName', direction: 'asc' })
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

    const data = this.allAssetsProductHistoryList.slice();
    if (!sort.active || sort.direction === '') {
      this.assetsProductHistoryList = data;
      return;
    }

    this.assetsProductHistoryList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'employeeName': return compare(a.employeeName, b.employeeName, isAsc);
        default: return 0;
      }
    });
  }

}
function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}