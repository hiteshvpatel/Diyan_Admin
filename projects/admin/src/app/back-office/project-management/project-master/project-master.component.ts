import { Component, OnInit } from '@angular/core';
// import { AdminLayoutService } from '../../../layouts/admin-layout/admin-layout.service';
import { ProjectManagementService } from '../project-management.service';
import { CommonService } from '../../../shared/common.service';
import { Router } from '@angular/router';
import { StorageService, StorageKey } from '../../../shared/storage.service';
import { AdminLayoutService } from '../../../layouts/admin-layout/admin-layout.service';

declare const $: any;

interface projectMasterData {
  documenttype: string;
}

@Component({
  selector: 'app-project-master',
  templateUrl: './project-master.component.html',
  styleUrls: ['./project-master.component.scss']
})
export class ProjectMasterComponent implements OnInit {

  projectmasterList: projectMasterData[];
  l: number;
  p: number = 1;
  itemsPage: any;
  mySelect;
  message: string;
  searchTerm: any;
  noData: boolean = false;
  isView: Boolean;
  isDeleted: Boolean;
  isCreated: Boolean;
  isUpdated: Boolean;

  constructor(public commonService: CommonService, public adminLayoutService: AdminLayoutService, public storageService: StorageService, public projectManagementService: ProjectManagementService, private router: Router) {
    let pagePermission = { module: "projectmaster" }
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
    this.mySelect = 5;
    this.l = 8;
    this.getprojectmasterList();
  }

  itemsPerPage(): void {
    this.l = this.mySelect;
  }

  // for project listing
  getprojectmasterList() {
    this.projectManagementService.getProjectMaster().subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.projectmasterList = Response.data;
        this.projectmasterList = this.projectmasterList;
        this.projectmasterList = this.projectmasterList.slice();
      }
    }, (error) => {
      console.log(error.error.Message);
    });
  }

  addProjectMaster() {
    this.router.navigate(['/admin/project-management/add-new-project']);
  }

  statusProjectMaster(paramsObj) {
    let statusProjectMasterModelObj = {
      "_id": paramsObj.id,
      "status": paramsObj.status
    };
    this.projectManagementService.StatusProjectMaster(statusProjectMasterModelObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.getprojectmasterList();
        this.commonService.notifier.notify('success', Response.meta.message);
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }
}
