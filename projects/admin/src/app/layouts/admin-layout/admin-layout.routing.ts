import { Routes } from '@angular/router';


import { UserlistComponent } from '../../back-office/admin/user-list/user-list.component';
import { AddnewuserComponent } from '../../back-office/admin/add-new-user/add-new-user.component';
import { DashboardComponent } from '../../back-office/dashboard/dashboard.component';
import { ChangePasswordComponent } from '../../back-office/change-password/change-password.component';
import { HolidayListComponent } from '../../back-office/holiday-list/holiday-list.component';
import { MenumasterComponent } from '../../back-office/setting/menu-master/menu-master.component';
import { RolewisemenuComponent } from '../../back-office/setting/role-wise-menu/role-wise-menu.component';
import { UserwisemenuComponent } from '../../back-office/setting/user-wise-menu/user-wise-menu.component';
import { LeaveListComponent } from '../../back-office/leave-list/leave-list.component';
import { RolemasterComponent } from '../../back-office/admin/role-master/role-master.component';
import { DesignationMasterComponent } from '../../back-office/admin/designation-master/designation-master.component';
import { AttendanceListComponent } from '../../back-office/attendance/attendance-list/attendance-list.component';
import { DocumentTypeMasterComponent } from '../../back-office/admin/document-type-master/document-type-master.component';
import { TechnologyMasterComponent } from '../../back-office/admin/technology-master/technology-master.component';
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
import { InterviewListComponent } from '../../back-office/admin/Interview/interview-list/interview-list.component';
import { InterviewDetailsComponent } from '../../back-office/admin/Interview/interview-details/interview-details.component';
import { WorkFromHomeComponent } from '../../back-office/work-from-home/work-from-home.component';
import { ShortLeaveComponent } from '../../back-office/short-leave/short-leave.component';
import { AssestsProductHistoryComponent } from '../../back-office/assets-management/assests-product-history/assests-product-history.component';
import { MonthWiseSalaryDetailsComponent } from '../../back-office/admin/month-wise-salary-details/month-wise-salary-details.component';


export const AdminLayoutRoutes: Routes = [

    { path: 'admin/dashboard', component: DashboardComponent },
    { path: 'admin/employee-list', component: UserlistComponent },
    { path: 'admin/add-new-employee', component: AddnewuserComponent },
    { path: 'admin/edit-employee/:id', component: AddnewuserComponent },
    { path: 'admin/change-password/:id', component: ChangePasswordComponent },
    { path: 'admin/profile/:id', component: AddnewuserComponent },

    { path: 'admin/employee-management/document-type-master', component: DocumentTypeMasterComponent },
    { path: 'admin/employee-management/technology-master', component: TechnologyMasterComponent },
    { path: 'admin/employee-management/role-master', component: RolemasterComponent },
    { path: 'admin/employee-management/designation-master', component: DesignationMasterComponent },
    { path: 'admin/employee-management/salary-generation', component: SalaryGenerationComponent },
    { path: 'admin/employee-management/monthly-salary-details', component: MonthWiseSalaryDetailsComponent },
    { path: 'admin/interview-list', component: InterviewListComponent },
    { path: 'admin/add-interview-details', component: InterviewDetailsComponent },
    { path: 'admin/update-interview-details/:id', component: InterviewDetailsComponent },

    { path: 'admin/leave-management/holiday-list', component: HolidayListComponent },
    { path: 'admin/leave-management/leave-list', component: LeaveListComponent },
    { path: 'admin/leave-management/leave-list-search', component: LeaveListComponent },
    { path: 'admin/leave-management/work-from-home-list', component: WorkFromHomeComponent },
    { path: 'admin/leave-management/short-leave', component: ShortLeaveComponent },

    { path: 'admin/task-list', component: TasksListComponent },
    { path: 'admin/attendance-management/attendance-list', component: AttendanceListComponent },
    { path: 'admin/attendance-management/pending-list', component: PendingAttendanceListComponent },
    { path: 'admin/attendance-management/attendance-consolidate-report', component: AttendanceConsolidateReportComponent },

    { path: 'admin/setting/menu-master', component: MenumasterComponent },
    { path: 'admin/setting/role-wise-menu', component: RolewisemenuComponent },
    { path: 'admin/setting/user-wise-menu', component: UserwisemenuComponent },

    { path: 'admin/assets-management/assign-product-list', component: AssignProductComponent },
    { path: 'admin/assets-management/supplier-master', component: SupplierMasterComponent },
    { path: 'admin/assets-management/category-master', component: CategoryMasterComponent },
    { path: 'admin/assets-management/product-master', component: ProductMasterComponent },
    { path: 'admin/assets-management/add-new-supplier-purchase-master', component: AddNewSupplierPurchaseComponent },
    { path: 'admin/assets-management/edit-supplier-purchase-master/:id', component: AddNewSupplierPurchaseComponent },
    { path: 'admin/assets-management/supplier-purchase-master', component: SupplierPurchaseMasterComponent },
    { path: 'admin/assets-management/assests-product-history/:id', component: AssestsProductHistoryComponent },

    { path: 'admin/project-management/client-master', component: ClientMasterComponent },
    { path: 'admin/project-management/add-new-client', component: AddNewClientComponent },
    { path: 'admin/project-management/edit-client/:id', component: AddNewClientComponent },

    { path: 'admin/project-management/project-master', component: ProjectMasterComponent },
    { path: 'admin/project-management/add-new-project', component: AddNewProjectComponent },
    { path: 'admin/project-management/edit-project/:id', component: AddNewProjectComponent },

    { path: 'admin/company-management/company-list', component: CompanyListComponent },
    { path: 'admin/company-management/add-company-details', component: CompanyDetailsComponent },
    { path: 'admin/company-management/edit-company-details/:id', component: CompanyDetailsComponent },
    { path: 'admin/company-management/document-master', component: DocumentMasterComponent },
    { path: 'admin/company-management/template-master', component: TemplateMasterComponent },
    { path: 'admin/company-management/generate-invoice', component: CreateInvoiceComponent },
    { path: 'admin/company-management/edit-generated-invoice/:id', component: CreateInvoiceComponent },
    { path: 'admin/company-management/invoice-list', component: InvoiceListComponent },


    { path: 'admin/account-management/group-master', component: GroupMasterComponent },
    { path: 'admin/account-management/unit-master', component: UnitMasterComponent },
    { path: 'admin/account-management/ledger-master', component: LedgerMasterComponent },
    { path: 'admin/account-management/account-entry-master', component: AccountEntryMasterComponent },
    { path: 'admin/account-management/account-to-account-transfer-master', component: AccountToAccountTransferComponent },
    { path: 'admin/account-management/account-entry-report', component: AccountEntryReportComponent },
    { path: 'admin/account-management/group-wise-account-entry-report', component: GroupWiseAccountEntryReportComponent },
    { path: 'admin/account-management/account-list', component: AccountListComponent },

    { path: 'admin/setting/ip-address-master', component: IpAddressMasterComponent },

];
