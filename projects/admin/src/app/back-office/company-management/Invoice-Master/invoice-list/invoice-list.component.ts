import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AdminLayoutService } from '../../../../layouts/admin-layout/admin-layout.service';
import { CommonService } from '../../../../shared/common.service';
import { environment } from '../../../../../environments/environment';
import { StorageService, StorageKey } from '../../../../shared/storage.service';
import { CoreHelperService } from '../../../../Providers/core-helper/core-helper.service';
declare const $: any;
import * as moment from 'moment';
import { NgSelectConfig } from '@ng-select/ng-select';
import { parse } from 'path';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CompanyManagementService } from '../../company-management.service';
const FileSaver = require('file-saver');
import { NgxSpinnerService } from 'ngx-spinner';
import { Sort } from '@angular/material/sort';



@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {

  allInvoiceList: any[] = [];
  invoiceList: any[] = [];
  l: number;
  p: number = 1;
  itemsPage: any;
  mySelect;
  noData;
  searchTerm: any;
  isView: Boolean;
  isCreated: Boolean;
  isUpdated: Boolean;
  isDeleted: Boolean;

  constructor(private http: HttpClient, private spinner: NgxSpinnerService, private fb: FormBuilder, public companyManagementService: CompanyManagementService, public storageService: StorageService, private coreHelper: CoreHelperService, private route: ActivatedRoute, private router: Router, public commonService: CommonService, public adminLayoutService: AdminLayoutService) {
    let pagePermission = { module: "generateinvoice" }
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
    this.getInvoiceList();
    this.mySelect = 5;
    this.l = 5;
  }

  itemsPerPage(): void {
    this.l = this.mySelect;
  }

  getInvoiceList() {
    this.companyManagementService.getInvoiceMasterList().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allInvoiceList = Response.data;
        this.invoiceList = this.allInvoiceList;
        this.noData = false;
        this.sortingList({ active: 'companyName', direction: 'asc' })
      }
      else {
        this.noData = true;
        this.invoiceList = [];
      }
    });
  }

  search(value: any): void {
    this.invoiceList = this.allInvoiceList.filter((val: any) => JSON.stringify(val).toLowerCase().includes(value.toLowerCase()));
    this.p = 1;
    if (this.invoiceList.length == 0) {
      this.noData = true;
    } else {
      this.noData = false;
    }
  }

  statusInvoice(paramsObj) {


    let statusCompanyObj = {
      "_id": paramsObj.id,
      "status": paramsObj.status
    };


    this.companyManagementService.StatusCompanyMaster(statusCompanyObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.getInvoiceList();
        this.commonService.notifier.notify('success', Response.meta.message);
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  downloadInvoice(paramsObj) {


    let downloadInvoiceObj = {
      "_id": paramsObj.id,
    };


    this.companyManagementService.invoiceDetailsPdfAdminSide(downloadInvoiceObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        const base64URL = Response.data.body.data;
        const binary = base64URL;
        const len = binary.length;
        const buffer = new ArrayBuffer(len);
        const view = new Uint8Array(binary);
        var byteArrays = [];
        byteArrays.push(view);
        const blob = new Blob(byteArrays, { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const downloadLink = document.createElement('a');
        document.body.appendChild(downloadLink);
        downloadLink.href = url;
        var extension = "billInvoice.pdf";
        downloadLink.download = new Date().getTime() + extension;
        downloadLink.target = '_blank';
        downloadLink.click();

      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  sortingList(sort: Sort) {

    const data = this.allInvoiceList.slice();
    if (!sort.active || sort.direction === '') {
      this.invoiceList = data;
      return;
    }

    this.invoiceList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      switch (sort.active) {
        case 'companyName': return compare(a.companyName, b.companyName, isAsc);
        case 'templateName': return compare(a.templateName, b.templateName, isAsc);
        case 'clientName': return compare(a.clientName, b.clientName, isAsc);
        case 'financialYear': return compare(a.financialYear, b.financialYear, isAsc);
        case 'billNo': return compare(a.billNo, b.billNo, isAsc);
        case 'billDate': return compare(new Date(moment(a.billDate).format('yyyy-MM-DD')), new Date(moment(b.billDate).format('yyyy-MM-DD')), isAsc);
        case 'finalAmount': return compare(a.finalAmount, b.finalAmount, isAsc);
        default: return 0;
      }
    });
  }
}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
