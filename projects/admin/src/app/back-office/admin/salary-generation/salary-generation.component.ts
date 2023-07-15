import { Component, OnInit } from '@angular/core';
import { AdminLayoutService } from '../../../layouts/admin-layout/admin-layout.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CommonService } from '../../../shared/common.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { Router } from '@angular/router';
import { Sort } from '@angular/material/sort';
const FileSaver = require('file-saver');

@Component({
  selector: 'app-salary-generation',
  templateUrl: './salary-generation.component.html',
  styleUrls: ['./salary-generation.component.scss']
})
export class SalaryGenerationComponent implements OnInit {

  dt = new Date();
  month = this.dt.getMonth();
  year = this.dt.getFullYear();
  searchForm: FormGroup;
  noData;
  l: number;
  p: number = 1;
  itemsPage: any;
  mySelect;
  monthArray: any[] = [];
  allSalaryGenerationList: any[] = [];
  salaryGenerationList: any[] = [];
  salaryTableShow: boolean = false;
  get fSearchData(): { [key: string]: AbstractControl } {
    return this.searchForm.controls;
  }
  searchData: boolean = false;
  isView: boolean;
  isCreated: boolean;
  isUpdated: boolean;
  isDeleted: boolean;

  constructor(private commonService: CommonService, public adminLayoutService: AdminLayoutService, private fb: FormBuilder, private router: Router) {
    let pagePermission = { module: "salarygeneration" }
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

    this.monthArray = [
      { value: '1', month: 'January' },
      { value: '2', month: 'February' },
      { value: '3', month: 'March' },
      { value: '4', month: 'April' },
      { value: '5', month: 'May' },
      { value: '6', month: 'June' },
      { value: '7', month: 'July' },
      { value: '8', month: 'August' },
      { value: '9', month: 'September' },
      { value: '10', month: 'October' },
      { value: '11', month: 'November' },
      { value: '12', month: 'December' },
    ];

    this.noData = false;
    this.mySelect = 5;
    this.l = 10;
    this.defaultForm();
    this.getYear();
    // this.getSalaryGenerationList();
  }

  yearArray = new Array<number>();
  getYear() {
    this.yearArray = new Array<number>();
    let d = new Date();

    for (let index = 0; index < 2; index++) {
      let prYear = d.getFullYear();
      let arr = prYear - index;
      this.yearArray.push(arr)
    }
    return this.yearArray;
  }

  defaultForm() {
    this.searchForm = this.fb.group({
      month: [this.monthArray[this.month].value, [Validators.required]],
      year: [this.year, [Validators.required]],
    });
  }

  itemsPerPage(): void {
    this.l = this.mySelect;
  }

  getSalaryGenerationList() {

    if (this.searchForm.invalid) {
      this.searchData = true;
      return;
    }

    this.salaryTableShow = false;
    let Obj = {
      month: this.searchForm.value.month,
      year: this.searchForm.value.year
    }

    this.adminLayoutService.getSalaryGenerationList(Obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.salaryTableShow = true;
        this.searchData = false;
        this.allSalaryGenerationList = Response.data
        this.salaryGenerationList = this.allSalaryGenerationList
        this.sortingList({ active: 'empNumber', direction: 'asc' })
      }
    })

  }

  generateSalaryExcel() {
    // let userName = this.salaryGenerationList.firstName + ' ' + this.salaryGenerationList.middleName + ' ' + this.salaryGenerationList.lastName;


    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(this.monthArray[this.searchForm.value.month - 1].month);

    worksheet.columns = [
      { header: 'Month & Year', key: 'monthYear', width: 20 },
      { header: 'Employee Number', key: 'empNumber', width: 20 },
      { header: 'Employee Name', key: 'empName', width: 40 },
      { header: 'Basic Salary', key: 'basicSalary', width: 20 },
      { header: 'HRA', key: 'HRA', width: 20 },
      { header: 'Professional Text', key: 'professionalText', width: 20 },
      { header: 'Transport Allowance', key: 'transportAllowance', width: 20 },
      { header: 'PF', key: 'PF', width: 20 },
      { header: 'PF Employer', key: 'PFEmployer', width: 20 },
      { header: 'Miscellaneous Allowances', key: 'miscellaneousAllowances', width: 20 },
      { header: 'Total Salary', key: 'totalSalary', width: 20 },
    ];

    this.salaryGenerationList.forEach(e => {
      worksheet.addRow({ monthYear: this.monthArray[this.searchForm.value.month - 1].month + ' ' + this.searchForm.value.year, empNumber: e.empNumber, empName: e.employeeName, basicSalary: e.basicSalary, HRA: e.HRA, professionalText: e.professionalText, transportAllowance: e.transportAllowance, PF: e.PF, PFEmployer: e.PFEmployer, miscellaneousAllowances: e.miscellaneousAllowances, totalSalary: e.finalAmount })
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, this.monthArray[this.searchForm.value.month - 1].month + ' Salary Report.xlsx');
    })
  }

  downloadSalaryGenerationWorkReport(employeeId: any) {
    let downloadSalaryGenerationObj = {
      month: this.searchForm.value.month,
      year: this.searchForm.value.year,
      employeeId: employeeId
    }
    this.adminLayoutService.downloadSalaryGenerationReportByEmployeeID(downloadSalaryGenerationObj).subscribe((Response: any) => {
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
        var extension = "SalaryInvoice.pdf";
        downloadLink.download = new Date().getTime() + extension;
        downloadLink.target = '_blank';
        downloadLink.click();


        // let inVoicePDF = this.commonService.rootData.uploadsUrl + "salaryPdfMonthWise/" + Response.data.fileName;
        // const pdfUrl = inVoicePDF;
        // const pdfName = Response.data.fileName.split('.')[0];
        // FileSaver.saveAs(pdfUrl, pdfName);
        this.commonService.notifier.notify('success', "Salary Report Download Successfully.");
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    })
  }

  search(value: string): void {

    this.salaryGenerationList = this.allSalaryGenerationList.filter((val) => JSON.stringify(val).toLowerCase().includes(value.toLowerCase()));
    this.salaryGenerationList = this.salaryGenerationList;
    this.p = 1;
    if (this.salaryGenerationList.length == 0) {
      this.noData = true;
    } else {
      this.noData = false;
    }
  }

  sortingList(sort: Sort) {

    const data = this.allSalaryGenerationList.slice();
    if (!sort.active || sort.direction === '') {
      this.salaryGenerationList = data;
      return;
    }

    this.salaryGenerationList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      switch (sort.active) {
        case 'empNumber': return compare(a.empNumber, b.empNumber, isAsc);
        case 'employeeName': return compare(a.employeeName, b.employeeName, isAsc);
        default: return 0;
      }
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
