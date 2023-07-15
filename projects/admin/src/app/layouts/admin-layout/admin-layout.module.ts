import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AutoCompleteModule } from 'ng5-auto-complete';
import { NgxPaginationModule } from 'ngx-pagination';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NgxSpinnerModule } from 'ngx-spinner';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSortModule, } from '@angular/material/sort';
//import { NgSelect2Module } from 'ng-select2';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatRadioModule } from '@angular/material/radio';
import { DashboardComponent } from '../../back-office/dashboard/dashboard.component';
import { AdminloginComponent } from '../../back-office/admin-login/admin-login.component';
import { ChangePasswordComponent } from '../../back-office/change-password/change-password.component';
import { AddnewuserComponent } from '../../back-office/admin/add-new-user/add-new-user.component';
import { UserlistComponent } from '../../back-office/admin/user-list/user-list.component';
import { HolidayListComponent } from '../../back-office/holiday-list/holiday-list.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { FullCalendarModule } from '@fullcalendar/angular';
import { RolewisemenuComponent } from '../../back-office/setting/role-wise-menu/role-wise-menu.component';
import { UserwisemenuComponent } from '../../back-office/setting/user-wise-menu/user-wise-menu.component';
import { MenumasterComponent } from '../../back-office/setting/menu-master/menu-master.component';
import { LeaveListComponent } from '../../back-office/leave-list/leave-list.component';
import { RolemasterComponent } from '../../back-office/admin/role-master/role-master.component';
import { DesignationMasterComponent } from '../../back-office/admin/designation-master/designation-master.component';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { AttendanceListComponent } from '../../back-office/attendance/attendance-list/attendance-list.component';
import { TechnologyMasterComponent } from '../../back-office/admin/technology-master/technology-master.component';
import { DocumentTypeMasterComponent } from '../../back-office/admin/document-type-master/document-type-master.component';
import { NgxMaskModule } from 'ngx-mask';
import { Admingeneralsettingcomponent } from '../../back-office/setting/general-setting/general-setting.component';
import { ProjectMasterComponent } from '../../back-office/project-management/project-master/project-master.component';
import { TasksListComponent } from '../../back-office/tasks-list/tasks-list.component';
import { SupplierMasterComponent } from '../../back-office/assets-management/supplier-master/supplier-master.component';
import { CategoryMasterComponent } from '../../back-office/assets-management/category-master/category-master.component';
import { ProductMasterComponent } from '../../back-office/assets-management/product-master/product-master.component';
import { PendingAttendanceListComponent } from '../../back-office/attendance/pending-attendance-list/pending-attendance-list.component';
import { AssignProductComponent } from '../../back-office/assets-management/assign-product/assign-product.component';
import { ClientMasterComponent } from '../../back-office/project-management/client-master/client-master.component';
import { AddNewClientComponent } from '../../back-office/project-management/add-new-client/add-new-client.component';
import { AddNewProjectComponent } from '../../back-office/project-management/add-new-project/add-new-project.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { DocumentMasterComponent } from '../../back-office/company-management/document-master/document-master.component';
import { TemplateMasterComponent } from '../../back-office/company-management/template-master/template-master.component';
import { CreateInvoiceComponent } from '../../back-office/company-management/Invoice-Master/create-invoice/create-invoice.component';
import { CompanyListComponent } from '../../back-office/company-management/company-master/company-list/company-list.component';
import { CompanyDetailsComponent } from '../../back-office/company-management/company-master/company-details/company-details.component';
import { InvoiceListComponent } from '../../back-office/company-management/Invoice-Master/invoice-list/invoice-list.component';
import { GroupMasterComponent } from '../../back-office/account-management/group-master/group-master.component';
import { UnitMasterComponent } from '../../back-office/account-management/unit-master/unit-master.component';
import { LedgerMasterComponent } from '../../back-office/account-management/ledger-master/ledger-master.component';
import { AccountEntryMasterComponent } from '../../back-office/account-management/account-entry-master/account-entry-master.component';
import { AccountToAccountTransferComponent } from '../../back-office/account-management/account-to-account-transfer/account-to-account-transfer.component';
import { GroupWiseAccountEntryReportComponent } from '../../back-office/account-management/group-wise-account-entry-report/group-wise-account-entry-report.component';
import { AccountEntryReportComponent } from '../../back-office/account-management/account-entry-report/account-entry-report.component';
import { AccountListComponent } from '../../back-office/account-management/account-list/account-list.component';
import { SalaryGenerationComponent } from '../../back-office/admin/salary-generation/salary-generation.component';
import { AttendanceConsolidateReportComponent } from '../../back-office/attendance/attendance-consolidate-report/attendance-consolidate-report.component';
import { SupplierPurchaseMasterComponent } from '../../back-office/assets-management/supplier-purchase-master/supplier-purchase-master.component';
import { AddNewSupplierPurchaseComponent } from '../../back-office/assets-management/add-new-supplier-purchase/add-new-supplier-purchase.component';
import { IpAddressMasterComponent } from '../../back-office/setting/ip-address-master/ip-address-master.component';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, ThemePalette, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { InterviewListComponent } from '../../back-office/admin/Interview/interview-list/interview-list.component';
import { InterviewDetailsComponent } from '../../back-office/admin/Interview/interview-details/interview-details.component';
import { WorkFromHomeComponent } from '../../back-office/work-from-home/work-from-home.component';
import { PipeModule } from '../../shared/pipe/pipe.module';
import { ShortLeaveComponent } from '../../back-office/short-leave/short-leave.component';
import { AssestsProductHistoryComponent } from '../../back-office/assets-management/assests-product-history/assests-product-history.component';
import { MonthWiseSalaryDetailsComponent } from '../../back-office/admin/month-wise-salary-details/month-wise-salary-details.component';



FullCalendarModule.registerPlugins([
    // register FullCalendar plugins
    dayGridPlugin,
    interactionPlugin
]);

export const MY_FORMATS = {
    parse: {
        dateInput: 'LL',
    },
    display: {
        dateInput: 'DD-MM-YYYY',
        monthYearLabel: 'YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'YYYY',
    },
};


@NgModule({
    imports: [
        CommonModule,
        PipeModule,
        DirectivesModule,
        RouterModule.forChild(AdminLayoutRoutes),
        FormsModule,
        ReactiveFormsModule,
        DragDropModule,
        MatButtonModule,
        MatRippleModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatMomentDateModule,
        MatRadioModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,
        HttpClientModule,
        AngularEditorModule,
        MatAutocompleteModule,
        MatSortModule,
        AutoCompleteModule,
        EditorModule,
        NgxSpinnerModule,
        //SelectModule,
        NgSelectModule,
        NgxMatSelectSearchModule,
        FullCalendarModule,
        NgbModule,
        NgbDatepickerModule,
        NgxMaskModule.forRoot(),
        // NgxDaterangepickerMd.forRoot({

        //     displayFormat: 'DD/MM/YYYY'
        // })
    ],
    declarations: [
        DashboardComponent,
        AdminloginComponent,
        ChangePasswordComponent,
        AddnewuserComponent,
        UserlistComponent,
        HolidayListComponent,
        RolewisemenuComponent,
        UserwisemenuComponent,
        MenumasterComponent,
        LeaveListComponent,
        RolemasterComponent,
        DesignationMasterComponent,
        AttendanceListComponent,
        AttendanceConsolidateReportComponent,
        TechnologyMasterComponent,
        DocumentTypeMasterComponent,
        Admingeneralsettingcomponent,
        TasksListComponent,
        SupplierMasterComponent,
        CategoryMasterComponent,
        ProductMasterComponent,
        PendingAttendanceListComponent,
        AssignProductComponent,
        ClientMasterComponent,
        AddNewClientComponent,
        ProjectMasterComponent,
        AddNewProjectComponent,
        DocumentMasterComponent,
        TemplateMasterComponent,
        CreateInvoiceComponent,
        CompanyListComponent,
        CompanyDetailsComponent,
        InvoiceListComponent,
        GroupMasterComponent,
        UnitMasterComponent,
        LedgerMasterComponent,
        AccountEntryMasterComponent,
        AccountToAccountTransferComponent,
        GroupWiseAccountEntryReportComponent,
        AccountEntryReportComponent,
        AccountListComponent,
        SalaryGenerationComponent,
        SupplierPurchaseMasterComponent,
        AddNewSupplierPurchaseComponent,
        IpAddressMasterComponent,
        InterviewListComponent,
        InterviewDetailsComponent,
        WorkFromHomeComponent,
        ShortLeaveComponent,
        AssestsProductHistoryComponent,
        MonthWiseSalaryDetailsComponent
    ],
    bootstrap: [TasksListComponent],
    providers: [
        DatePipe,
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
    ],
})

export class AdminLayoutModule { }
