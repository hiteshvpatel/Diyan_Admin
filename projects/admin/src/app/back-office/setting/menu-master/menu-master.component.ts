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
import { StorageService, StorageKey } from '../../../shared/storage.service';
import { stringify } from 'querystring';

declare const $: any;

interface roleMasterData {
    roleName: string;
}

@Component({
    selector: 'app-menu-master',
    templateUrl: './menu-master.component.html',
    styleUrls: ['./menu-master.component.css']
})
export class MenumasterComponent implements OnInit {


    ISeditMenu = false;
    menuList: roleMasterData[];
    allmenu: roleMasterData[];
    MenuList: roleMasterData[];
    l: number;
    p: number = 1;
    itemsPage: any;
    mySelect;
    menuForm: FormGroup;
    x: number;
    t: number;
    listindex: number;
    menuListlength: any;

    get fTitleData() { return this.menuForm.controls; }
    get fPathData() { return this.menuForm.controls; }
    submittedMenuData = false;
    noData;
    perentList: any;
    isView: boolean;
    isCreated: boolean;
    isUpdated: boolean;
    isDeleted: boolean;
    searchTerm: any;

    constructor(public commonService: CommonService, public storageService: StorageService, public adminLayoutService: AdminLayoutService, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private spinner: NgxSpinnerService) {
        let pagePermission = { module: "menumaster" }
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
        this.ISeditMenu = false;
        this.getMenuList();
        this.getPerentList();
        this.defaultForm();
    }
    defaultForm() {
        this.menuForm = this.fb.group({
            _id: ['0'],
            title: ['', [Validators.required]],
            path: [''],
            icon: ['',],
            class: ['',],
            parentId: [],
            order: [''],
            module: [],
        });
    }

    itemsPerPage(): void {
        this.l = this.mySelect;
    }

    addMenu() {
        $("#add-menu-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
        this.ISeditMenu = false;
    }

    cancelMenu() {
        $("#add-menu-modal").modal("hide");
        this.defaultForm();
        this.ISeditMenu = false;
    }

    saveMenu() {

        if (this.menuForm.invalid) {
            this.submittedMenuData = true;
            return;
        }
        let parentObj;
        if (this.menuForm.controls.parentId.value == null) {
            parentObj = "";
        }
        else {
            parentObj = this.menuForm.controls.parentId.value;
        }
        let moduleObj;
        if (this.menuForm.controls.module.value == null) {
            moduleObj = "";
        }
        else {
            moduleObj = this.menuForm.controls.module.value;
        }
        let menuModelObj = {
            "title": this.menuForm.controls.title.value,
            "path": this.menuForm.controls.path.value,
            "icon": this.menuForm.controls.icon.value,
            "class": this.menuForm.controls.class.value,
            "parentId": parentObj,
            "order": this.menuForm.controls.order.value.toString(),
            "module": moduleObj,
        };


        this.adminLayoutService.Savemenu(menuModelObj).subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                $("#add-menu-modal").modal("hide");
                this.submittedMenuData = false;
                this.getMenuList();
                this.defaultForm();
                this.getPerentList();
                this.ISeditMenu = false;
                this.commonService.notifier.notify('success', Response.meta.message);
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message);
            }
        }, (error) => {
            console.log(error);
        });
    }

    search(value: string): void {
        this.menuList = this.allmenu.filter((val: any) => JSON.stringify(val).toLowerCase().includes(value.toLowerCase()));
        this.p = 1;
        if (this.menuList.length == 0) {
            this.noData = true;
        } else {
            this.noData = false;
        }
    }

    getMenuList() {

        this.adminLayoutService.getmenu().subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                this.MenuList = Response.data;
                this.menuList = this.MenuList.sort((a: any, b: any) => a.order - b.order)
                this.allmenu = this.menuList
                this.menuList = this.MenuList.slice();
                this.menuListlength = Response.data.length;
                this.noData = false;
            } else {
                this.noData = true;
            }
            //for select sub industry step
        }, (error) => {
            console.log(error.error.Message);
        });
    }

    editRolemaster(paramsObj) {

        this.ISeditMenu = true;
        let Id: any = { '_id': paramsObj.id }
        this.adminLayoutService.getmenuId(Id).subscribe((Response: any) => {

            this.menuForm.controls._id.setValue(Response.data._id)
            this.menuForm.controls.title.setValue(Response.data.title)
            this.menuForm.controls.path.setValue(Response.data.path)
            if (!!Response.data.icon) {
                this.menuForm.controls.icon.setValue(Response.data.icon)
            }
            if (!!Response.data.class) {
                this.menuForm.controls.class.setValue(Response.data.class)
            }
            if (!!Response.data.parentId) {
                this.menuForm.controls.parentId.setValue(Response.data.parentId)
            }
            this.menuForm.controls.order.setValue(parseFloat(Response.data.order))
            this.menuForm.controls.module.setValue(Response.data.module)
            $("#add-menu-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
        }, (error) => {
            ////console.log(error);
            //this.commonService.notifier.notify('error', error.error.Message);
        });
    }
    updateMenu() {


        if (this.menuForm.invalid) {
            this.submittedMenuData = true;
            return;
        }
        let parentObj;
        if (this.menuForm.controls.parentId.value == null) {
            parentObj = "";
        }
        else {
            parentObj = this.menuForm.controls.parentId.value;
        }
        let moduleObj;
        if (this.menuForm.controls.module.value == null) {
            moduleObj = "";
        }
        else {
            moduleObj = this.menuForm.controls.module.value;
        }
        let rolemasterModelObj = {
            "_id": this.menuForm.controls._id.value,
            "title": this.menuForm.controls.title.value,
            "path": this.menuForm.controls.path.value,
            "icon": this.menuForm.controls.icon.value,
            "class": this.menuForm.controls.class.value,
            "parentId": parentObj,
            "order": this.menuForm.controls.order.value.toString(),
            "module": moduleObj,
        };

        this.adminLayoutService.Updatemenu(rolemasterModelObj).subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                $("#add-menu-modal").modal("hide");
                this.submittedMenuData = false;
                this.getMenuList();
                this.defaultForm();
                this.getPerentList();
                this.ISeditMenu = false;
                this.commonService.notifier.notify('success', Response.meta.message);
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message);
            }
        }, (error) => {
            console.log(error);
        });
    }

    statusMenu(paramsObj) {


        let statusmenuModelObj = {
            "_id": paramsObj.id,
            "status": paramsObj.status
        };


        this.adminLayoutService.Statusmenu(statusmenuModelObj).subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                this.submittedMenuData = false;
                this.getMenuList();
                this.defaultForm();
                this.ISeditMenu = false;
                this.commonService.notifier.notify('success', Response.meta.message);
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message);
            }
        }, (error) => {
            console.log(error);
        });
    }

    getPerentList() {

        this.adminLayoutService.getPerentList().subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                this.perentList = Response.data;
            } else {
            }
            //for select sub industry step
        }, (error) => {
            console.log(error.error.Message);
        });
    }

    numberOnly(event): boolean {

        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 45 || charCode > 57)) {
            return false;
        }
    }

    moduleList = [
        {
            name: "Dashboard",
            value: "dashboard"
        },
        {
            name: "Employee List",
            value: "employeelist"
        },
        {
            name: "Designation Master",
            value: "designationmaster"
        },
        {
            name: "Template Master",
            value: "templatemaster"
        },
        {
            name: "Project Master",
            value: "projectmaster"
        },
        {
            name: "Role Master",
            value: "rolemaster"
        },
        {
            name: "Menu Master",
            value: "menumaster"
        },
        {
            name: "IP Address Master",
            value: "ipaddressmaster"
        },
        {
            name: "Role Wise Menu",
            value: "rolewisemenu"
        },
        {
            name: "User Wise Menu",
            value: "userwisemenu"
        },
        {
            name: "Holiday",
            value: "holidaylist"
        },
        {
            name: "Task List",
            value: "taskslist"
        },
        {
            name: "Leave List",
            value: "leavelist"
        },
        {
            name: "User",
            value: "user"
        },
        {
            name: "Attandence List",
            value: "attandence"
        },
        {
            name: "Pending List",
            value: "pendingattendancelist"
        },
        {
            name: "Attendance Consolidate Report",
            value: "attendanceConsolidateReport"
        },
        {
            name: "File Upload",
            value: "fileupload"
        },
        {
            name: "Technology Master",
            value: "technologymaster"
        },
        {
            name: "Document Type Master",
            value: "documenttypemaster"
        },
        {
            name: "Supplier Master",
            value: "suppliermaster"
        },
        {
            name: "Supplier Purchase Master",
            value: "supplierpurchasemaster"
        },
        {
            name: "Category Master",
            value: "categorymaster"
        },
        {
            name: "Product Master",
            value: "productmaster"
        },
        {
            name: "Assign Product",
            value: "assignproduct"
        },
        {
            name: "Client Master",
            value: "clientmaster"
        }, {
            name: "Company List",
            value: "companylist"
        },
        {
            name: "Company Details",
            value: "companydetails"
        },
        {
            name: "Document Master",
            value: "documentmaster"
        },
        {
            name: "Generate Invoice",
            value: "generateinvoice"
        },
        {
            name: "Group Master",
            value: "groupmaster"
        },
        {
            name: "Unit Master",
            value: "unitmaster"
        },
        {
            name: "Ledger Master",
            value: "ledgermaster"
        },
        {
            name: "Account Entry Master",
            value: "accountentrymaster"
        },
        {
            name: "Account To Account Transfer Master",
            value: "accounttoaccountmaster"
        },
        {
            name: "Account Entry Report",
            value: "accountentryreport"
        },
        {
            name: "Group Wise Account Entry Report",
            value: "groupwiseaccountentryreport"
        },
        {
            name: "Account List",
            value: "accountlist"
        },
        {
            name: "Salary Generation",
            value: "salarygeneration"
        },
        {
            name: "Interview",
            value: "interview"
        },
        {
            name: "Work From Home",
            value: "workfromhome"
        },
        {
            name: "Short Leave",
            value: "shortleave"
        },
        {
            name: "Monthly Salary Details",
            value: "monthlysalarydetails"
        },
    ]

}
