import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { TITLEROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { StorageService, StorageKey } from '../../shared/storage.service';
import { CookieService } from 'ngx-cookie-service';
import { AdminLayoutService } from '../../layouts/admin-layout/admin-layout.service';
import { CommonService } from '../../shared/common.service';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { CoreHelperService } from '../../Providers/core-helper/core-helper.service';
import { environment } from '../../../environments/environment';

declare const $: any;

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    private listTitles: any[];
    private children: any[];
    location: Location;
    mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;
    listTitle: any;
    profileImg: any;
    profileName: any;
    changePasswordForm: FormGroup;
    profileForm: FormGroup;
    submitted: boolean = false;
    submittedProfileForm: boolean = false;
    hide1 = true;
    hide2 = true;
    hide3 = true;
    file: any;
    imgURL: any;
    public imagePath;
    message: string;
    submitteduserData: boolean;
    fullName: string;
    userName: string;
    profileId: string;
    get formControlChangePassword() { return this.changePasswordForm.controls; }
    get fData() { return this.profileForm.controls; }
    @ViewChild('file') myInputVariable: ElementRef;

    constructor(location: Location, private element: ElementRef, private fb: FormBuilder, private router: Router, public storageService: StorageService, private coreHelper: CoreHelperService, private cookieService: CookieService, public commonService: CommonService, public adminLayoutService: AdminLayoutService) {
        this.location = location;
        this.sidebarVisible = false;


    }

    ngOnInit() {

        this.userName = this.storageService.getValue(StorageKey.firstName) + ' ' + this.storageService.getValue(StorageKey.middleName) + ' ' + this.storageService.getValue(StorageKey.lastName);
        this.profileId = this.storageService.getValue(StorageKey.employeeId);
        this.listTitles = TITLEROUTES.filter(listTitle => listTitle);
        // const navbar: HTMLElement = this.element.nativeElement;
        // this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        // this.router.events.subscribe((event) => {
        //     this.sidebarClose();
        //     var $layer: any = document.getElementsByClassName('close-layer')[0];
        //     if ($layer) {
        //         $layer.remove();
        //         this.mobile_menu_visible = 0;
        //     }
        // });

        setTimeout(() => {
            this.profileImg = environment.uploadedUrl + this.storageService.getValue(StorageKey.profileImage)
            this.profileName = this.storageService.getValue('name')
        }, 0);
    }


    profile() {
        this.router.navigate(['/admin/profile/' + this.profileId]);
    }
    changePassword() {
        this.router.navigate(['/admin/change-password/' + this.profileId]);
    }

    logout() {
        this.storageService.removeValue(StorageKey.myToken);
        this.storageService.removeValue(StorageKey._id);
        this.storageService.removeValue(StorageKey.firstName);
        this.storageService.removeValue(StorageKey.lastName);
        this.storageService.removeValue(StorageKey.email);
        this.storageService.removeValue(StorageKey.accountType);
        this.storageService.removeValue(StorageKey.roleType);
        this.storageService.removeValue(StorageKey.profileImage);
        this.storageService.removeValue(StorageKey.IsDiyanLogin);
        this.router.navigate(['/admin/admin-login']);
    }
    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);

        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    // sidebarOpen() {
    //     const toggleButton = this.toggleButton;
    //     const body = document.getElementsByTagName('body')[0];
    //     setTimeout(function () {
    //         toggleButton.classList.add('toggled');
    //     }, 500);

    //     body.classList.add('nav-open');

    //     this.sidebarVisible = true;
    // };
    // sidebarClose() {
    //     const body = document.getElementsByTagName('body')[0];
    //     this.toggleButton.classList.remove('toggled');
    //     this.sidebarVisible = false;
    //     body.classList.remove('nav-open');
    // };
    // sidebarToggle() {
    //     // const toggleButton = this.toggleButton;
    //     // const body = document.getElementsByTagName('body')[0];
    //     var $toggle = document.getElementsByClassName('navbar-toggler')[0];

    //     if (this.sidebarVisible === false) {
    //         this.sidebarOpen();
    //     } else {
    //         this.sidebarClose();
    //     }
    //     const body = document.getElementsByTagName('body')[0];

    //     if (this.mobile_menu_visible == 1) {
    //         // $('html').removeClass('nav-open');
    //         body.classList.remove('nav-open');
    //         if ($layer) {
    //             $layer.remove();
    //         }
    //         setTimeout(function () {
    //             $toggle.classList.remove('toggled');
    //         }, 400);

    //         this.mobile_menu_visible = 0;
    //     } else {
    //         setTimeout(function () {
    //             $toggle.classList.add('toggled');
    //         }, 430);

    //         var $layer = document.createElement('div');
    //         $layer.setAttribute('class', 'close-layer');


    //         if (body.querySelectorAll('.main-panel')) {
    //             document.getElementsByClassName('main-panel')[0].appendChild($layer);
    //         } else if (body.classList.contains('off-canvas-sidebar')) {
    //             document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
    //         }

    //         setTimeout(function () {
    //             $layer.classList.add('visible');
    //         }, 100);

    //         $layer.onclick = function () { //asign a function
    //             body.classList.remove('nav-open');
    //             this.mobile_menu_visible = 0;
    //             $layer.classList.remove('visible');
    //             setTimeout(function () {
    //                 $layer.remove();
    //                 $toggle.classList.remove('toggled');
    //             }, 400);
    //         }.bind(this);
    //         body.classList.add('nav-open');
    //         this.mobile_menu_visible = 1;
    //     }
    // };

    getTitle() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(1);
        }
        if (titlee.charAt(0) === '?') {
            titlee = titlee.slice(1);
        }
        // for (var item = 0; item < this.listTitles.length; item++) {
        //     if (this.listTitles[item].path === titlee) {
        //         return this.listTitles[item].title;

        //     }
        // }
        if (titlee.includes('dashboard')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Dashboard'
            };
        }
        // employee management
        //1. employee master
        else if (titlee.includes('employee-list')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Employee-List'
            };
        }
        else if (titlee.includes('add-new-employee')) {
            return {
                pastUrl: 'admin/employee-list',
                pastLinkName: 'Employee-List / ',
                currentPageName: 'Add Employee'
            };
        }
        else if (titlee.includes('edit-employee')) {
            return {
                pastUrl: 'admin/employee-list',
                pastLinkName: 'Employee-List / ',
                currentPageName: 'Edit Employee'
            };
        }
        else if (titlee.includes('interview-list')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Interview'
            };
        }
        else if (titlee.includes('monthly-salary-details')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Monthly Salary Details'
            };
        }
        else if (titlee.includes('add-interview-details')) {
            return {
                pastUrl: 'admin/interview-list',
                pastLinkName: 'Interview /',
                currentPageName: 'Interview Details'
            };
        }
        else if (titlee.includes('update-interview-details')) {
            return {
                pastUrl: 'admin/interview-list',
                pastLinkName: 'Interview /',
                currentPageName: 'Interview Details'
            };
        }
        //2. role master
        else if (titlee.includes('role-master')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Role Master'
            };
        }
        //3. designation master
        else if (titlee.includes('designation-master')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Designation Master'
            };
        }
        //4. technology master
        else if (titlee.includes('technology-master')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Technology Master'
            };
        }
        //5. document type master
        else if (titlee.includes('document-type-master')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Document Type Master'
            };
        }
        //6. profile master
        else if (titlee.includes('profile')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Profile'
            };
        }
        else if (titlee.includes('salary-generation')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Salary Generation'
            };
        }

        // change password
        else if (titlee.includes('change-password')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Change Password'
            };
        }

        // leave management
        //1. holiday list
        else if (titlee.includes('holiday-list')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Holiday List'
            };
        }
        //2. leave list
        else if (titlee.includes('leave-list')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Leave List'
            };
        }

        // setting
        else if (titlee.includes('menu-master')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Menu Master'
            };
        }
        else if (titlee.includes('ip-address-master')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'IP Address Master'
            };
        }
        else if (titlee.includes('role-wise-menu')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Role Wise Menu'
            };
        }
        else if (titlee.includes('user-wise-menu')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'User Wise Menu'
            };
        }

        // attendance management
        else if (titlee.includes('attendance-list')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Attendance List'
            };
        }
        else if (titlee.includes('pending-list')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Pending Attendance'
            };
        }
        else if (titlee.includes('attendance-consolidate-report')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Attendance Consolidate Report'
            };
        }

        // task management
        else if (titlee.includes('task-list')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Task List'
            };
        }

        // assets managemet
        else if (titlee.includes('assign-product-list')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Assign Product'
            };
        }
        else if (titlee.includes('assests-product-history')) {
            return {
                pastUrl: 'admin/assets-management/product-master',
                pastLinkName: 'Product Master /',
                currentPageName: 'Assets Product History'
            };
        }
        else if (titlee.includes('supplier-master')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Supplier Master'
            };
        }
        else if (titlee.includes('add-new-supplier-purchase-master')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Add New Supplier Purchase Master'
            };
        }
        else if (titlee.includes('edit-supplier-purchase-master')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Edit Supplier Purchase Master'
            };
        }
        else if (titlee.includes('supplier-purchase-master')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Supplier Purchase Master'
            };
        }
        else if (titlee.includes('category-master')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Category Master'
            };
        }
        else if (titlee.includes('product-master')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Product Master'
            };
        }

        // project management
        //1. project master
        else if (titlee.includes('project-master')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Project Master'
            };
        }
        else if (titlee.includes('edit-project')) {
            return {
                pastUrl: 'admin/project-management/project-master',
                pastLinkName: 'Project Master / ',
                currentPageName: 'Edit Project'
            };
        }
        else if (titlee.includes('add-new-project')) {
            return {
                pastUrl: 'admin/project-management/project-master',
                pastLinkName: 'Project Master / ',
                currentPageName: 'Add Project'
            };
        }
        //2. Client Master
        else if (titlee.includes('client-master')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Client Master'
            };
        }
        else if (titlee.includes('edit-client')) {
            return {
                pastUrl: 'admin/project-management/client-master',
                pastLinkName: 'Client Master / ',
                currentPageName: 'Edit Client'
            };
        }
        else if (titlee.includes('add-new-client')) {
            return {
                pastUrl: 'admin/project-management/client-master',
                pastLinkName: 'Client Master / ',
                currentPageName: 'Add Client'
            };
        }

        // company management
        else if (titlee.includes('company-list')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Company List'
            };
        }
        else if (titlee.includes('company-details')) {
            return {
                pastUrl: 'admin/company-management/company-list',
                pastLinkName: 'Company List / ',
                currentPageName: 'Company Details'
            };
        }
        else if (titlee.includes('document-master')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Document Master'
            };
        }
        else if (titlee.includes('template-master')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Templete Master'
            };
        }
        else if (titlee.includes('invoice-list')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Invoice List'
            };
        }
        else if (titlee.includes('generate-invoice')) {
            return {
                pastUrl: 'admin/company-management/generate-invoice',
                pastLinkName: 'Invoice List / ',
                currentPageName: 'Generate Invoice'
            };
        }
        else if (titlee.includes('edit-generated-invoice')) {
            return {
                pastUrl: 'admin/company-management/generate-invoice',
                pastLinkName: 'Invoice List / ',
                currentPageName: 'Edit Generated Invoice'
            };
        }

        //account management
        else if (titlee.includes('group-master')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Group Master'
            };
        }
        else if (titlee.includes('unit-master')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Unit Master'
            };
        }
        else if (titlee.includes('ledger-master')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Ledger Master'
            };
        }
        else if (titlee.includes('account-to-account-transfer-master')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Account To Account Transfer'
            };
        }
        else if (titlee.includes('account-entry-master')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Account Entry'
            };
        }
        else if (titlee.includes('group-wise-account-entry-report')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Group Wise Account Entry Report'
            };
        }
        else if (titlee.includes('account-entry-report')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Account Entry Report'
            };
        }
        else if (titlee.includes('account-list')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Account List'
            };
        }
        else if (titlee.includes('work-from-home-list')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Work From Home List'
            };
        }
        else if (titlee.includes('short-leave')) {
            return {
                pastUrl: '#',
                pastLinkName: '',
                currentPageName: 'Short Leave List'
            };
        }




        return {
            pastUrl: '#',
            pastLinkName: '',
            currentPageName: 'Dashboard'
        };
    }
}
