import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AdminLayoutService } from '../../layouts/admin-layout/admin-layout.service';
import * as Highcharts from 'highcharts';
import HeatmapModule from 'highcharts/modules/heatmap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { CommonService } from '../../shared/common.service';
HeatmapModule(Highcharts);
declare const $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isView: boolean;
  isCreated: boolean;
  isUpdated: boolean;
  isDeleted: boolean;

  dashboardCountLists: any;
  dashboardRecentProjectLists: any[] = [];
  dashboardPendingCheckLists: any[] = [];
  dashboardLeaveCountLists: any[] = [];
  recentProjectNoData: boolean;
  dashboardCountNoData: boolean;
  dashboardPendingCheckData: boolean;
  monthArray = [
    { value: 1, month: 'January' },
    { value: 2, month: 'February' },
    { value: 3, month: 'March' },
    { value: 4, month: 'April' },
    { value: 5, month: 'May' },
    { value: 6, month: 'June' },
    { value: 7, month: 'July' },
    { value: 8, month: 'August' },
    { value: 9, month: 'September' },
    { value: 10, month: 'October' },
    { value: 11, month: 'November' },
    { value: 12, month: 'December' },
  ];
  leaveDataGetForm: FormGroup;
  userMasterList: any[] = [];
  allusermaster: any[] = [];
  usermasterList: any[] = [];
  leaveListForDashboard: any[] = [];
  yearArray: any[] = [];

  assignPersonUserStatusList: any[] = [];

  constructor(public adminLayoutService: AdminLayoutService, public commonService: CommonService, public router: Router, private fb: FormBuilder) {
    let pagePermission = { module: "dashboard" }
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
      else {
        this.router.navigate(['admin/dashboard']);
      }
    }, (error) => {
      console.log(error.error.Message);
      this.router.navigate(['admin/dashboard']);
    });
  }

  ngOnInit(): void {
    this.defaultForm();
    this.getYear();
    this.getUserList();
    this.dashboardCountList();
    this.dashboardRecentProjectList();
    this.dashboardPendingCheckList();
    this.dashboardLeaveCountList();
    this.getLeaveListDashboard();
    this.getAssignPersonList();
  }

  getYear() {
    let CurrentYear = new Date().getFullYear()

    let startYear = 2019;

    while (startYear <= CurrentYear) {
      this.yearArray.push(startYear++)
    }
    console.log(this.yearArray);

    return this.yearArray.reverse()
  }

  defaultForm() {
    this.leaveDataGetForm = this.fb.group({
      month: [(new Date().getMonth() + 1)],
      year: [new Date().getFullYear()],
      employeeId: [null]
    })
  }

  getUserList() {
    this.adminLayoutService.getuserMaster().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.userMasterList = Response.data.filter((x: any) => {
          return x.empCompanyInfoData?.status === 1;
        });
        this.allusermaster = this.userMasterList;
        this.usermasterList = this.userMasterList.sort((a, b) => {
          return ((a.userName.toLowerCase() == b.userName.toLowerCase()) ? 0 : ((a.userName.toLowerCase() > b.userName.toLowerCase()) ? 1 : -1));
        });

      }
    })
  }


  dashboardCountList() {
    this.dashboardCountLists = '';
    this.adminLayoutService.getDashboardCountList().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.dashboardCountLists = Response.data;
        this.dashboardCountNoData = false;
      }
      else {
        this.dashboardCountNoData = true;
      }
    })
  }

  dashboardRecentProjectList() {
    this.dashboardRecentProjectLists = [];
    this.adminLayoutService.getDashboardRecentProjectList().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.dashboardRecentProjectLists = Response.data;
        this.recentProjectNoData = false;
      }
      else {
        this.recentProjectNoData = true;
      }
    })
  }

  getLeaveListDashboard() {

    this.leaveListForDashboard = [];

    let Obj = {
      employeeId: this.leaveDataGetForm.value.employeeId,
      month: this.leaveDataGetForm.value.month,
      year: this.leaveDataGetForm.value.year,
    }

    this.adminLayoutService.getDashboardLeaveListData(Obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.leaveListForDashboard = Response.data.filter((x: any) => {
          let dateData = x.date.split('/')[2] + '-' + x.date.split('/')[1] + '-' + x.date.split('/')[0]
          x.date = new Date(dateData);
          return x.date
        }).sort((a, b) => a.date - b.date);
      }
    })

  }

  date = new Date();
  dashboardPendingCheckList() {
    this.dashboardPendingCheckLists = [];
    this.adminLayoutService.getDashboardPendingCheckInList().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        let data = Response.data.filter((x: any) => {
          return x.fullName = x.fullName ? x.fullName.toLowerCase() : ''
        })
        this.dashboardPendingCheckLists = data.sort((a, b) => {
          return ((a.fullName == b.fullName) ? 0 : ((a.fullName > b.fullName) ? 1 : -1));
        });
        this.dashboardPendingCheckData = false;
      }
      else {
        this.dashboardPendingCheckData = true;
      }
    })
  }

  xValuesMonth: any[] = [];
  yValuesTransaction: any[] = [];
  HeatmapObject: any = null;

  dashboardLeaveCountList() {
    this.xValuesMonth = [];
    this.yValuesTransaction = [];
    this.dashboardLeaveCountLists = [];

    this.adminLayoutService.getDashboardLeaveCountList().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        let year = new Date().getFullYear();

        for (let i = 0; i < 12; i++) {
          const x = this.monthArray[i];
          let month_year = x.month + '-' + year;
          this.xValuesMonth.push(month_year);

          let responseData = Response.data.filter((y: any, index) => y.monthNumber == i + 1)

          if (responseData.length > 0) {
            this.yValuesTransaction.push(responseData[0].leaveCount);
          }
          else {
            this.yValuesTransaction.push(0);
          }

        }

        let options = this.barChartOption();
        this.HeatmapObject = Highcharts.chart(options);
      }
    })
  }



  barChartOption(): Highcharts.Options {

    let options: Highcharts.Options = {

      chart: {
        renderTo: 'barChart',
        height: 330,
      },

      title: {
        text: ''
      },

      xAxis: {
        categories: this.xValuesMonth,
        title: {
          text: 'Months'
        },
      },

      yAxis: {
        min: 0,
        title: {
          text: 'Leave Count'
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: ( // theme
              Highcharts.defaultOptions.title?.style &&
              Highcharts.defaultOptions.title.style.color
            ) || 'gray'
          }
        }
      },

      // colors: ['#4454c3', '#6976cf', '#8e98db', '#b4bae7', '#d9dcf3'],

      legend: {
        enabled: false
      },

      series: [
        {
          type: 'column',
          name: 'Count',
          data: this.yValuesTransaction,
          dataLabels: {
            enabled: true,
          },

        },
      ]

    }

    return options;
  }

  goToLeaveList(data: any) {
    console.log(data);

    this.router.navigate(['admin/leave-management/leave-list-search'], {
      queryParams: {
        name: data.EmpName,
        month: this.leaveDataGetForm.value.month,
        year: this.leaveDataGetForm.value.year
      }
    })
  }

  listShowType: any;
  dayNotStartList: any[] = [];
  inWorkingList: any[] = [];
  inBreakList: any[] = [];
  dayEndList: any[] = [];


  showList(type) {
    this.listShowType = type
    $("#current-status-modal").modal({ backdrop: 'static', keyboard: false, show: true });
  }
  cancleCurrentStatusModal() {
    $("#current-status-modal").modal('hide');
  }

  getAssignPersonList() {

    this.assignPersonUserStatusList = [];


    this.adminLayoutService.getAssignListDataEmp().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.assignPersonUserStatusList = Response.data.userStatus;

        this.dayNotStartList = this.assignPersonUserStatusList.filter((x: any) => x.userStatus == 'Day Not Start');
        this.inWorkingList = this.assignPersonUserStatusList.filter((x: any) => x.userStatus == 'In Working');
        this.inBreakList = this.assignPersonUserStatusList.filter((x: any) => x.userStatus == 'In Break');
        this.dayEndList = this.assignPersonUserStatusList.filter((x: any) => x.userStatus == 'Day End');
      }
    })
  }

  startBreak() {
    this.adminLayoutService.startAllEmpBreak().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.getAssignPersonList();
        $("#current-status-modal").modal('hide');
        this.commonService.notifier.notify('success', "All Employee Break Start Successfully.");
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    })
  }

}
function sortData(a, b) {
  return ((a == b) ? 0 : ((a > b) ? 1 : -1));
}