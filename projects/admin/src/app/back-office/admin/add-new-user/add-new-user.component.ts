import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AdminLayoutService } from '../../../layouts/admin-layout/admin-layout.service';
import { CommonService } from '../../../shared/common.service';
import { environment } from '../../../../environments/environment';
import { StorageService, StorageKey } from '../../../shared/storage.service';
import { CoreHelperService } from '../../../Providers/core-helper/core-helper.service';
declare const $: any;
import * as moment from 'moment';
import { NgSelectConfig } from '@ng-select/ng-select';
import { parse } from 'path';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CompanyManagementService } from '../../company-management/company-management.service';

@Component({
    selector: 'app-add-new-user',
    templateUrl: './add-new-user.component.html',
    styleUrls: ['./add-new-user.component.css']
})
export class AddnewuserComponent implements OnInit {
    resumeInfoForm: FormGroup;
    colour;
    ISeditEmployee = false;
    employeeForm: FormGroup;
    emergencyContactInforForm: FormGroup;
    companyInfoForm: FormGroup;
    educationDetailsForm: FormGroup;
    experienceDetailsForm: FormGroup;
    bankDetailsForm: FormGroup;
    salaryDetailsForm: FormGroup;
    monthlySalaryDetailsForm: FormGroup;
    monthWiseLeaveForm: FormGroup;
    documentUploadForm: FormGroup;
    leaveBalanceForm: FormGroup;
    submitteduserData = false;
    submittedEmergencyInfoData = false;
    submittedCompanyInfoData = false;
    submittedDocumentUploadInfoData = false;
    submittedEducationDetailsData = false;
    submittedExperienceDetailsData = false;
    submittedBankDetailsData = false;
    submittedSalaryDetailsData = false;
    submittedResumeInfoData = false;
    userId;
    file: any;
    imgURL: any;
    public imagePath;
    signatureImageFile: any;
    signatureImageURL: any;
    public signatureImagePath;
    message: string;
    signatureMessage: string;
    activeroleList: [];
    profileDetails: boolean = false;
    hide1 = false;
    roleList: any[] = [];
    designationList: any[] = [];
    technologyList: any[] = [];
    documentTypeMasterList: any[] = [];
    emergencyContactInformationList: any[] = [];
    educationDetailsList: any[] = [];
    documentUploadId: any;
    uplodedDocumentList: any[] = [];
    experienceDetailsList: any[] = [];
    employeeCompanyList: any;
    empBasicInfoList = new EmpBasicInfoListModel();
    resultofShowingDocuments: any = {};
    resultofExpShowDocument: any;
    empResumeDetailsList: any;
    competenciesList: any[] = [];
    technicalProfileList: any[] = [];
    languageList: any[] = [];
    softwareList: any[] = [];
    projectName: any[] = [];
    ProjectMasterlist: any[] = [];
    resumeList: any;


    get fuserData(): { [key: string]: AbstractControl } {
        return this.employeeForm.controls;
    }
    get fEmerContactInfoData(): { [key: string]: AbstractControl } {
        return this.emergencyContactInforForm.controls;
    }
    get fCompanyInfoData(): { [key: string]: AbstractControl } {
        return this.companyInfoForm.controls;
    }
    get fEducationData(): { [key: string]: AbstractControl } {
        return this.educationDetailsForm.controls;
    }
    get fExperienceData(): { [key: string]: AbstractControl } {
        return this.experienceDetailsForm.controls;
    }
    get fBankData(): { [key: string]: AbstractControl } {
        return this.bankDetailsForm.controls;
    }
    get fSalaryData(): { [key: string]: AbstractControl } {
        return this.salaryDetailsForm.controls;
    }
    get fMonthSalaryData(): { [key: string]: AbstractControl } {
        return this.monthlySalaryDetailsForm.controls;
    }
    get fMonthWiseLeaveData(): { [key: string]: AbstractControl } {
        return this.monthWiseLeaveForm.controls;
    }
    get fDocumentUploadData(): { [key: string]: AbstractControl } {
        return this.documentUploadForm.controls;
    }
    get fLeaveBalanceData(): { [key: string]: AbstractControl } {
        return this.leaveBalanceForm.controls;
    }
    get fResumeData(): { [key: string]: AbstractControl } {
        return this.resumeInfoForm.controls;
    }
    isView: boolean;
    isCreated: boolean;
    isUpdated: boolean;
    isDeleted: boolean;
    selectedDataType;
    resultofExpDocument: any;

    @ViewChild('file') myInputVariable: ElementRef;
    @ViewChild('fileDoc') myInputVariableDoc: ElementRef;
    @ViewChild('file1') myInputVariableForSignatureImage: ElementRef;
    @ViewChild('Expfile') myInputExpVariable: ElementRef;
    resultofDocument: any[] = [];
    keepOriginal: boolean = false;
    selectedDocumentTypeId;
    l: number;
    p: number = 1;
    itemsPage: any;
    mySelect;
    alwaysShowCalendars: boolean;
    leaveListForBalance: any;

    itemsPerPage(): void {
        this.l = this.mySelect;
        this.p = 1;
    }

    constructor(private http: HttpClient, private fb: FormBuilder, public storageService: StorageService, private coreHelper: CoreHelperService, private route: ActivatedRoute, private router: Router, public commonService: CommonService, public adminLayoutService: AdminLayoutService, private companyManagementService: CompanyManagementService) {

        let pagePermission = { module: "employeelist" }
        this.adminLayoutService.getpagePermission(pagePermission).subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                this.isView = Response.data.isView;
                this.isCreated = Response.data.isCreated;
                this.isUpdated = Response.data.isUpdated;
                this.isDeleted = Response.data.isDeleted;
                if (this.isCreated === false) {
                    this.router.navigate(['admin/employee-list']);
                }
            }
        }, (error) => {
            console.log(error.error.Message);
        });

        const currentUrl = this.router.url
        if (currentUrl.includes('profile')) {
            this.route.params.subscribe((params: Params) => {
                this.userId = params.id;
            });
            this.profileDetails = true;
        }
        if (currentUrl.includes('add-new-employee')) {
            this.userId = "0";
            this.ISeditEmployee = false;
        } else {
            this.route.params.subscribe((params: Params) => {
                this.userId = params.id;
            });
            this.ISeditEmployee = true;
            this.editEmployeeDetails();
        }
    }

    dataTypeList: any[] = [];

    ngOnInit() {
        this.mySelect = 5;
        this.l = 10;
        this.getrolelist();
        this.getdesignationlist();
        this.getTechnologylist();
        this.getCompanyActiveList();
        this.getDocumentTypeMasterlist();
        this.getProjectMasterlist();
        this.getProjectDetails();
        this.getEmpResumeInformationDetailsByEmpId();
        this.getUserActiveList();
        this.defaultForm();
        this.defualtEmergencyContactInfoForm();
        this.defualtCompanyInfoForm();
        this.defaultExperienceDetailsForm();
        this.defaultDocumentUploadForm();
        this.defaultEducationDetailsForm();
        this.defaultBankForm();
        this.defaultSalaryForm();
        this.defaultMonthlySalaryForm();
        this.defaultMonthWiseLeaveForm();
        this.defaultLeaveBalanceForm();
        this.defaultResumeInfoForm();
        this.defaultAssignTeamForm()


        this.leaveListForBalance = this.leaveBalanceForm.get('leaveList') as FormArray
        this.file = "";
        this.getYear();
        this.getMonthlySalaryYear();
    }

    isNullOrUndefined<T>(tObj: T): boolean {
        return tObj === null || tObj === undefined;
    }

    editEmployeeDetails() {

        let userId = { 'employeeId': this.userId }
        this.adminLayoutService.getuserMasterId(userId).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.employeeCompanyList = Response.data;
                this.getBasicInformationDetailsByEmpId();
                this.getCompanyInformationDetailsByEmpId();
                this.getBankDetailsByEmployeeID();
                this.getEmergencyContactInformationListByEmployeeID();
                this.getEducationDetailsByEmployeeID();
                this.getExperienceDetailsByEmployeeID();
                this.getDocumentListAfterUpload();
                this.getSalaryDetailsByEmployeeID();
                this.getMonthlySalaryDetailsByEmployeeID();
                this.getMonthWiseLeaveByEmployeeID();
                this.getLeaveBalanceByEmployeeID();

            }
        });
    }

    openBasicInfoModel() {
        this.getBasicInformationById();
        $("#add-user-basic-details-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
    }
    closeBasicInfoModel() {
        $("#add-user-basic-details-modal").modal("hide");
    }

    cancelUser() {
        if (this.ISeditEmployee === true && this.profileDetails === false) {
            this.defaultForm();
            this.ISeditEmployee = false;
            this.router.navigate(['/admin/employee-list']);
        }
        else if (this.ISeditEmployee === false && this.profileDetails === false) {
            this.defaultForm();
            this.ISeditEmployee = false;
            this.router.navigate(['/admin/employee-list']);
        }
        else {
            this.profileDetails = false;
            this.router.navigate(['/admin/dashboard']);
        }
    }
    yearArray = new Array<number>();
    monthArray = [
        { value: '01', month: 'January' },
        { value: '02', month: 'February' },
        { value: '03', month: 'March' },
        { value: '04', month: 'April' },
        { value: '05', month: 'May' },
        { value: '06', month: 'June' },
        { value: '07', month: 'July' },
        { value: '08', month: 'August' },
        { value: '09', month: 'September' },
        { value: '10', month: 'October' },
        { value: '11', month: 'November' },
        { value: '12', month: 'December' },
    ];

    getYear() {
        this.yearArray = new Array<number>();
        let d = new Date();

        for (let index = 0; index < 50; index++) {
            let prYear = d.getFullYear();
            let arr = prYear - index;
            this.yearArray.push(arr)
        }
        return this.yearArray;
    }

    getrolelist() {

        this.adminLayoutService.getRoleList().subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.roleList = Response.data;
            }
        });
    }
    getdesignationlist() {

        this.adminLayoutService.getDesignationList().subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.designationList = Response.data;
            }
        });
    }
    getTechnologylist() {

        this.adminLayoutService.getTechnologyList().subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.technologyList = Response.data;
            }
        });
    }
    getDocumentTypeMasterlist() {

        this.adminLayoutService.getDocumentTypeMasterslist().subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.documentTypeMasterList = Response.data;
            }
        });
    }
    getProjectMasterlist() {

        this.adminLayoutService.getProjectMasterslist().subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.ProjectMasterlist = Response.data;
            }
        });
    }


    // only add number in input filed
    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
    letterOnly(event): Boolean {

        const charCode = (event.which) ? event.which : event.keyCode;
        if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
            return false;
        }
        return true;
    }
    numberAndletterOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
            return false;
        }
        return true;
    }
    letterSpaceOnly(event): Boolean {

        const charCode = (event.which) ? event.which : event.keyCode;
        if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122) && (charCode != 32)) {
            return false;
        }
        return true;
    }


    // start
    // basic information save
    getToday(): string {
        return new Date().toISOString().split('T')[0]
    }
    bloodGroupArray = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    defaultForm() {
        this.employeeForm = this.fb.group({
            _id: [''],
            EmpId: [''],
            firstName: ['', [Validators.required]],
            middleName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            dob: ['', [Validators.required]],
            p_Mobile: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
            p_Email: ['', [Validators.required, Validators.pattern(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/)]],
            gender: ['', [Validators.required]],
            permenentAddress: [''],
            currentAddress: [''],
            bloodGroup: [],
            linkedInId: [''],
        });
    }
    SaveUser(btnName) {
        this.submitteduserData = true;
        if (this.employeeForm.invalid) {
            return;
        }
        let usermasterModelObj: FormData = new FormData();
        usermasterModelObj.append('EmpId', this.employeeForm.value.EmpId);
        usermasterModelObj.append('firstName', this.employeeForm.value.firstName);
        usermasterModelObj.append('middleName', this.employeeForm.value.middleName);
        usermasterModelObj.append('lastName', this.employeeForm.value.lastName);
        usermasterModelObj.append('dob', moment(this.employeeForm.value.dob).format('DD-MM-yyyy'));
        usermasterModelObj.append('p_Mobile', this.employeeForm.value.p_Mobile);
        usermasterModelObj.append('p_Email', this.employeeForm.value.p_Email);
        usermasterModelObj.append('gender', this.employeeForm.value.gender);
        usermasterModelObj.append('permenentAddress', this.employeeForm.value.permenentAddress);
        usermasterModelObj.append('currentAddress', this.employeeForm.value.currentAddress);
        usermasterModelObj.append('bloodGroup', this.employeeForm.value.bloodGroup);
        usermasterModelObj.append('linkedInId', this.employeeForm.value.linkedInId);
        usermasterModelObj.append('profile_image', this.file);
        usermasterModelObj.append('signature', this.signatureImageFile);

        this.adminLayoutService.SaveUserBasicInfoMaster(usermasterModelObj).subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                this.submitteduserData = false;
                if (btnName === 'continue') {
                    this.getBasicInformationDetailsByEmpId();
                    this.router.navigate(['/admin/edit-employee/' + Response.data._id]);
                    this.commonService.notifier.notify('success', "User Created Successfully.");
                }
                else if (btnName === 'save') {
                    this.defaultForm();
                    this.router.navigate(['/admin/employee-list']);
                    this.commonService.notifier.notify('success', "User Created Successfully.");
                }
            }
            else if (Response.meta.code == 1005) {
                this.commonService.notifier.notify('error', Response.meta.message);
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message);
            }
        }, (error) => {
            console.log(error);
        });
    }
    UpdateUser() {

        if (this.employeeForm.invalid) {
            this.submitteduserData = true;
            return;
        }
        let usermasterModelObj: FormData = new FormData();
        usermasterModelObj.append('_id', this.employeeForm.value._id);
        usermasterModelObj.append('EmpId', this.employeeForm.value.EmpId);
        usermasterModelObj.append('firstName', this.employeeForm.value.firstName);
        usermasterModelObj.append('middleName', this.employeeForm.value.middleName);
        usermasterModelObj.append('lastName', this.employeeForm.value.lastName);
        usermasterModelObj.append('dob', moment(this.employeeForm.value.dob).format('DD-MM-yyyy'));
        usermasterModelObj.append('p_Mobile', this.employeeForm.value.p_Mobile);
        usermasterModelObj.append('p_Email', this.employeeForm.value.p_Email);
        usermasterModelObj.append('gender', this.employeeForm.value.gender);
        usermasterModelObj.append('permenentAddress', this.employeeForm.value.permenentAddress);
        usermasterModelObj.append('currentAddress', this.employeeForm.value.currentAddress);
        usermasterModelObj.append('bloodGroup', this.employeeForm.value.bloodGroup);
        usermasterModelObj.append('linkedInId', this.employeeForm.value.linkedInId);
        usermasterModelObj.append('profile_image', this.file);
        usermasterModelObj.append('signature', this.signatureImageFile);

        this.adminLayoutService.UpdateUserBasicInfoMaster(usermasterModelObj).subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                this.submitteduserData = false;
                this.getBasicInformationDetailsByEmpId();
                $("#add-user-basic-details-modal").modal("hide");
                this.commonService.notifier.notify('success', "User Basic Information Updated Successfully.");
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message);
            }
        }, (error) => {
            console.log(error);
        });
    }
    preview(files) {
        this.file = files[0];
        if (files.length === 0)
            return;

        var mimeType = files[0].type;
        if (mimeType == "image/jpeg" || mimeType == "image/png") {
            var reader = new FileReader();
            this.imagePath = files;
            reader.readAsDataURL(files[0]);
            reader.onload = (_event) => {
                this.imgURL = reader.result;
            }
            this.message = "";
        } else {
            this.message = "Only JPEG and PNG image is supported.";
            this.imgURL = "";
            this.file = "";
            this.myInputVariable.nativeElement.value = "";
            return;
        }
    }
    removeuploadFile() {

        this.imgURL = "";
        this.file = "";
        this.myInputVariable.nativeElement.value = "";
    }
    previewSignatureImage(files) {
        this.signatureImageFile = files[0];
        if (files.length === 0)
            return;

        var mimeType = files[0].type;
        if (mimeType == "image/jpeg" || mimeType == "image/png") {
            var reader = new FileReader();
            this.signatureImagePath = files;
            reader.readAsDataURL(files[0]);
            reader.onload = (_event) => {
                this.signatureImageURL = reader.result;
            }
            this.signatureMessage = "";
        } else {
            this.signatureMessage = "Only JPEG and PNG image is supported.";
            this.signatureImageURL = "";
            this.signatureImageFile = "";
            this.myInputVariableForSignatureImage.nativeElement.value = "";
            return;
        }
    }
    todayDate = new Date();
    maxDate = this.todayDate
    minDobDate: NgbDateStruct = { year: 1700, month: 1, day: 1 };
    removeSignatureImageFile() {

        this.signatureImageURL = "";
        this.signatureImageFile = "";
        this.myInputVariableForSignatureImage.nativeElement.value = "";
    }
    getBasicInformationById() {
        let EducationDetailsObj = {
            _id: this.userId
        }
        this.adminLayoutService.getBasicDetailsByID(EducationDetailsObj).subscribe((Response: any) => {
            if (Response.meta.code == 200) {

                this.employeeForm.controls._id.setValue(Response.data._id);
                this.employeeForm.controls.EmpId.setValue(Response.data.EmpId);
                this.employeeForm.controls.firstName.setValue(Response.data.firstName);
                this.employeeForm.controls.middleName.setValue(Response.data.middleName);
                this.employeeForm.controls.lastName.setValue(Response.data.lastName);
                this.employeeForm.controls.p_Mobile.setValue(Response.data.p_Mobile);
                this.employeeForm.controls.gender.setValue(Response.data.gender.toString());

                if (Response.data.dob.includes('-')) {
                    this.employeeForm.controls.dob.setValue(new Date(Response.data.dob.split('-')[2] + '-' + Response.data.dob.split('-')[1] + '-' + Response.data.dob.split('-')[0]));
                }
                else {
                    this.employeeForm.controls.dob.setValue(new Date(Response.data.dob.split('/')[2] + '-' + Response.data.dob.split('/')[1] + '-' + Response.data.dob.split('/')[0]));
                }


                this.employeeForm.controls.permenentAddress.setValue(Response.data.permenentAddress);
                this.employeeForm.controls.currentAddress.setValue(Response.data.currentAddress);
                this.employeeForm.controls.bloodGroup.setValue(Response.data.bloodGroup);
                this.employeeForm.controls.linkedInId.setValue(Response.data.linkedInId);
                this.employeeForm.controls.p_Email.setValue(Response.data.p_Email);
                this.imgURL = environment.uploadedUrl + Response.data.profile_image;
                this.signatureImageURL = environment.uploadedUrl + Response.data.signature;
                this.file = Response.data.profile_image;
                this.signatureImageFile = Response.data.signature;
                // $("#add-education-details-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
            }
        });
    }
    getBasicInformationDetailsByEmpId() {
        let empId = {
            _id: this.userId
        }
        this.adminLayoutService.getBasicDetailsByEmployeeID(empId).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.empBasicInfoList._id = Response.data._id;
                this.empBasicInfoList.firstName = Response.data.firstName + ' ' + Response.data.middleName + ' ' + Response.data.lastName;
                // this.empBasicInfoList.middleName = Response.data.middleName;
                // this.empBasicInfoList.lastName = Response.data.lastName;
                this.empBasicInfoList.p_Mobile = Response.data.p_Mobile;
                this.empBasicInfoList.gender = Response.data.gender;
                this.empBasicInfoList.dob = Response.data.dob;
                this.empBasicInfoList.permenentAddress = Response.data.permenentAddress;
                this.empBasicInfoList.currentAddress = Response.data.currentAddress;
                this.empBasicInfoList.bloodGroup = Response.data.bloodGroup;
                this.empBasicInfoList.linkedInId = Response.data.linkedInId;
                this.empBasicInfoList.p_Email = Response.data.p_Email;
                this.empBasicInfoList.profile_image = environment.uploadedUrl + Response.data.profile_image;
                this.empBasicInfoList.signature = environment.uploadedUrl + Response.data.signature;
            }
        });
    }
    // end


    // Emergency Contact Information Form Array Add and remove function
    IsEmergencyContact: boolean = false
    defualtEmergencyContactInfoForm() {
        this.emergencyContactInforForm = this.fb.group({
            _id: [''],
            contactPersonName: ['', [Validators.required]],
            contactPersonPhone: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
            contactPersonEmailId: [''],
            relationship: ['', [Validators.required]],
        })
    }
    addEmergencyContactInformation() {
        this.IsEmergencyContact = false;
        this.submittedEmergencyInfoData = false;
        this.defualtEmergencyContactInfoForm();
        $("#add-emergency-contact-information-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
    }
    cancelEmergencyContactInformation() {
        this.defualtEmergencyContactInfoForm();
        this.submittedEmergencyInfoData = false;
        $("#add-emergency-contact-information-modal").modal("hide");
    }
    saveEmergencyContactInfo() {
        this.submittedEmergencyInfoData = true;
        if (this.emergencyContactInforForm.invalid) {
            return;
        }

        let emergencyContactInfoObj = {
            contactPersonName: this.emergencyContactInforForm.value.contactPersonName,
            contactPersonPhone: this.emergencyContactInforForm.value.contactPersonPhone,
            contactPersonEmailId: this.emergencyContactInforForm.value.contactPersonEmailId,
            relationship: this.emergencyContactInforForm.value.relationship,
            employeeId: this.userId
        }

        this.adminLayoutService.SaveEmergencyContactInfo(emergencyContactInfoObj).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.IsEmergencyContact = false;
                this.submittedEmergencyInfoData = false;
                this.defualtEmergencyContactInfoForm();
                $("#add-emergency-contact-information-modal").modal("hide");
                this.getEmergencyContactInformationListByEmployeeID();
                this.commonService.notifier.notify('success', "Emergency Contact Information Saved Successfully.");
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message);
            }
        })
    }
    getEmergencyContactInfoById(id) {
        let EmergencyContactInfodObj = {
            _id: id
        }
        this.adminLayoutService.getEmergencyContactInfoById(EmergencyContactInfodObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {

                this.emergencyContactInforForm.controls._id.setValue(Res.data._id);
                this.emergencyContactInforForm.controls.contactPersonName.setValue(Res.data.contactPersonName);
                this.emergencyContactInforForm.controls.contactPersonPhone.setValue(Res.data.contactPersonPhone);
                this.emergencyContactInforForm.controls.contactPersonEmailId.setValue(Res.data.contactPersonEmailId);
                this.emergencyContactInforForm.controls.relationship.setValue(Res.data.relationship);
                this.IsEmergencyContact = true;
                $("#add-emergency-contact-information-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
            }
        });
    }
    updateEmergencyContactInfo() {
        this.submittedEmergencyInfoData = true;
        if (this.emergencyContactInforForm.invalid) {
            return;
        }

        let emergencyContactInfoObj = {
            _id: this.emergencyContactInforForm.value._id,
            contactPersonName: this.emergencyContactInforForm.value.contactPersonName,
            contactPersonPhone: this.emergencyContactInforForm.value.contactPersonPhone,
            contactPersonEmailId: this.emergencyContactInforForm.value.contactPersonEmailId,
            relationship: this.emergencyContactInforForm.value.relationship,
        }

        this.adminLayoutService.UpdateEmergencyContactInfo(emergencyContactInfoObj).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.IsEmergencyContact = false;
                this.submittedEmergencyInfoData = false;
                this.defualtEmergencyContactInfoForm();
                $("#add-emergency-contact-information-modal").modal("hide");
                this.getEmergencyContactInformationListByEmployeeID();
                this.commonService.notifier.notify('success', "Emergency Contact Information Updated Successfully.");
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message);
            }
        })
    }
    getEmergencyContactInformationListByEmployeeID() {
        let Obj = {
            employeeId: this.userId
        }
        this.adminLayoutService.getEmergencyContactInfoByEmployeeID(Obj).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.emergencyContactInformationList = Response.data
            }
        });

    }
    deleteEmergencyContactInformationById(id) {
        let Obj = {
            _id: id
        }
        this.adminLayoutService.deleteContactInfoById(Obj).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.getEmergencyContactInformationListByEmployeeID();
                this.commonService.notifier.notify('success', "Emergency Contact Information Deleted Successfully.");
            }
            else {
                this.commonService.notifier.notify('success', Response.meta.message);
            }
        });
    }

    // start (Complete)
    // document upload form
    IsDocumentUpload: boolean = false;
    docError: boolean = false;
    defaultDocumentUploadForm() {
        this.documentUploadForm = this.fb.group({
            documentTypeId: [null, [Validators.required]]
        })
    }
    addDocument() {

        this.defaultDocumentUploadForm();
        this.resultofDocument = [];
        this.resultofShowingDocuments = [];
        this.IsDocumentUpload = false;
        this.keepOriginal = false;
        this.myInputVariableDoc.nativeElement.value = "";
        $("#add-document-upload-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
    }
    cancelDocument() {
        this.defaultDocumentUploadForm();
        this.resultofDocument = [];
        this.resultofShowingDocuments = [];
        this.submittedDocumentUploadInfoData = false;
        this.docError = false;
        this.keepOriginal = false;
        this.IsDocumentUpload = false;
        this.myInputVariableDoc.nativeElement.value = "";
        $("#add-document-upload-modal").modal("hide");
    }
    onDocumentChange(event: any) {

        var selectedFiles = event.target.files;
        for (var i = 0; i < selectedFiles.length; i++) {
            let file = selectedFiles[i];
            this.resultofDocument.push(file);
        }
        if (this.resultofDocument.length == 0) {
            this.docError = true;
        }
        else {
            this.docError = false;
        }
        event.target.value = '';
        this.myInputVariableDoc.nativeElement.value = "";

    }
    removeDocument(index, action) {

        if (index !== undefined && !!action) {
            if (action === 'newDocument') {
                this.resultofDocument.splice(index, 1);
            } else if (
                action === 'oldDocument' &&
                !!this.resultofShowingDocuments &&
                !!this.resultofShowingDocuments.oldUploadedDocuments &&
                !!this.resultofShowingDocuments.oldUploadedDocuments[index]
            ) {
                if (this.resultofShowingDocuments.deletedDocuments === undefined) {
                    this.resultofShowingDocuments.deletedDocuments = [];
                }
                this.resultofShowingDocuments.deletedDocuments.push(
                    this.resultofShowingDocuments.oldUploadedDocuments[index].name
                );
                this.resultofShowingDocuments.oldUploadedDocuments.splice(index, 1);
            }
        }

        // if (this.resultofDocument.length == 0) {
        //     this.docError = true;
        // }
        this.myInputVariableDoc.nativeElement.value = "";
    }
    setIsKeepOriginals(event: any) {
        // console.log(event);
        this.keepOriginal = event.target.checked;
    }
    saveDocumentUpload() {

        this.submittedDocumentUploadInfoData = true;
        if (this.documentUploadForm.invalid) {
            if (this.resultofDocument.length == 0) {
                this.docError = true;
                return;
            }
            else {
                return;
            }
        }



        let documentUploadModelObj: FormData = new FormData();
        documentUploadModelObj.append('employeeId', this.userId);
        documentUploadModelObj.append('documentTypeId', this.documentUploadForm.value.documentTypeId);

        this.resultofDocument.map((obj: any) => {
            documentUploadModelObj.append('documents', obj);
        })
        // documentUploadModelObj.append('documents', this.resultofDocument);
        documentUploadModelObj.append('keepOriginal', this.keepOriginal.toString());



        this.adminLayoutService.SaveDocumentUploadData(documentUploadModelObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {
                this.IsDocumentUpload = false;
                this.defaultDocumentUploadForm();
                this.submittedDocumentUploadInfoData = false;
                this.resultofDocument = [];
                this.docError = false;
                $("#add-document-upload-modal").modal("hide");
                this.getDocumentListAfterUpload();
                this.commonService.notifier.notify('success', "Document Uploaded Successfully.");
            }
            else {
                this.commonService.notifier.notify('error', Res.meta.message);
            }
        })
    }
    getDocumentUploadById(id) {

        let documentUploadObj = {
            _id: id
        }
        this.adminLayoutService.getDocumentUploadById(documentUploadObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {

                this.documentUploadForm.controls.documentTypeId.setValue(Res.data.documentTypeId);
                this.documentUploadId = Res.data._id;


                this.resultofDocument = [];
                let oldDocuments: any = [];

                Res.data.documents.map((file: any) => {
                    oldDocuments.push({ name: file })
                })

                this.resultofShowingDocuments.oldUploadedDocuments = oldDocuments


                // this.resultofShowingDocuments = Res.data.documents;
                this.keepOriginal = Boolean(JSON.parse(Res.data.keepOriginal));
                this.IsDocumentUpload = true;
                $("#add-document-upload-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
            }
        });
    }
    updateDocumentUpload() {
        this.submittedDocumentUploadInfoData = true;
        if (this.documentUploadForm.invalid) {
            if (this.resultofDocument.length == 0 && this.resultofShowingDocuments.oldUploadedDocuments.length == 0) {
                this.docError = true;
                return
            }
            else {
                return;
            }
        } else {
            if (this.resultofDocument.length == 0 && this.resultofShowingDocuments.oldUploadedDocuments.length == 0) {
                this.docError = true;
                return;
            }
        }


        let documentUploadModelObj: FormData = new FormData();
        documentUploadModelObj.append('_id', this.documentUploadId);
        documentUploadModelObj.append('documentTypeId', this.documentUploadForm.value.documentTypeId);
        this.resultofDocument.map((obj: any) => {
            documentUploadModelObj.append('documents', obj);
        })

        if (!!this.resultofShowingDocuments.deletedDocuments && this.resultofShowingDocuments.deletedDocuments.length > 0) {
            documentUploadModelObj.append('deletedocuments', this.resultofShowingDocuments.deletedDocuments);
        }

        // this.resultofShowingDocuments.oldUploadedDocuments.map((oldFile: any) => {
        //     documentUploadModelObj.append('deleteDeliverables', oldFile);
        // })
        // documentUploadModelObj.append('documents', this.resultofDocument);
        documentUploadModelObj.append('keepOriginal', this.keepOriginal.toString());
        console.log(this.resultofDocument);

        // return




        this.adminLayoutService.UpdateDocumentUploadData(documentUploadModelObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {
                this.IsDocumentUpload = false;
                this.defaultDocumentUploadForm();
                this.submittedDocumentUploadInfoData = false;
                this.resultofDocument = [];
                this.docError = false;
                $("#add-document-upload-modal").modal("hide");
                this.getDocumentListAfterUpload();
                this.commonService.notifier.notify('success', "Document Updated Successfully.");
            }
            else {
                this.commonService.notifier.notify('error', Res.meta.message);
            }
        })
    }
    getDocumentListAfterUpload() {
        let employeeIdObj = {
            employeeId: this.userId
        }
        this.adminLayoutService.getDocumentUploadList(employeeIdObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {
                Res.data.map((x: any) => {
                    let type = typeof (x.documents);
                    if (type == 'string') {
                        x.docType = 1
                    }
                    else if (type == 'object') {
                        x.docType = 2
                    }
                    this.uplodedDocumentList.push(x)
                })
                console.log(this.uplodedDocumentList);

            }
        })
    }
    deleteDocumentDetailsById(id) {
        let Obj = {
            _id: id
        }
        this.adminLayoutService.deleteDocumentDetailsById(Obj).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.getDocumentListAfterUpload();
                this.commonService.notifier.notify('success', "Document Deleted Successfully.");
            }
            else {
                this.commonService.notifier.notify('success', Response.meta.message);
            }
        });
    }
    //END


    // START (COMPLETE)
    // Company Information Form
    userMasterList: any[] = [];
    companyActiveDataList: any[] = [];
    openCompanyInfoModel() {
        this.defualtCompanyInfoForm();
        this.submittedCompanyInfoData = false;
        // this.getCompanyInformationById();
        $("#add-company-details-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
    }
    closeCompanyInfoModel() {
        $("#add-company-details-modal").modal("hide");
    }
    defualtCompanyInfoForm() {
        this.companyInfoForm = this.fb.group({
            c_Email: ['', [Validators.required, Validators.pattern(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/)]],
            c_SkypeId: [''],
            companyId: [null, [Validators.required]],
            joiningDate: ['', [Validators.required]],
            designationId: [, [Validators.required]],
            technologyId: [],
            roleId: [, [Validators.required]],
            isAdminLogin: [],
            assignPersonId: [, [Validators.required]],
            _id: [''],
        })
    }
    saveCompanyInformationDetails() {
        this.submittedCompanyInfoData = true;
        if (this.companyInfoForm.invalid) {
            return;
        }


        let companyInformationDetailsObj = {
            c_Email: this.companyInfoForm.value.c_Email,
            c_SkypeId: this.companyInfoForm.value.c_SkypeId,
            joiningDate: moment(this.companyInfoForm.value.joiningDate).format('DD-MM-yyyy'),
            designationId: this.companyInfoForm.value.designationId,
            companyId: this.companyInfoForm.value.companyId,
            technologyId: this.companyInfoForm.value.technologyId,
            roleId: this.companyInfoForm.value.roleId,
            isAdminLogin: this.companyInfoForm.value.isAdminLogin,
            assignPersonId: this.companyInfoForm.value.assignPersonId,
            employeeId: this.userId
        }
        this.adminLayoutService.SaveCompanyInformationData(companyInformationDetailsObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {
                this.submittedCompanyInfoData = false;
                $("#add-company-details-modal").modal("hide");
                this.getCompanyInformationDetailsByEmpId();
                this.getLeaveBalanceByEmployeeID();
                this.commonService.notifier.notify('success', "Company Information Saved Successfully.");
            }
            else {
                this.commonService.notifier.notify('error', Res.meta.message);
            }
        });
    }
    updateCompanyInformationDetails() {
        this.submittedCompanyInfoData = true;
        if (this.companyInfoForm.invalid) {
            return;
        }
        let companyInformationDetailsObj = {
            c_Email: this.companyInfoForm.value.c_Email,
            c_SkypeId: this.companyInfoForm.value.c_SkypeId,
            joiningDate: moment(this.companyInfoForm.value.joiningDate).format('DD-MM-yyyy'),
            designationId: this.companyInfoForm.value.designationId,
            companyId: this.companyInfoForm.value.companyId,
            technologyId: this.companyInfoForm.value.technologyId,
            roleId: this.companyInfoForm.value.roleId,
            isAdminLogin: this.companyInfoForm.value.isAdminLogin,
            assignPersonId: this.companyInfoForm.value.assignPersonId,
            employeeId: this.userId
        }
        this.adminLayoutService.UpdateCompanyInformationData(companyInformationDetailsObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {
                this.submittedCompanyInfoData = false;
                $("#add-company-details-modal").modal("hide");
                this.getCompanyInformationDetailsByEmpId();
                this.commonService.notifier.notify('success', "Company Information Updated Successfully.");
            }
            else {
                this.commonService.notifier.notify('error', Res.meta.message);
            }
        });
    }
    getCompanyInformationById(id) {
        let EducationDetailsObj = {
            employeeId: id
        }
        this.adminLayoutService.getCompanyDetailsByID(EducationDetailsObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {

                this.companyInfoForm.controls._id.setValue(Res.data._id);
                this.companyInfoForm.controls.c_Email.setValue(Res.data.c_Email);
                this.companyInfoForm.controls.c_SkypeId.setValue(Res.data.c_SkypeId);

                if (Res.data.joiningDate.includes('-')) {
                    this.companyInfoForm.controls.joiningDate.setValue(new Date(Res.data.joiningDate.split('-')[2] + '-' + Res.data.joiningDate.split('-')[1] + '-' + Res.data.joiningDate.split('-')[0]));
                }
                else {
                    this.companyInfoForm.controls.joiningDate.setValue(new Date(Res.data.joiningDate.split('/')[2] + '-' + Res.data.joiningDate.split('/')[1] + '-' + Res.data.joiningDate.split('/')[0]));
                }

                this.companyInfoForm.controls.designationId.setValue(Res.data.designationId);
                this.companyInfoForm.controls.companyId.setValue(Res.data.companyId);
                this.companyInfoForm.controls.technologyId.setValue(Res.data.technologyId);
                this.companyInfoForm.controls.roleId.setValue(Res.data.roleId);
                this.companyInfoForm.controls.isAdminLogin.setValue(Res.data.isAdminLogin);
                this.companyInfoForm.controls.assignPersonId.setValue(Res.data.assignPersonId);

                $("#add-company-details-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
            }
            else if (Res.meta.code === 1010) {
                this.defualtCompanyInfoForm();
                $("#add-company-details-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
            }
        });
    }
    getCompanyInformationDetailsByEmpId() {
        let empId = {
            employeeId: this.userId
        }
        this.adminLayoutService.getCompanyDetailsByEmployeeID(empId).subscribe((Response: any) => {
            if (Response.meta.code == 200) {

                this.employeeCompanyList = Response.data;
            }
            else {
                this.employeeCompanyList = '';
            }
        });
    }
    getUserActiveList() {
        this.adminLayoutService.getuserMaster().subscribe((Response: any) => {

            if (Response.meta.code == 200) {

                this.userMasterList = Response.data.filter((x: any) => {
                    return x.empCompanyInfoData?.status === 1 && x._id != this.userId;
                });

            }
        })
    }
    sendLoginCredetial() {
        let Obj = {
            employeeId: this.userId
        }
        this.adminLayoutService.sendLoginCredential(Obj).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.commonService.notifier.notify('success', "Login Credential Send Successfully.");
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message);
            }
        })
    }
    getCompanyActiveList() {
        this.companyActiveDataList = [];

        this.companyManagementService.getCompanyActiveList().subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                this.companyActiveDataList = Response.data;
            }
        }, (error) => {
            console.log(error.error.Message);
        });
    }
    //END


    // education details form
    IsEducationDetails: boolean = false;
    toyearArray = new Array<number>();
    from(e) {

        if (!e) {
            this.educationDetailsForm.controls.toYear.setValue(null);
        }
        this.toyearArray = new Array<number>();
        let d = new Date();

        for (let index = 0; index < 50; index++) {
            let prYear = d.getFullYear();
            let arr = prYear - index;
            if (arr > e) {
                this.toyearArray.push(arr)
            }

        }
        this.educationDetailsForm.controls.toYear.setValue(null);
        return this.toyearArray;
    }
    defaultEducationDetailsForm() {
        this.educationDetailsForm = this.fb.group({
            _id: [],
            qualification: ['', [Validators.required]],
            universityName: ['', [Validators.required]],
            fromYear: [, [Validators.required]],
            toYear: [, [Validators.required]],
            fromMonth: [, [Validators.required]],
            toMonth: [, [Validators.required]],
            grade: ['', [Validators.required]],
        })
    }
    addEducationDetails() {
        this.IsEducationDetails = false;
        this.submittedEducationDetailsData = false;
        this.defaultEducationDetailsForm();
        $("#add-education-details-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
    }
    cancelEducationDetails() {
        this.defaultEducationDetailsForm();
        this.submittedEducationDetailsData = false;
        $("#add-education-details-modal").modal("hide");
    }
    saveEducationDetails() {
        this.submittedEducationDetailsData = true;
        if (this.educationDetailsForm.invalid) {
            return;
        }
        let educationDetailsObj = {
            qualification: this.educationDetailsForm.value.qualification,
            universityName: this.educationDetailsForm.value.universityName,
            fromYear: this.educationDetailsForm.value.fromYear.toString(),
            toYear: this.educationDetailsForm.value.toYear.toString(),
            fromMonth: this.educationDetailsForm.value.fromMonth,
            toMonth: this.educationDetailsForm.value.toMonth,
            grade: this.educationDetailsForm.value.grade,
            employeeId: this.userId,
        }
        this.adminLayoutService.SaveEducationDetailsData(educationDetailsObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {
                this.IsEducationDetails = false;
                this.submittedEducationDetailsData = false;
                this.defaultEducationDetailsForm();
                $("#add-education-details-modal").modal("hide");
                this.getEducationDetailsByEmployeeID();
                this.commonService.notifier.notify('success', "Education Details Saved Successfully.");
            }
            else {
                this.commonService.notifier.notify('error', Res.meta.message);
            }
        });
    }
    updateEducationDetails() {
        this.submittedEducationDetailsData = true;
        if (this.educationDetailsForm.invalid) {
            return;
        }
        let educationDetailsObj = {
            qualification: this.educationDetailsForm.value.qualification,
            universityName: this.educationDetailsForm.value.universityName,
            fromYear: this.educationDetailsForm.value.fromYear.toString(),
            toYear: this.educationDetailsForm.value.toYear.toString(),
            fromMonth: this.educationDetailsForm.value.fromMonth,
            toMonth: this.educationDetailsForm.value.toMonth,
            grade: this.educationDetailsForm.value.grade,
            _id: this.educationDetailsForm.value._id,
        }
        this.adminLayoutService.UpdateEducationDetailsData(educationDetailsObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {
                this.IsEducationDetails = false;
                this.submittedEducationDetailsData = false;
                this.defaultEducationDetailsForm();
                $("#add-education-details-modal").modal("hide");
                this.getEducationDetailsByEmployeeID();
                this.commonService.notifier.notify('success', "Education Details Updated Successfully.");
            }
            else {
                this.commonService.notifier.notify('error', Res.meta.message);
            }
        });
    }
    getEducationDetailsById(id) {
        let EducationDetailsObj = {
            _id: id
        }
        this.adminLayoutService.getEducationDetailsById(EducationDetailsObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {

                this.educationDetailsForm.controls._id.setValue(Res.data._id);
                this.educationDetailsForm.controls.qualification.setValue(Res.data.qualification);
                this.educationDetailsForm.controls.universityName.setValue(Res.data.universityName);
                this.educationDetailsForm.controls.fromYear.setValue(Res.data.fromYear);
                this.educationDetailsForm.controls.toYear.setValue(Res.data.toYear);
                this.educationDetailsForm.controls.fromMonth.setValue(Res.data.fromMonth);
                this.educationDetailsForm.controls.toMonth.setValue(Res.data.toMonth);
                this.educationDetailsForm.controls.grade.setValue(Res.data.grade);
                this.IsEducationDetails = true;
                $("#add-education-details-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
            }
        });
    }
    getEducationDetailsByEmployeeID() {
        let Obj = {
            employeeId: this.userId
        }
        this.adminLayoutService.getEducationDetailsByEmployeeID(Obj).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.educationDetailsList = Response.data
            }
        });

    }
    deleteEducationDetailsById(id) {
        let Obj = {
            _id: id
        }
        this.adminLayoutService.deleteEducationDetailsById(Obj).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.getEducationDetailsByEmployeeID();
                this.commonService.notifier.notify('success', "Education Details Deleted Successfully.");
            }
            else {
                this.commonService.notifier.notify('success', Response.meta.message);
            }
        });
    }

    // Experience details form
    IsExperienceDetails: boolean = false;
    IsDocumentError: boolean = false;
    IsFromToDateError: boolean = false;
    // IsFromDateError: boolean = false;
    // IsToDateError: boolean = false;
    defaultExperienceDetailsForm() {
        this.experienceDetailsForm = this.fb.group({
            _id: [],
            companyName: ['', [Validators.required]],
            totalExperience: [''],
            // Date: ['', [Validators.required]],
            fromDate: ['', [Validators.required]],
            toDate: ['', [Validators.required]],
            designation: [, [Validators.required]],
        })
    }
    minToDate = null;
    showInvalidToDate: boolean = false;
    onFromDateChange() {
        if (this.experienceDetailsForm.controls.fromDate.value) {
            this.minToDate = new Date(this.experienceDetailsForm.controls.fromDate.value)
            this.experienceDetailsForm.controls.toDate.setValue('');
        }
    }

    // toMinDate: any;
    addExperienceDetails() {
        this.IsExperienceDetails = false;
        this.submittedExperienceDetailsData = false;
        this.defaultExperienceDetailsForm();
        this.resultofExpDocument = "";
        this.resultofExpShowDocument = "";

        this.myInputExpVariable.nativeElement.value = "";
        $("#add-experience-details-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
    }
    cancelExperienceDetails() {
        this.defaultExperienceDetailsForm();
        this.submittedExperienceDetailsData = false;
        this.myInputExpVariable.nativeElement.value = "";
        this.resultofExpDocument = "";
        this.resultofExpShowDocument = "";
        this.IsDocumentError = false;
        $("#add-experience-details-modal").modal("hide");
    }
    dateAgo(s_date, e_date) {
        var startDate: any = new Date(s_date);
        var endDate: any = new Date(e_date);
        var diffDate: any = new Date(endDate - startDate);
        return ((diffDate.toISOString().slice(0, 4) - 1970) + " Years " +
            diffDate.getMonth() + " Months " + (diffDate.getDate() - 1) + " Days");
    }
    saveExperienceDetails() {

        this.submittedExperienceDetailsData = true;
        if (this.resultofExpDocument == '' || !this.resultofExpDocument) {
            this.IsDocumentError = true;
        }

        if (this.experienceDetailsForm.invalid || this.IsDocumentError === true) {
            return;
        }


        var diff = Math.floor(new Date(this.experienceDetailsForm.value.toDate).getTime() - new Date(this.experienceDetailsForm.value.fromDate).getTime());
        var day = 1000 * 60 * 60 * 24;
        var days = Math.floor(diff / day);
        var months = Math.floor(days / 31);
        var years = Math.floor(months / 12);
        let totalExperience = months + " Months " + years + " Years";

        let experienceDetailsObj: FormData = new FormData();
        experienceDetailsObj.append('companyName', this.experienceDetailsForm.value.companyName);
        experienceDetailsObj.append('totalExperience', totalExperience);
        experienceDetailsObj.append('fromDate', moment(this.experienceDetailsForm.value.fromDate).format('DD-MM-yyyy'));
        experienceDetailsObj.append('toDate', moment(this.experienceDetailsForm.value.toDate).format('DD-MM-yyyy'));
        experienceDetailsObj.append('designation', this.experienceDetailsForm.value.designation);
        experienceDetailsObj.append('experienceFile', this.resultofExpDocument);
        experienceDetailsObj.append('employeeId', this.userId);
        // return
        this.adminLayoutService.SaveExperienceDetailsData(experienceDetailsObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {
                this.IsExperienceDetails = false;
                this.submittedExperienceDetailsData = false;
                this.defaultExperienceDetailsForm();
                $("#add-experience-details-modal").modal("hide");
                this.resultofExpDocument = "";
                this.resultofExpShowDocument = "";
                this.IsFromToDateError = false;
                // this.IsFromDateError = false;
                // this.IsToDateError = false;
                this.IsDocumentError = false;
                this.getExperienceDetailsByEmployeeID();
                this.commonService.notifier.notify('success', "Experience Details Saved Successfully.");
            }
            else {
                this.commonService.notifier.notify('error', Res.meta.message);
            }
        });
    }
    updateExperienceDetails() {

        this.submittedExperienceDetailsData = true;
        if (this.resultofExpDocument == '' || !this.resultofExpDocument) {
            this.IsDocumentError = true;
        }

        if (this.experienceDetailsForm.invalid || this.IsDocumentError === true) {
            return;
        }


        var diff = Math.floor(new Date(this.experienceDetailsForm.value.toDate).getTime() - new Date(this.experienceDetailsForm.value.fromDate).getTime());
        var day = 1000 * 60 * 60 * 24;
        var days = Math.floor(diff / day);
        var months = Math.floor(days / 31);
        var years = Math.floor(months / 12);
        let totalExperience = months + " Months " + years + " Years";


        let experienceDetailsObj: FormData = new FormData();
        experienceDetailsObj.append('companyName', this.experienceDetailsForm.value.companyName);
        experienceDetailsObj.append('totalExperience', totalExperience);
        experienceDetailsObj.append('fromDate', moment(this.experienceDetailsForm.value.fromDate).format('DD-MM-yyyy'));
        experienceDetailsObj.append('toDate', moment(this.experienceDetailsForm.value.toDate).format('DD-MM-yyyy'));
        experienceDetailsObj.append('designation', this.experienceDetailsForm.value.designation);
        experienceDetailsObj.append('experienceFile', this.resultofExpDocument);
        experienceDetailsObj.append('_id', this.experienceDetailsForm.value._id);
        // return
        this.adminLayoutService.UpdateExperienceDetailsData(experienceDetailsObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {
                this.IsExperienceDetails = false;
                this.submittedExperienceDetailsData = false;
                this.defaultExperienceDetailsForm();
                $("#add-experience-details-modal").modal("hide");
                this.resultofExpDocument = "";
                this.resultofExpShowDocument = "";
                this.IsFromToDateError = false;
                // this.IsFromDateError = false;
                // this.IsToDateError = false;
                this.IsDocumentError = false;
                this.getExperienceDetailsByEmployeeID();
                this.commonService.notifier.notify('success', "Experience Details Updated Successfully.");
            }
            else {
                this.commonService.notifier.notify('error', Res.meta.message);
            }
        });
    }
    getExperienceDetailsById(id) {
        let EducationDetailsObj = {
            _id: id
        }
        this.adminLayoutService.getExperienceDetailsById(EducationDetailsObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {

                this.experienceDetailsForm.controls._id.setValue(Res.data._id);
                this.experienceDetailsForm.controls.companyName.setValue(Res.data.companyName);
                this.experienceDetailsForm.controls.fromDate.setValue(new Date(Res.data.fromDate.split('-')[2] + '-' + Res.data.fromDate.split('-')[1] + '-' + Res.data.fromDate.split('-')[0]));
                this.experienceDetailsForm.controls.toDate.setValue(new Date(Res.data.toDate.split('-')[2] + '-' + Res.data.toDate.split('-')[1] + '-' + Res.data.toDate.split('-')[0]));
                this.experienceDetailsForm.controls.totalExperience.setValue(Res.data.totalExperience);
                this.experienceDetailsForm.controls.designation.setValue(Res.data.designation);
                this.resultofExpShowDocument = {
                    name: Res.data.experienceFile
                };
                this.resultofExpDocument = Res.data.experienceFile;
                this.IsExperienceDetails = true;
                $("#add-experience-details-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
            }
        });
    }
    getExperienceDetailsByEmployeeID() {
        this.experienceDetailsList = [];
        let Obj = {
            employeeId: this.userId
        }
        this.adminLayoutService.getExperienceDetailsByEmployeeID(Obj).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                Response.data.forEach((x: any) => {
                    let Obj = {
                        _id: x._id,
                        companyName: x.companyName,
                        designation: x.designation,
                        designationName: x.designationName,
                        employeeId: x.employeeId,
                        experienceFile: x.experienceFile,
                        isDeleted: x.isDeleted,
                        status: x.status,
                        totalExperience: x.totalExperience,
                        fromDate: new Date(x.fromDate.split('-')[2] + '-' + x.fromDate.split('-')[1] + '-' + x.fromDate.split('-')[0]),
                        toDate: new Date(x.toDate.split('-')[2] + '-' + x.toDate.split('-')[1] + '-' + x.toDate.split('-')[0]),
                    }
                    this.experienceDetailsList.push(Obj);
                });
                // this.experienceDetailsList = Response.data
            }
        });

    }
    onExpDocumentChange(event: any) {

        this.resultofExpDocument = event.target.files[0];
        this.resultofExpShowDocument = event.target.files[0];
        if (this.resultofExpDocument.name) {
            this.IsDocumentError = false;
        }
        this.myInputExpVariable.nativeElement.value = "";
    }
    removeExpDocument() {
        this.resultofExpDocument = "";
        this.resultofExpShowDocument = "";
        this.IsDocumentError = true;
        this.myInputExpVariable.nativeElement.value = "";
    }
    deleteExperienceDetailsById(id) {
        let Obj = {
            _id: id
        }
        this.adminLayoutService.deleteExperienceDetailsById(Obj).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.getExperienceDetailsByEmployeeID();
                this.commonService.notifier.notify('success', "Experience Details Deleted Successfully.");
            }
            else {
                this.commonService.notifier.notify('success', Response.meta.message);
            }
        });
    }

    // Resume Information Form
    resumeDetailsList: any;

    addResumeDetails() {
        // this.defaultResumeInfoForm();
        this.submittedResumeInfoData = false;

        $("#add-resume-information-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
    }
    cancelResumeDetails() {
        // this.defaultResumeInfoForm();
        this.submittedResumeInfoData = false;
        this.getEmpResumeInformationDetailsByEmpId()
        $("#add-resume-information-modal").modal("hide");
    }
    defaultResumeInfoForm() {
        this.resumeInfoForm = this.fb.group({
            _id: [''],
            projectId: [''],
            professionalSummary: ['', [Validators.required]],
            competencies: this.fb.array([]),
            technicalProfile: this.fb.array([]),
            software: this.fb.array([]),
            language: this.fb.array([])
        })
    }

    createCompetenciesData(oItem?: any) {
        let competenciesArray: any;
        competenciesArray = this.resumeInfoForm.get('competencies') as FormArray;
        let obj = this.fb.group({
            competenciesData: [(oItem ? oItem['competenciesData'] : '')]
        })
        competenciesArray.push(obj);
    }
    removeCompentencies(index: any) {
        (this.resumeInfoForm.controls['competencies'] as FormArray).removeAt(index);
    }
    createtechnicalProfile(oItem?: any) {
        let technicalProfileArray: any;
        technicalProfileArray = this.resumeInfoForm.get('technicalProfile') as FormArray;
        let obj = this.fb.group({
            technicalProfileData: [(oItem ? oItem['technicalProfileData'] : '')]
        })
        technicalProfileArray.push(obj);
    }
    removetechnicalProfile(index: any) {
        (this.resumeInfoForm.controls['technicalProfile'] as FormArray).removeAt(index);
    }
    createsoftware(oItem?: any) {
        let softwareArray: any;
        softwareArray = this.resumeInfoForm.get('software') as FormArray;
        let obj = this.fb.group({
            softwareData: [(oItem ? oItem['softwareData'] : '')]
        })
        softwareArray.push(obj);
    }
    removesoftware(index: any) {
        (this.resumeInfoForm.controls['software'] as FormArray).removeAt(index);
    }
    createlanguage(oItem?: any) {
        let languageArray: any;
        languageArray = this.resumeInfoForm.get('language') as FormArray;
        let obj = this.fb.group({
            languageData: [(oItem ? oItem['languageData'] : '')]
        })
        languageArray.push(obj);
    }
    removelanguage(index: any) {
        (this.resumeInfoForm.controls['language'] as FormArray).removeAt(index);
    }


    saveResumeInformationDetails() {
        debugger
        this.submittedResumeInfoData = true;
        if (this.resumeInfoForm.invalid) {
            return;
        }
        let resumeInformationDetailsObj = {
            professionalSummary: this.resumeInfoForm.value.professionalSummary,
            competencies: this.resumeInfoForm.value.competencies,
            technicalProfile: this.resumeInfoForm.value.technicalProfile,
            software: this.resumeInfoForm.value.software,
            language: this.resumeInfoForm.value.language,
            projectId: this.resumeInfoForm.value.projectId,
            employeeId: this.userId
        }
        this.adminLayoutService.SaveResumeInformationData(resumeInformationDetailsObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {
                this.submittedResumeInfoData = false;
                this.defaultResumeInfoForm();
                this.getEmpResumeInformationDetailsByEmpId();
                $("#add-resume-information-modal").modal("hide");
                this.commonService.notifier.notify('success', "Resume Information Saved Successfully.");
            }
            else {
                this.commonService.notifier.notify('error', Res.meta.message);
            }
        });
    }
    updateResumeInformationDetails() {
        debugger
        this.submittedResumeInfoData = true;
        if (this.resumeInfoForm.invalid) {
            return;
        }
        let resumeInformationDetailsObj = {
            professionalSummary: this.resumeInfoForm.value.professionalSummary,
            competencies: this.resumeInfoForm.value.competencies,
            technicalProfile: this.resumeInfoForm.value.technicalProfile,
            software: this.resumeInfoForm.value.software,
            language: this.resumeInfoForm.value.language,
            projectId: this.resumeInfoForm.value.projectId,
            employeeId: this.userId
        }
        this.adminLayoutService.UpdateResumeInformationData(resumeInformationDetailsObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {
                this.submittedResumeInfoData = false;
                this.defaultResumeInfoForm();
                this.getEmpResumeInformationDetailsByEmpId();
                $("#add-resume-information-modal").modal("hide");
                this.commonService.notifier.notify('success', "Resume Information Updated Successfully.");
            }
            else {
                this.commonService.notifier.notify('error', Res.meta.message);
            }
        });
    }
    getEmpResumeInformationDetailsByEmpId() {
        this.empResumeDetailsList = ''
        let empResumeId = {
            empId: this.userId
        }
        this.adminLayoutService.getResumeDetailsByEmpID(empResumeId).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.empResumeDetailsList = Response.data;
            }
        });
    }
    getResumeInformationDetailsById() {
        debugger
        this.resumeInfoForm.controls.professionalSummary.setValue(this.empResumeDetailsList.professionalSummary);

        this.empResumeDetailsList.competencies.map((x: any) => {
            this.createCompetenciesData(x);
        })
        this.empResumeDetailsList.technicalProfile.map((x: any) => {
            this.createtechnicalProfile(x);
        })
        this.empResumeDetailsList.software.map((x: any) => {
            this.createsoftware(x);
        })
        this.empResumeDetailsList.language.map((x: any) => {
            this.createlanguage(x);
        })
        this.resumeInfoForm.controls.projectId.setValue(this.empResumeDetailsList.projectId)
        $("#add-resume-information-modal").modal({ backdrop: 'static', keyboard: false, show: true });

    }

    projectDetailsList: any[] = [];
    // project details
    getProjectDetails() {
        this.projectDetailsList = []
        let obj = {
            employeeId: this.userId
        }
        this.adminLayoutService.getProjectDetailsByEmployeeId(obj).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.projectDetailsList = Response.data
            }
        })
    }
    removeAssignProject(id: any, projectId: any) {
        let obj = {
            _id: id,
            employeeId: this.userId,
            assignProjectId: projectId,
            remark: ''
        }
        this.adminLayoutService.removeTeamAssign(obj).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.getProjectDetails()
                this.commonService.notifier.notify('success', 'Project Removed From this assign employee.')
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message)
            }
        })
    }
    teamAssignForm: FormGroup;
    submitAssign: boolean = false;
    technologyMasterList: any[] = [];

    defaultAssignTeamForm() {
        this.teamAssignForm = this.fb.group({
            _id: [],
            projectId: [null, [Validators.required]],
            isPoc: [false],
            remark: [null],
        })
    }
    addTeam() {
        this.defaultAssignTeamForm();
        this.submitAssign = false;
        $("#assign-team-modal").modal({ backdrop: 'static', keyboard: false, show: true });
    }

    closeAssignEdit() {
        this.defaultAssignTeamForm();
        $("#assign-team-modal").modal("hide");
    }

    saveTeamAssign() {
        if (this.teamAssignForm.invalid) {
            this.submitAssign = true;
            return;
        }
        let employeearray = [];
        employeearray.push(this.userId)
        let params = {

            'employeeId': employeearray,
            'projectId': this.teamAssignForm.controls.projectId.value,
            'isPoc': this.teamAssignForm.controls.isPoc.value,
            'remark': this.teamAssignForm.controls.remark.value,
        }

        this.adminLayoutService.saveTeamAssignData(params).subscribe((Res: any) => {
            if (Res.meta.code == 200) {
                this.submitAssign = false;
                this.defaultAssignTeamForm();
                $("#assign-team-modal").modal("hide");
                this.getProjectDetails()
                this.commonService.notifier.notify('success', "Assign Team Member Successfully.");
            }
            else {
                this.commonService.notifier.notify('error', Res.meta.message);
            }
        })
    }


    // Bank Information Form
    bankDetailsList: any;
    addBankDetails() {
        this.defaultBankForm();
        this.submittedBankDetailsData = false;
        $("#add-bank-information-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
    }
    cancelBankDetails() {
        this.defaultBankForm();
        this.submittedBankDetailsData = false;
        $("#add-bank-information-modal").modal("hide");
    }

    defaultBankForm() {
        this.bankDetailsForm = this.fb.group({
            _id: [''],
            bankName: ['', [Validators.required]],
            bankAccountNo: ['', [Validators.required]],
            ifscCode: ['', [Validators.required]],
            panNo: ['', [Validators.required]],
        })
    }
    saveBankDetails() {

        this.submittedBankDetailsData = true;
        if (this.bankDetailsForm.invalid) {
            return
        }
        let bankDetailsObj = {
            employeeId: this.userId,
            bankName: this.bankDetailsForm.value.bankName,
            bankAccountNo: this.bankDetailsForm.value.bankAccountNo,
            ifscCode: this.bankDetailsForm.value.ifscCode.toUpperCase(),
            panNo: this.bankDetailsForm.value.panNo.toUpperCase(),
        }
        this.adminLayoutService.SaveBankDetailsData(bankDetailsObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {
                this.submittedBankDetailsData = false;
                this.defaultBankForm();
                $("#add-bank-information-modal").modal("hide");
                this.getBankDetailsByEmployeeID();
                this.commonService.notifier.notify('success', "Bank Details Saved Successfully.");
            }
        });
    }
    updateBankDetails() {
        this.submittedBankDetailsData = true;
        if (this.bankDetailsForm.invalid) {
            return
        }
        let bankDetailsObj = {
            _id: this.bankDetailsForm.value._id,
            bankName: this.bankDetailsForm.value.bankName,
            bankAccountNo: this.bankDetailsForm.value.bankAccountNo,
            ifscCode: this.bankDetailsForm.value.ifscCode.toUpperCase(),
            panNo: this.bankDetailsForm.value.panNo.toUpperCase(),
        }
        this.adminLayoutService.UpdateBankDetailsData(bankDetailsObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {
                this.submittedBankDetailsData = false;
                this.defaultBankForm();
                this.getBankDetailsByEmployeeID();
                $("#add-bank-information-modal").modal("hide");
                this.commonService.notifier.notify('success', "Bank Details Updated Successfully.");
            }
        });
    }
    getBankDetailsById(id) {
        let EducationDetailsObj = {
            _id: id
        }
        this.adminLayoutService.getBankDetailsById(EducationDetailsObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {
                this.bankDetailsForm.controls._id.setValue(Res.data._id)
                this.bankDetailsForm.controls.bankName.setValue(Res.data.bankName)
                this.bankDetailsForm.controls.bankAccountNo.setValue(Res.data.bankAccountNo)
                this.bankDetailsForm.controls.ifscCode.setValue(Res.data.ifscCode)
                this.bankDetailsForm.controls.panNo.setValue(Res.data.panNo)
                $("#add-bank-information-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
            }
        });
    }
    getBankDetailsByEmployeeID() {
        let Obj = {
            employeeId: this.userId
        }

        this.adminLayoutService.getBankDetailsByEmployeeID(Obj).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.bankDetailsList = Response.data;

            }
        });

    }

    // Salary Information Form
    salaryDetailsList: any;
    IsEditSalaryDetails: boolean = false;
    addSalaryDetails() {
        this.defaultSalaryForm();
        this.submittedSalaryDetailsData = false;
        this.IsEditSalaryDetails = false;
        $("#add-salary-information-modal").modal({ backdrop: 'static', keyboard: false, show: true });
    }
    cancelSalaryDetails() {
        this.submittedSalaryDetailsData = false;
        this.defaultSalaryForm();
        this.IsEditSalaryDetails = false;
        $("#add-salary-information-modal").modal("hide");
    }
    defaultSalaryForm() {
        this.salaryDetailsForm = this.fb.group({
            _id: [''],
            totalSalary: ['0'],
            basicSalary: ['0', [Validators.required]],
            startDate: ['', [Validators.required]],
            endDate: [null],
            isLatest: [false],
            isFirst: [false],
            HRA: ['0', [Validators.required]],
            professionalText: ['0', [Validators.required]],
            transportAllowance: ['0', [Validators.required]],
            PF: ['0', [Validators.required]],
            PFEmployer: ['0', [Validators.required]],
            miscellaneousAllowances: ['0', [Validators.required]],
        })
    }
    saveSalaryDetails() {

        this.submittedSalaryDetailsData = true;
        if (this.salaryDetailsForm.invalid) {
            return;
        }


        let salaryDetailsObj = {
            employeeId: this.userId,
            totalSalary: this.salaryDetailsForm.value.totalSalary,
            basicSalary: this.salaryDetailsForm.value.basicSalary,
            startDate: moment(this.salaryDetailsForm.value.startDate).format('DD/MM/yyyy'),
            endDate: this.salaryDetailsForm.value.endDate ? moment(this.salaryDetailsForm.value.endDate).format('DD/MM/yyyy') : '',
            HRA: this.salaryDetailsForm.value.HRA,
            professionalText: this.salaryDetailsForm.value.professionalText,
            transportAllowance: this.salaryDetailsForm.value.transportAllowance,
            PF: this.salaryDetailsForm.value.PF,
            PFEmployer: this.salaryDetailsForm.value.PFEmployer,
            miscellaneousAllowances: this.salaryDetailsForm.value.miscellaneousAllowances,
            isLatest: this.salaryDetailsForm.value.isLatest,
            isFirst: this.salaryDetailsForm.value.isFirst,
        }
        this.adminLayoutService.SaveSalaryDetailsData(salaryDetailsObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {
                this.submittedSalaryDetailsData = false;
                this.defaultSalaryForm();
                this.IsEditSalaryDetails = false;
                this.getSalaryDetailsByEmployeeID();
                $("#add-salary-information-modal").modal("hide");
                this.commonService.notifier.notify('success', "Salary Details Saved Successfully.");

            }
        });
    }
    updateSalaryDetails() {
        this.submittedSalaryDetailsData = true;
        if (this.salaryDetailsForm.invalid) {
            return
        }

        let salaryDetailsObj = {
            _id: this.salaryDetailsForm.value._id,
            employeeId: this.userId,
            totalSalary: this.salaryDetailsForm.value.totalSalary,
            basicSalary: this.salaryDetailsForm.value.basicSalary,
            startDate: moment(this.salaryDetailsForm.value.startDate).format('DD/MM/yyyy'),
            endDate: this.salaryDetailsForm.value.endDate ? moment(this.salaryDetailsForm.value.endDate).format('DD/MM/yyyy') : '',
            HRA: this.salaryDetailsForm.value.HRA,
            professionalText: this.salaryDetailsForm.value.professionalText,
            transportAllowance: this.salaryDetailsForm.value.transportAllowance,
            PF: this.salaryDetailsForm.value.PF,
            PFEmployer: this.salaryDetailsForm.value.PFEmployer,
            miscellaneousAllowances: this.salaryDetailsForm.value.miscellaneousAllowances,
            isLatest: this.salaryDetailsForm.value.isLatest,
            isFirst: this.salaryDetailsForm.value.isFirst,
        }
        this.adminLayoutService.UpdateSalaryDetailsData(salaryDetailsObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {
                this.submittedSalaryDetailsData = false;
                this.defaultSalaryForm();
                this.IsEditSalaryDetails = false;
                this.getSalaryDetailsByEmployeeID();
                $("#add-salary-information-modal").modal("hide");
                this.commonService.notifier.notify('success', "Salary Details Updated Successfully.");

            }
        });
    }
    getSalaryDetailsById(id) {
        let SalaryDetailsObj = {
            _id: id
        }
        this.adminLayoutService.getSalaryDetailsById(SalaryDetailsObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {

                this.salaryDetailsForm.controls._id.setValue(Res.data._id);
                this.salaryDetailsForm.controls.basicSalary.setValue(Res.data.basicSalary);
                this.salaryDetailsForm.controls.totalSalary.setValue(Res.data.totalSalary);
                this.salaryDetailsForm.controls.startDate.setValue(new Date(Res.data.startDate.split('/')[2] + '-' + Res.data.startDate.split('/')[1] + '-' + Res.data.startDate.split('/')[0]));
                if (Res.data.endDate) {
                    this.salaryDetailsForm.controls.endDate.setValue(new Date(Res.data.endDate.split('/')[2] + '-' + Res.data.endDate.split('/')[1] + '-' + Res.data.endDate.split('/')[0]));
                }
                this.salaryDetailsForm.controls.HRA.setValue(Res.data.HRA);
                this.salaryDetailsForm.controls.professionalText.setValue(Res.data.professionalText);
                this.salaryDetailsForm.controls.transportAllowance.setValue(Res.data.transportAllowance);
                this.salaryDetailsForm.controls.PF.setValue(Res.data.PF);
                this.salaryDetailsForm.controls.PFEmployer.setValue(Res.data.PFEmployer);
                this.salaryDetailsForm.controls.miscellaneousAllowances.setValue(Res.data.miscellaneousAllowances);
                this.salaryDetailsForm.controls.isLatest.setValue(Res.data.isLatest);
                this.salaryDetailsForm.controls.isFirst.setValue(Res.data.isFirst);
                this.IsEditSalaryDetails = true;
                $("#add-salary-information-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
            }
        });
    }
    getSalaryDetailsByEmployeeID() {
        this.salaryDetailsList = [];
        let Obj = {
            employeeId: this.userId
        }

        this.adminLayoutService.getSalaryDetailsByEmployeeID(Obj).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.salaryDetailsList = Response.data;

            }
        });

    }
    getTotalSalary() {
        let basicsalary = parseInt(this.salaryDetailsForm.value.basicSalary);
        let HRA = parseInt(this.salaryDetailsForm.value.HRA);
        let miscellaneousAllowances = parseInt(this.salaryDetailsForm.value.miscellaneousAllowances);
        let professionalText = parseInt(this.salaryDetailsForm.value.professionalText);
        let transportAllowance = parseInt(this.salaryDetailsForm.value.transportAllowance);

        let totalSalaryCalculation = basicsalary + HRA + miscellaneousAllowances + transportAllowance;

        this.salaryDetailsForm.controls.totalSalary.setValue(totalSalaryCalculation.toString());
    }


    // monthly salary details api calling
    submittedMonthlySalaryDetailsData: boolean = false;
    IsEditMonthlySalaryDetails: boolean = false;
    monthlySalaryDetailsList: any[] = [];
    monthlySalaryYearArray = new Array<number>();
    monthlySalaryMonthArray = [
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
    getMonthlySalaryYear() {
        this.monthlySalaryYearArray = new Array<number>();
        let d = new Date();
        let startYear = 2019;
        while (startYear <= d.getFullYear()) {
            this.monthlySalaryYearArray.push(startYear++);
        }
        this.monthlySalaryYearArray = this.monthlySalaryYearArray.sort((a, b) => b - a)
        return this.monthlySalaryYearArray;
    }
    defaultMonthlySalaryForm() {
        this.monthlySalaryDetailsForm = this.fb.group({
            _id: [''],
            month: [null, [Validators.required]],
            year: [null, [Validators.required]],
            totalSalary: [0],
            basicSalary: [0, [Validators.required]],
            HRA: [0, [Validators.required]],
            professionalText: [0, [Validators.required]],
            transportAllowance: [0, [Validators.required]],
            PF: [0, [Validators.required]],
            PFEmployer: [0, [Validators.required]],
            miscellaneousAllowances: [0, [Validators.required]],
        })
    }
    addMonthlySalaryDetails() {
        this.defaultMonthlySalaryForm();
        this.submittedMonthlySalaryDetailsData = false;
        this.IsEditMonthlySalaryDetails = false;
        $("#add-monthly-salary-information-modal").modal({ backdrop: 'static', keyboard: false, show: true });
    }
    cancelMonthlySalaryDetails() {
        this.defaultMonthlySalaryForm();
        this.submittedMonthlySalaryDetailsData = false;
        this.IsEditMonthlySalaryDetails = false;
        $("#add-monthly-salary-information-modal").modal("hide");
    }
    saveMonthlySalaryDetails() {
        this.submittedMonthlySalaryDetailsData = true;
        if (this.monthlySalaryDetailsForm.invalid) {
            return;
        }

        let salaryDetailsObj = {
            employeeId: this.userId,
            totalSalary: parseFloat(this.monthlySalaryDetailsForm.value.totalSalary),
            month: parseInt(this.monthlySalaryDetailsForm.value.month),
            year: parseInt(this.monthlySalaryDetailsForm.value.year),
            basicSalary: parseFloat(this.monthlySalaryDetailsForm.value.basicSalary),
            HRA: parseFloat(this.monthlySalaryDetailsForm.value.HRA),
            professionalText: parseFloat(this.monthlySalaryDetailsForm.value.professionalText),
            transportAllowance: parseFloat(this.monthlySalaryDetailsForm.value.transportAllowance),
            PF: parseFloat(this.monthlySalaryDetailsForm.value.PF),
            PFEmployer: parseFloat(this.monthlySalaryDetailsForm.value.PFEmployer),
            miscellaneousAllowances: parseFloat(this.monthlySalaryDetailsForm.value.miscellaneousAllowances),
        }
        this.adminLayoutService.SaveMonthlySalaryDetailsData(salaryDetailsObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {
                this.submittedMonthlySalaryDetailsData = false;
                this.defaultMonthlySalaryForm();
                this.IsEditMonthlySalaryDetails = false;
                this.getMonthlySalaryDetailsByEmployeeID();
                $("#add-monthly-salary-information-modal").modal("hide");
                this.commonService.notifier.notify('success', "Monthly Salary Details Saved Successfully.");

            }
        });
    }
    updateMonthlySalaryDetails() {
        this.submittedMonthlySalaryDetailsData = true;
        if (this.monthlySalaryDetailsForm.invalid) {
            return;
        }

        let salaryDetailsObj = {
            employeeId: this.userId,
            _id: this.monthlySalaryDetailsForm.value._id,
            totalSalary: parseFloat(this.monthlySalaryDetailsForm.value.totalSalary),
            month: parseInt(this.monthlySalaryDetailsForm.value.month),
            year: parseInt(this.monthlySalaryDetailsForm.value.year),
            basicSalary: parseFloat(this.monthlySalaryDetailsForm.value.basicSalary),
            HRA: parseFloat(this.monthlySalaryDetailsForm.value.HRA),
            professionalText: parseFloat(this.monthlySalaryDetailsForm.value.professionalText),
            transportAllowance: parseFloat(this.monthlySalaryDetailsForm.value.transportAllowance),
            PF: parseFloat(this.monthlySalaryDetailsForm.value.PF),
            PFEmployer: parseFloat(this.monthlySalaryDetailsForm.value.PFEmployer),
            miscellaneousAllowances: parseFloat(this.monthlySalaryDetailsForm.value.miscellaneousAllowances),
        }

        this.adminLayoutService.UpdateMonthlySalaryDetailsData(salaryDetailsObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {
                this.submittedMonthlySalaryDetailsData = false;
                this.defaultMonthlySalaryForm();
                this.IsEditMonthlySalaryDetails = false;
                this.getMonthlySalaryDetailsByEmployeeID();
                $("#add-monthly-salary-information-modal").modal("hide");
                this.commonService.notifier.notify('success', "Monthly Salary Details Updated Successfully.");

            }
        });
    }
    getMonthlySalaryDetailsById(id) {
        let SalaryDetailsObj = {
            _id: id
        }
        this.adminLayoutService.getMonthlySalaryDetailsById(SalaryDetailsObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {

                this.monthlySalaryDetailsForm.controls._id.setValue(Res.data._id);
                this.monthlySalaryDetailsForm.controls.month.setValue(parseInt(Res.data.month));
                this.monthlySalaryDetailsForm.controls.year.setValue(parseInt(Res.data.year));
                this.monthlySalaryDetailsForm.controls.basicSalary.setValue(Res.data.basicSalary);
                this.monthlySalaryDetailsForm.controls.totalSalary.setValue(Res.data.finalAmount);
                this.monthlySalaryDetailsForm.controls.HRA.setValue(Res.data.HRA);
                this.monthlySalaryDetailsForm.controls.professionalText.setValue(Res.data.professionalText);
                this.monthlySalaryDetailsForm.controls.transportAllowance.setValue(Res.data.transportAllowance);
                this.monthlySalaryDetailsForm.controls.PF.setValue(Res.data.PF);
                this.monthlySalaryDetailsForm.controls.PFEmployer.setValue(Res.data.PFEmployer);
                this.monthlySalaryDetailsForm.controls.miscellaneousAllowances.setValue(Res.data.miscellaneousAllowances);
                this.IsEditMonthlySalaryDetails = true;
                $("#add-monthly-salary-information-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
            }
        });
    }
    getMonthlySalaryDetailsByEmployeeID() {
        this.monthlySalaryDetailsList = [];
        let Obj = {
            employeeId: this.userId
        }

        this.adminLayoutService.getMonthlySalaryDetailsByEmployeeID(Obj).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.monthlySalaryDetailsList = Response.data;
            }
        });

    }
    downloadSalaryGenerationWorkReport(employeeId: any, month: number, year: number) {
        let downloadSalaryGenerationObj = {
            month: month,
            year: year,
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
    getMonthlySalaryDetailsTotalSalary() {

        let basicSalary = parseFloat(this.monthlySalaryDetailsForm.value.basicSalary)
        let HRA = parseFloat(this.monthlySalaryDetailsForm.value.HRA)
        let transportAllowance = parseFloat(this.monthlySalaryDetailsForm.value.transportAllowance)
        let miscellaneousAllowances = parseFloat(this.monthlySalaryDetailsForm.value.miscellaneousAllowances)
        let PF = parseFloat(this.monthlySalaryDetailsForm.value.PF)
        let PT = parseFloat(this.monthlySalaryDetailsForm.value.professionalText)


        let totalSalaryCalculation = ((basicSalary + HRA + transportAllowance + miscellaneousAllowances) - (PF + PT)).toFixed(2);

        this.monthlySalaryDetailsForm.controls.totalSalary.setValue(totalSalaryCalculation.toString());
    }



    //month wise leave api calling
    submittedMonthWiseLeaveData: boolean = false;
    IsEditMonthWiseLeave: boolean = false;
    monthWiseLeaveList: any[] = [];
    defaultMonthWiseLeaveForm() {
        this.monthWiseLeaveForm = this.fb.group({
            _id: [''],
            month: [null, [Validators.required]],
            year: [null, [Validators.required]],
            casualLeave: ['0'],
            sickLeave: ['0'],
            emergencyLeave: ['0'],
            lossOfPay: ['0'],
        })
    }
    addMonthWiseLeave() {
        this.defaultMonthWiseLeaveForm();
        this.submittedMonthWiseLeaveData = false;
        this.IsEditMonthWiseLeave = false;
        $("#add-month-wise-leave-modal").modal({ backdrop: 'static', keyboard: false, show: true });
    }
    cancelMonthWiseLeave() {
        this.defaultMonthWiseLeaveForm();
        this.submittedMonthWiseLeaveData = false;
        this.IsEditMonthWiseLeave = false;
        $("#add-month-wise-leave-modal").modal("hide");
    }
    saveMonthWiseLeave() {
        this.submittedMonthWiseLeaveData = true;
        if (this.monthWiseLeaveForm.invalid) {
            return;
        }

        let salaryDetailsObj = {
            employeeId: this.userId,
            month: this.monthWiseLeaveForm.value.month.toString(),
            year: this.monthWiseLeaveForm.value.year.toString(),
            casualLeave: this.monthWiseLeaveForm.value.casualLeave,
            sickLeave: this.monthWiseLeaveForm.value.sickLeave,
            emergencyLeave: this.monthWiseLeaveForm.value.emergencyLeave,
            lossOfPay: this.monthWiseLeaveForm.value.lossOfPay,
        }
        this.adminLayoutService.SaveMonthWiseLeaveData(salaryDetailsObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {
                this.submittedMonthWiseLeaveData = false;
                this.defaultMonthWiseLeaveForm();
                this.IsEditMonthWiseLeave = false;
                this.getMonthWiseLeaveByEmployeeID();
                $("#add-month-wise-leave-modal").modal("hide");
                this.commonService.notifier.notify('success', "Month Wise Leave Saved Successfully.");
            }
        });
    }
    updateMonthWiseLeave() {
        this.submittedMonthWiseLeaveData = true;
        if (this.monthWiseLeaveForm.invalid) {
            return;
        }

        let salaryDetailsObj = {
            employeeId: this.userId,
            _id: this.monthWiseLeaveForm.value._id,
            month: this.monthWiseLeaveForm.value.month.toString(),
            year: this.monthWiseLeaveForm.value.year.toString(),
            casualLeave: this.monthWiseLeaveForm.value.casualLeave,
            sickLeave: this.monthWiseLeaveForm.value.sickLeave,
            emergencyLeave: this.monthWiseLeaveForm.value.emergencyLeave,
            lossOfPay: this.monthWiseLeaveForm.value.lossOfPay,
        }

        this.adminLayoutService.UpdateMonthWiseLeaveData(salaryDetailsObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {
                this.submittedMonthWiseLeaveData = false;
                this.defaultMonthWiseLeaveForm();
                this.IsEditMonthWiseLeave = false;
                this.getMonthWiseLeaveByEmployeeID();
                $("#add-month-wise-leave-modal").modal("hide");
                this.commonService.notifier.notify('success', "Month Wise Leave Updated Successfully.");

            }
        });
    }
    getMonthWiseLeaveById(id) {
        let monthWiseLeaveObj = {
            _id: id
        }
        this.adminLayoutService.getMonthWiseLeaveById(monthWiseLeaveObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {

                this.monthWiseLeaveForm.controls._id.setValue(Res.data._id);
                this.monthWiseLeaveForm.controls.month.setValue(parseInt(Res.data.month));
                this.monthWiseLeaveForm.controls.year.setValue(parseInt(Res.data.year));
                this.monthWiseLeaveForm.controls.emergencyLeave.setValue(Res.data.emergencyLeave);
                this.monthWiseLeaveForm.controls.sickLeave.setValue(Res.data.sickLeave);
                this.monthWiseLeaveForm.controls.casualLeave.setValue(Res.data.casualLeave);
                this.monthWiseLeaveForm.controls.lossOfPay.setValue(Res.data.lossOfPay);

                this.IsEditMonthWiseLeave = true;
                $("#add-month-wise-leave-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
            }
        });
    }
    getMonthWiseLeaveByEmployeeID() {
        this.monthWiseLeaveList = [];
        let Obj = {
            employeeId: this.userId
        }

        this.adminLayoutService.getMonthWiseLeaveByEmployeeID(Obj).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                this.monthWiseLeaveList = Response.data;
            }
        });

    }


    // leave balance api calling
    submittedLeaveBalanceData: boolean = false;
    IsEditLeaveBalance: boolean = false;
    leaveBalanceList: any[] = [];
    leaveTypeList: any[] = [];
    defaultLeaveBalanceForm() {
        this.leaveBalanceForm = this.fb.group({
            _id: [''],
            year: [new Date().getFullYear(), [Validators.required]],
            leaveList: this.fb.array([]),
        })
    }
    createLeaveBalance(oItem?: object): FormGroup {
        return this.fb.group({
            leaveType: [(oItem['leaveType'] ? oItem['leaveType'] : '')],
            leaveCount: [(oItem['leaveCount'] ? oItem['leaveCount'] : '')],
            _id: [(oItem['_id'] ? oItem['_id'] : 0)],
            month: [(oItem['month'] ? oItem['month'] : 0)],
            year: [(oItem['year'] ? oItem['year'] : 0)],
        });
    }

    activeTab: number = 1;
    getLeaveTypeList() {
        let Obj = {
            employeeId: this.userId
        }
        this.adminLayoutService.getLeaveBalanceByEmployeeID(Obj).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                let leaveTypeListData = Response.data;
                const months = { "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6, "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12 };
                let casualArray = [];
                let sickArray = [];
                let emergencyArray = [];

                leaveTypeListData.forEach((x: any) => {
                    let Obj = {
                        _id: x._id,
                        month: x.monthName,
                        year: x.year,
                        leaveType: x.leaveType,
                        leaveCount: x.leaveCount.toString()
                    }

                    if (x.leaveType == 'Casual') {
                        casualArray.push(Obj);
                    }
                    else if (x.leaveType == 'Sick') {
                        sickArray.push(Obj);
                    }
                    else if (x.leaveType == 'Emergency') {
                        emergencyArray.push(Obj);
                    }
                    // this.leaveListForBalance.push(this.createLeaveBalance(Obj))
                })

                casualArray = casualArray.sort((a, b) => months[a.month] - months[b.month]);
                sickArray = sickArray.sort((a, b) => months[a.month] - months[b.month]);
                emergencyArray = emergencyArray.sort((a, b) => months[a.month] - months[b.month]);

                casualArray.filter((x: any) => {
                    this.leaveListForBalance.push(this.createLeaveBalance(x))
                })
                sickArray.filter((x: any) => {
                    this.leaveListForBalance.push(this.createLeaveBalance(x))
                })
                emergencyArray.filter((x: any) => {
                    this.leaveListForBalance.push(this.createLeaveBalance(x))
                })

            }
        })
    }
    addLeaveBalance() {
        this.defaultLeaveBalanceForm();
        this.submittedLeaveBalanceData = false;
        this.leaveListForBalance.clear();
        this.leaveListForBalance = this.leaveBalanceForm.get('leaveList') as FormArray;
        this.getLeaveTypeList()
        this.IsEditLeaveBalance = false;
        this.activeTab = 1;
        $("#add-leave-balance-modal").modal({ backdrop: 'static', keyboard: false, show: true });
    }
    cancelLeaveBalance() {
        this.defaultLeaveBalanceForm();
        this.submittedLeaveBalanceData = false;
        this.IsEditLeaveBalance = false;
        $("#add-leave-balance-modal").modal("hide");
    }
    updateLeaveBalance() {
        this.submittedLeaveBalanceData = true;
        if (this.leaveBalanceForm.invalid) {
            return;
        }

        let LeaveCountList = [];

        this.leaveBalanceForm.controls.leaveList.value.forEach((x: any) => {
            let leaveBalanceObj = {
                _id: x._id,
                leaveCount: parseFloat(x.leaveCount)
            }
            LeaveCountList.push(leaveBalanceObj);
        })

        console.log(LeaveCountList);


        let leaveCountArrayObj = {
            updateArray: LeaveCountList
        }

        this.adminLayoutService.UpdateLeaveBalanceData(leaveCountArrayObj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {
                this.submittedLeaveBalanceData = false;
                this.defaultLeaveBalanceForm();
                this.IsEditLeaveBalance = false;
                this.getLeaveBalanceByEmployeeID();
                $("#add-leave-balance-modal").modal("hide");
                this.commonService.notifier.notify('success', "Leave Balance Updated Successfully.");

            }
        });
    }
    getLeaveBalanceByEmployeeID() {
        this.leaveBalanceList = [];
        let Obj = {
            year: new Date().getFullYear(),
            employeeId: this.userId
        }

        this.adminLayoutService.getLeaveBalanceByEmployeeIDRemainingCount(Obj).subscribe((Response: any) => {
            if (Response.meta.code == 200) {
                let leaveBalanceLists = Response.data;

                let img: any;
                let Obj = null
                leaveBalanceLists.forEach((x: any) => {
                    if (x.leaveType == 'Emergency') {
                        img = '../../../../assets/img/emergencyLeave.png';
                        Obj = {
                            leaveType: x.leaveType,
                            remainLeave: x.leaveCountForThisMonth,
                            _id: x._id,
                            img: img,
                            order: 3
                        }
                    }
                    else if (x.leaveType == 'Sick') {
                        img = '../../../../assets/img/sickLeave.png'
                        Obj = {
                            leaveType: x.leaveType,
                            remainLeave: x.leaveCountForThisMonth,
                            _id: x._id,
                            img: img,
                            order: 2
                        }
                    }
                    else if (x.leaveType == 'Casual') {
                        img = '../../../../assets/img/casualLeave.png'
                        Obj = {
                            leaveType: x.leaveType,
                            remainLeave: x.leaveCountForThisMonth,
                            _id: x._id,
                            img: img,
                            order: 1
                        }
                    }


                    this.leaveBalanceList.push(Obj);
                })

                this.leaveBalanceList = this.leaveBalanceList.sort((a, b) => a.order - b.order)



                // leaveBalanceLists.filter((x: any) => {
                //     let img: any;
                //     let Obj = {}

                //     if (x.leaveType == 'Emergency') {
                //         img = '../../../../assets/img/emergencyLeave.png'
                //     }
                //     else if (x.leaveType == 'Sick') {
                //         img = '../../../../assets/img/sickLeave.png'
                //     }
                //     else if (x.leaveType == 'Casual') {
                //         img = '../../../../assets/img/casualLeave.png'
                //     }

                //     let obj = {
                //         leaveType: x.leaveType,
                //         remainLeave: x.remainLeave,
                //         totalAssignLeave: x.totalAssignLeave,
                //         totalUsedLeave: x.totalUsedLeave,
                //         img: img
                //     }

                //     this.leaveBalanceList.push(obj);
                // })
            }
        });

    }



    downloadEmployeeAppraisalLetter(id: any) {
        let downloadAppraisalLetter = {
            "employeeId": this.userId,
            "salaryId": id
        };


        this.adminLayoutService.downloadEmployeeAppraisalLetter(downloadAppraisalLetter).subscribe((Response: any) => {

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
                var extension = "appraisalLetter.pdf";
                downloadLink.download = Response.data.FullName + ' - ' + extension;
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
    downloadOfferLetter() {
        let downloadOfferLetter = {
            "employeeId": this.userId,
        };


        this.adminLayoutService.downloadOfferLetter(downloadOfferLetter).subscribe((Response: any) => {

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
                var extension = "Offer Letter.pdf";
                downloadLink.download = Response.data.FullName + ' - ' + extension;
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
    downloadEmployeeAppoinmentLetter() {
        let downloadEmployeeAppoinmentLetter = {
            "employeeId": this.userId,
        };


        this.adminLayoutService.downloadEmployeeAppoinmentLetter(downloadEmployeeAppoinmentLetter).subscribe((Response: any) => {

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
                var extension = "AppoinmentLetter.pdf";
                downloadLink.download = Response.data.FullName + ' - ' + extension;
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
    downloadTrainingExpLetter() {
        let downloadEmployeeAppoinmentLetter = {
            "employeeId": this.userId,
        };


        this.adminLayoutService.downloadEmployeeTrainingExpLetter(downloadEmployeeAppoinmentLetter).subscribe((Response: any) => {

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
                var extension = "AppoinmentLetter.pdf";
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

}

export class EmpBasicInfoListModel {
    _id: any;
    firstName: any;
    middleName: any;
    lastName: any;
    p_Mobile: any;
    gender: any;
    dob: any;
    permenentAddress: any;
    currentAddress: any;
    bloodGroup: any;
    linkedInId: any;
    p_Email: any;
    profile_image: any;
    signature: any;
}

export class EmployeeListModel {
    designationName: string;
    technologyName: string;
    roleName: string;
    empNumber: any;
    joiningDate: any;
    EmailID: any;
    SkypeID: any
}


