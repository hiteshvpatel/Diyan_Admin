import { Component, OnInit } from '@angular/core';
// import { AdminLayoutService } from '../../../layouts/admin-layout/admin-layout.service';
import { ProjectManagementService } from '../project-management.service';
import { CommonService } from '../../../shared/common.service';
import { Sort } from '@angular/material/sort';
import { StorageService, StorageKey } from '../../../shared/storage.service';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminLayoutService } from '../../../layouts/admin-layout/admin-layout.service';

interface clientMasterData {
  companyName: string;
  address: string;
  country: string;
  state: string;
  city: string;
}
@Component({
  selector: 'app-client-master',
  templateUrl: './client-master.component.html',
  styleUrls: ['./client-master.component.css']
})

export class ClientMasterComponent implements OnInit {
  clientmasterList: clientMasterData[];
  allclientmaster: clientMasterData[];
  clientMasterList: clientMasterData[];
  l: number;
  p: number = 1;
  itemsPage: any;
  mySelect;
  clientmasterListlength: any;
  noData = false;
  searchTerm: string;
  isView: boolean;
  isCreated: boolean;
  isUpdated: boolean;
  isDeleted: boolean;
  imgUrl = environment.uploadedUrl;

  constructor(public commonService: CommonService, public adminLayoutService: AdminLayoutService, public storageService: StorageService, public projectManagementService: ProjectManagementService, private fb: FormBuilder, private router: Router) {
    let pagePermission = { module: "clientmaster" }
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
    this.getClientList();
    this.noData = false;
    this.mySelect = 5;
    this.l = 12;
  }

  itemsPerPage(): void {
    this.l = this.mySelect;
    this.p = 1;
  }

  addClient() {
    this.router.navigate(['/admin/project-management/add-new-client']);
  }
  getClientList() {
    this.projectManagementService.getClientMaster().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.clientMasterList = Response.data;
        this.clientmasterList = this.clientMasterList
        this.noData = false;
      } else {
        this.noData = true;
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }

  statusClient(paramsObj) {
    let statusclientModelObj = {
      "_id": paramsObj.id,
      "status": paramsObj.status
    };
    this.projectManagementService.Statusclient(statusclientModelObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.getClientList();
        this.commonService.notifier.notify('success', Response.meta.message);
      }
      else {
        this.commonService.notifier.notify('success', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  search(value: string): void {


    this.clientmasterList = this.allclientmaster.filter((val) => val.companyName.toLowerCase().includes(value.toLowerCase()));
    this.clientMasterList = this.clientmasterList
    this.p = 1;
    if (this.clientmasterList.length == 0) {
      this.noData = true;
    } else {
      this.noData = false;
    }
  }

  generateLedger() {
    this.adminLayoutService.generateClientLedger().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.commonService.notifier.notify('success', 'Ledger Created Successfully.')
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message)
      }
    })
  }

  // sortData(sort: Sort) {

  //   const data = this.clientMasterList.slice();
  //   if (!sort.active || sort.direction === '') {
  //     this.clientmasterList = data;
  //     return;
  //   }

  //   this.usermasterList = data.sort((a, b) => {
  //     const isAsc = sort.direction === 'asc';
  //     switch (sort.active) {
  //       case 'userName': return compare(a.userName, b.userName, isAsc);
  //       case 'email': return compare(a.email, b.email, isAsc);
  //       case 'roleName': return compare(a.roleName, b.roleName, isAsc);
  //       case 'status': return compare(a.status, b.status, isAsc);
  //       default: return 0;
  //     }
  //   });
  // }

}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}