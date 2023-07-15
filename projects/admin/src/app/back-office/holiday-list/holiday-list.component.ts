import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { AdminLayoutService } from '../../layouts/admin-layout/admin-layout.service';
import { CommonService } from '../../shared/common.service';
import { CalendarOptions } from '@fullcalendar/angular'; // useful for typechecking
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Sort } from '@angular/material/sort';
declare const $: any;

@Component({
  selector: 'app-holiday-list',
  templateUrl: './holiday-list.component.html',
  styleUrls: ['./holiday-list.component.css']
})
export class HolidayListComponent implements OnInit {

  newsEvent: any[] = [];
  calendarOptions: CalendarOptions = {};
  uploadedDocumentsName: any;
  uploadedDocuments: any;
  @ViewChild('file') myInputVariable: ElementRef;
  resultofDocument: any;
  holidayTableWiseData: any[] = [];
  allholidayTableWiseData: any[] = [];
  l: number;
  p: number = 1;
  itemsPage: any;
  mySelect;
  isView: Boolean;
  isCreated: Boolean;
  isUpdated: Boolean;
  isDeleted: Boolean;

  constructor(public commonService: CommonService, private fb: FormBuilder, private el: ElementRef, public adminLayoutService: AdminLayoutService, public router: Router) {
    let pagePermission = { module: "holidaylist" }
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
    }, (error) => {
      console.log(error.error.Message);
    });
  }

  ngOnInit(): void {
    this.defaultHolidayForm();
    this.getHolidayList();
    this.tableViewFlag = true;
    setTimeout(() => {
      this.evoCalender();
    }, 500);
    this.mySelect = 5;
    this.l = 10;
  }

  itemsPerPage(): void {
    this.l = this.mySelect;
    this.p = 1;
  }

  myEvents = [
    {
      id: "required-id-2",
      name: "Valentine's Day",
      date: "Fri Feb 14 2022 00:00:00 GMT-0800 (Pacific Standard Time)",
      type: "holiday",
      everyYear: true,
      color: "#222"
    },
  ]

  // ========== calander-demo-start==========
  evoCalender() {
    $('#calendar').evoCalendar({
      // settingName: settingValue
      'titleFormat': 'MM',
      calendarEvents: this.newsEvent
    })
    $('#calendar').evoCalendar({
      theme: 'Royal Navy'
    })
  }


  getHolidayList() {
    this.newsEvent = [];
    this.calendarOptions = {};
    this.holidayTableWiseData = [];
    this.adminLayoutService.getActiveHolidayList().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        let holidayListData = Response.data;
        console.log(holidayListData);
        let holidaylistData = holidayListData.filter((v, i) => holidayListData.findIndex(item => item.holidayDate == v.holidayDate) === i);
        this.allholidayTableWiseData = holidaylistData;
        this.holidayTableWiseData = this.allholidayTableWiseData;
        this.sortingList({ active: 'date', direction: 'asc' })
        console.log(this.holidayTableWiseData)

        holidaylistData.forEach((data) => {
          let holidayDateObj = data.holidayDate.split('/')[1] + '/' + data.holidayDate.split('/')[0] + '/' + data.holidayDate.split('/')[2]
          let news = {
            id: data._id,
            date: new Date(holidayDateObj),
            name: data.Holiday,
            type: "holiday",
            everyYear: true,
            color: "#05334d"
          }
          // let news = {
          //   id: "required-id-2",
          //   name: "Valentine's Day",
          //   date: "Fri Feb 14 2022 00:00:00 GMT-0800 (Pacific Standard Time)",
          //   type: "holiday",
          //   everyYear: true,
          //   color: "#222"
          // }

          this.newsEvent.push(news);
        })


        this.calendarOptions = {
          initialView: 'dayGridMonth',
          events: this.newsEvent,
          // events:  [{ title: 'Event Now', start: new Date() }],
          headerToolbar: {
            right: 'prev,next'
          },
        };
      }
    }, (error) => {
      console.log(error.error.Message);
    });
  }


  addEmployee() {
    $("#add-excel-upload-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
    this.myInputVariable.nativeElement.value = "";
  }

  cancelEmployee() {
    $("#add-excel-upload-modal").modal("hide");
  }

  onDocumentChange(event: any) {

    this.resultofDocument = event.target.files[0];
    this.myInputVariable.nativeElement.value = "";
  }

  removeDocument() {
    this.resultofDocument = "";
    this.myInputVariable.nativeElement.value = "";
  }

  saveExcelFile() {
    let excelUploadModal: FormData = new FormData();
    excelUploadModal.append('xlsxDocument', this.resultofDocument);

    this.adminLayoutService.uploadHolidayExcelFile(excelUploadModal).subscribe((Response: any) => {
      if (Response.meta.code == 200) {

        // window.location.reload();
        this.getHolidayList();
        $("#add-excel-upload-modal").modal("hide");
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message)
      }
    });

  }

  calenderViewFlag: boolean = false;
  tableViewFlag: boolean = false;

  tapView(btn_name) {

    if (btn_name === 'calenderView') {
      this.calenderViewFlag = true;
      this.tableViewFlag = false;
      setTimeout(() => {
        this.evoCalender();
      }, 500);
    }
    else if (btn_name === 'tableView') {
      this.tableViewFlag = true
      this.calenderViewFlag = false;
    }
  }


  deleteHolidayData(id: any) {
    let obj = {
      _id: id
    }

    this.adminLayoutService.deleteHoliday(obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.getHolidayList();
        this.commonService.notifier.notify('success', 'Holiday Data Deleted Successfully.');
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    })
  }

  // holiday data add one by one
  holidayDataForm: FormGroup;
  get fHolidayData() { return this.holidayDataForm.controls; };
  submittedHolidayData: boolean = false;
  holidayTypeArray = [
    { value: 1, name: 'Public' },
    { value: 2, name: 'Regular' },
  ]

  defaultHolidayForm() {
    this.holidayDataForm = this.fb.group({
      HolidayType: [null, [Validators.required]],
      Day: ['', [Validators.required]],
      Holiday: ['', [Validators.required]],
      date: ['', [Validators.required]],
    })
  }

  addHolidayData() {
    this.defaultHolidayForm();
    this.submittedHolidayData = false;
    $("#add-holiday-data-modal").modal({ backdrop: 'static', keyboard: false, show: true });
  }

  cancelHolidayModal() {
    this.defaultHolidayForm();
    this.submittedHolidayData = false;
    $("#add-holiday-data-modal").modal("hide");
  }

  getDayByDate() {
    let dayName = moment(this.holidayDataForm.controls.date.value).format('dddd');
    this.holidayDataForm.controls.Day.setValue(dayName)
  }

  saveHolidayData() {
    if (this.holidayDataForm.invalid) {
      this.submittedHolidayData = true;
      return
    }

    let holidayObj = {
      HolidayType: this.holidayDataForm.value.HolidayType,
      Day: this.holidayDataForm.value.Day,
      Holiday: this.holidayDataForm.value.Holiday,
      date: moment(this.holidayDataForm.value.date).format("yyyy-MM-DDTHH:mm:ss") + "Z",
    }
    // return
    this.adminLayoutService.saveHolidayData(holidayObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.defaultHolidayForm();
        this.submittedHolidayData = false;
        this.getHolidayList();
        $("#add-holiday-data-modal").modal("hide");
        this.commonService.notifier.notify('success', 'Holiday Data Saved Successfully.');
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    })
  }

  sortingList(sort: Sort) {

    const data = this.allholidayTableWiseData.slice();
    if (!sort.active || sort.direction === '') {
      this.holidayTableWiseData = data;
      return;
    }

    this.holidayTableWiseData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      switch (sort.active) {
        case 'date': return compare(new Date(a.date), b.date, isAsc);
        case 'Holiday': return compare(a.Holiday, b.Holiday, isAsc);
        case 'Day': return compare(a.Day, b.Day, isAsc);
        default: return 0;
      }
    });
  }


}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}