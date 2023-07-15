import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonService } from '../../../shared/common.service';
import { StorageService, StorageKey } from '../../../shared/storage.service';
import { AdminLayoutService } from '../../../layouts/admin-layout/admin-layout.service';
import { ProjectManagementService } from '../project-management.service';
import { CompanyManagementService } from '../../company-management/company-management.service';

import { CurrencyLists } from '../currency';
import { debug } from 'console';

declare const $: any;

@Component({
  selector: 'app-add-new-project',
  templateUrl: './add-new-project.component.html',
  styleUrls: ['./add-new-project.component.css']
})
export class AddNewProjectComponent implements OnInit {
  AllCurrencyLists = CurrencyLists;
  CurrencyName = Object.keys(CurrencyLists);
  projectId: string;
  ISeditProject: boolean = false;
  submittedProjectData: boolean = false;
  ProjectmasterForm: FormGroup;
  projectTypes: any
  clientMasterList: any;
  projectDetail: any;
  technologyMasterList: any;
  uplodedPrivateDocumentList: any = [];
  uplodedGeneralDocumentList: any = [];

  get fProjectmasterForm(): { [key: string]: AbstractControl } {
    return this.ProjectmasterForm.controls;
  }
  constructor(private fb: FormBuilder, public companyManagementService: CompanyManagementService, public storageService: StorageService, private route: ActivatedRoute, private router: Router, public commonService: CommonService, public projectManagementService: ProjectManagementService, public adminLayoutService: AdminLayoutService) {
    const currentUrl = this.router.url;
    if (currentUrl.includes('add-new-project')) {
      this.projectId = "0";
      this.ISeditProject = false;
    } else {
      this.route.params.subscribe((params: Params) => {
        this.projectId = params.id;
      });
      this.ISeditProject = true;
      this.editProjectMaster();
    }
  }

  ngOnInit(): void {
    this.getTechnologymasterList();
    this.mySelect = 5;
    this.l = 4;
    this.projectTypes = [{ id: 1, value: 'Fixed' }, { id: 2, value: 'T&M' }, { id: 3, value: 'Dedicateded' }];
    this.defaultForm();
    this.getClientList();
    this.getDocumentListUpload();
    this.getTeamLists();
    this.getdesignationlist()
    this.defaultAssignTeamForm();
  }

  itemsPerPage(): void {
    this.l = this.mySelect;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  defaultForm() {
    this.ProjectmasterForm = this.fb.group({
      _id: [''],
      projectName: ['', [Validators.required]],
      technology: ['', [Validators.required]],
      clientId: ['', [Validators.required]],
      description: [''],
      remark: [''],
      projectHour: [''],
      hourCost: ['', [Validators.required]],
      projectCost: [''],
      projectType: ['1', [Validators.required]],
      currency: [, [Validators.required]],
    });
  }

  saveProjectmaster(btnName) {
    if (this.ProjectmasterForm.invalid) {
      this.submittedProjectData = true;
      return;
    }
    let projectmasterModelObj = {
      "projectName": this.ProjectmasterForm.controls.projectName.value,
      "technology": this.ProjectmasterForm.controls.technology.value,
      "clientId": this.ProjectmasterForm.controls.clientId.value,
      "description": this.ProjectmasterForm.controls.description.value,
      "remark": this.ProjectmasterForm.controls.remark.value,
      "projectType": parseInt(this.ProjectmasterForm.controls.projectType.value),
      "projectHour": this.ProjectmasterForm.controls.projectHour.value,
      "hourCost": this.ProjectmasterForm.controls.hourCost.value,
      "projectCost": this.ProjectmasterForm.controls.projectCost.value,
      "currency": this.ProjectmasterForm.controls.currency.value,
    };

    this.projectManagementService.SaveProjectMaster(projectmasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedProjectData = false;
        if (btnName === 'continue') {
          this.router.navigate(['/admin/project-management/edit-project/' + Response.data._id]);
          this.commonService.notifier.notify('success', "Project Created Successfully.");
        }
        else if (btnName === 'save') {
          this.defaultForm();
          this.router.navigate(['/admin/project-management/project-master']);
          this.commonService.notifier.notify('success', "Project Created Successfully.");
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

  editProjectMaster() {
    this.ISeditProject = true;
    let Id: any = { '_id': this.projectId }
    this.projectManagementService.getProjectId(Id).subscribe((Response: any) => {
      let technology = Response.data.technologyData.map(a => a._id);
      this.projectDetail = Response.data;
      this.ProjectmasterForm.controls._id.setValue(Response.data._id);
      this.ProjectmasterForm.controls.projectName.setValue(Response.data.projectName);
      this.ProjectmasterForm.controls.technology.setValue(technology);
      this.ProjectmasterForm.controls.clientId.setValue(Response.data.clientId);
      this.ProjectmasterForm.controls.description.setValue(Response.data.description);
      this.ProjectmasterForm.controls.remark.setValue(Response.data.remark);
      this.ProjectmasterForm.controls.projectType.setValue(Response.data.projectType?.toString());
      this.ProjectmasterForm.controls.projectHour.setValue(Response.data.projectHour);
      this.ProjectmasterForm.controls.hourCost.setValue(Response.data.hourCost);
      this.ProjectmasterForm.controls.projectCost.setValue(Response.data.projectCost);
      this.ProjectmasterForm.controls.currency.setValue(Response.data.currency);
      this.onProjectTypeChange(Response.data.projectType)
      this.getInvoiceList(Response.data.clientId);

    }, (error) => {
      ////console.log(error);
      //this.commonService.notifier.notify('error', error.error.Message);
    });
  }

  getClientList() {
    this.clientMasterList = [];
    this.ProjectmasterForm.controls.clientId.setValue(null);
    this.projectManagementService.getClientMaster().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.clientMasterList = Response.data;
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }

  cancelProject() {
    this.defaultForm();
    this.ISeditProject = false;
    this.router.navigate(['/admin/project-management/project-master']);
  }

  onProjectTypeChange(projectType) {
    if (projectType == 1) {
      this.ProjectmasterForm.get('projectCost').clearValidators();
      this.ProjectmasterForm.get('projectHour').clearValidators();
      this.ProjectmasterForm.get('hourCost').setValidators([Validators.required]);
    }
    else if (projectType == 2) {
      this.ProjectmasterForm.get('projectCost').setErrors(null);
      this.ProjectmasterForm.get('projectHour').setValidators([Validators.required]);
      this.ProjectmasterForm.get('hourCost').setValidators([Validators.required]);
    } else if (projectType == 3) {
      this.ProjectmasterForm.get('projectCost').setValidators([Validators.required]);
      this.ProjectmasterForm.get('projectHour').setErrors(null);;
      this.ProjectmasterForm.get('hourCost').setErrors(null);;
    }
  }

  UpdateProject() {

    if (this.ProjectmasterForm.invalid) {
      this.submittedProjectData = true;
      return;
    }
    let projectmasterModelObj = {
      "_id": this.ProjectmasterForm.controls._id.value,
      "projectName": this.ProjectmasterForm.controls.projectName.value,
      "technology": this.ProjectmasterForm.controls.technology.value,
      "clientId": this.ProjectmasterForm.controls.clientId.value,
      "description": this.ProjectmasterForm.controls.description.value,
      "remark": this.ProjectmasterForm.controls.remark.value,
      "projectType": parseInt(this.ProjectmasterForm.controls.projectType.value),
      "projectHour": this.ProjectmasterForm.controls.projectHour.value,
      "hourCost": this.ProjectmasterForm.controls.hourCost.value,
      "projectCost": this.ProjectmasterForm.controls.projectCost.value,
      "currency": this.ProjectmasterForm.controls.currency.value,
    };

    this.projectManagementService.UpdateProjectMaster(projectmasterModelObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.submittedProjectData = false;
        this.editProjectMaster();
        this.closeProjectEdit();
        this.commonService.notifier.notify('success', "Project Basic Information Updated Successfully.");
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  getTechnologymasterList() {
    this.adminLayoutService.getTechnologyMaster().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.technologyMasterList = Response.data;
      }
    }, (error) => {
      console.log(error.error.Message);
    });
  }

  openBasicInfoModel() {
    this.editProjectMaster();
    $("#add-project-basic-details-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
  }

  closeProjectEdit() {
    this.defaultForm();
    $("#add-project-basic-details-modal").modal("hide");
  }

  // for private document
  @ViewChild('fileDoc') myInputVariableDoc: ElementRef;

  documentUploadForm: FormGroup;
  IsDocumentUpload = false;
  documentType;
  resultofShowDocument;
  resultofDocument;
  documentUploadId;
  docError;
  submittedDocumentUploadInfoData;
  l: number;
  p: number = 1;
  g: number = 1;
  itemsPage: any;
  mySelect;

  defaultDocumentUploadForm() {
    this.documentUploadForm = this.fb.group({
      projectDocument: [null]
    })
  }

  getDocumentListUpload() {
    this.uplodedPrivateDocumentList = [];
    this.uplodedGeneralDocumentList = [];
    let projectIdObj = {
      projectId: this.projectId
    }
    this.projectManagementService.getProjectDocumentUploadList(projectIdObj).subscribe((Res: any) => {
      if (Res.meta.code == 200) {
        Res.data.forEach((x: any) => {
          if (x.documentType == 1) {
            this.uplodedPrivateDocumentList.push(x);
          } else if (x.documentType == 2) {
            this.uplodedGeneralDocumentList.push(x);
          }
        })
      }
    })
  }

  addDocument(docType) {
    this.documentType = docType
    this.defaultDocumentUploadForm();
    this.IsDocumentUpload = false;
    $("#add-document-upload-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
  }
  onDocumentChange(event: any) {
    this.resultofDocument = event.target.files[0];
    this.resultofShowDocument = event.target.files[0];
    if (this.resultofShowDocument.name) {
      this.docError = false;
    }
    this.myInputVariableDoc.nativeElement.value = "";
  }

  removeDocument() {
    this.resultofShowDocument = "";
    this.resultofDocument = "";
    this.docError = true;
    this.myInputVariableDoc.nativeElement.value = "";
  }
  cancelDocument() {
    this.defaultDocumentUploadForm();
    this.resultofShowDocument = "";
    this.submittedDocumentUploadInfoData = false;
    this.docError = false;
    this.myInputVariableDoc.nativeElement.value = "";
    $("#add-document-upload-modal").modal("hide");
  }

  saveDocumentUpload() {
    if (!this.resultofShowDocument || this.resultofShowDocument == '') {
      this.submittedDocumentUploadInfoData = true;
      this.docError = true;
      return;
    }
    let documentUploadModelObj: FormData = new FormData();
    documentUploadModelObj.append('projectId', this.projectId);
    documentUploadModelObj.append('documentType', this.documentType);
    documentUploadModelObj.append('projectDocument', this.resultofDocument);

    this.projectManagementService.saveProjectDocumentUploadData(documentUploadModelObj).subscribe((Res: any) => {
      if (Res.meta.code == 200) {
        this.IsDocumentUpload = false;
        this.defaultDocumentUploadForm();
        this.submittedDocumentUploadInfoData = false;
        this.resultofShowDocument = "";
        this.docError = false;
        $("#add-document-upload-modal").modal("hide");
        this.getDocumentListUpload();
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
    this.projectManagementService.getProjectDocumentUploadById(documentUploadObj).subscribe((Res: any) => {
      if (Res.meta.code == 200) {
        this.documentType = Res.data[0].documentType;
        this.documentUploadId = Res.data[0]._id;
        this.resultofShowDocument = {
          name: Res.data[0].projectDocument
        };
        this.resultofDocument = Res.data[0].projectDocument;
        // this.keepOriginal = Boolean(JSON.parse(Res.data.keepOriginal));
        this.IsDocumentUpload = true;
        $("#add-document-upload-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
      }
    });
  }

  updateDocumentUpload() {
    this.submittedDocumentUploadInfoData = true;
    if (!this.resultofShowDocument || this.resultofShowDocument == '') {
      this.docError = true;
      return;
    }

    let documentUploadModelObj: FormData = new FormData();
    documentUploadModelObj.append('_id', this.documentUploadId);
    // documentUploadModelObj.append('projectId', this.projectId);
    documentUploadModelObj.append('documentType', this.documentType);
    documentUploadModelObj.append('projectDocument', this.resultofDocument);
    this.projectManagementService.UpdateProjectDocumentUploadData(documentUploadModelObj).subscribe((Res: any) => {
      if (Res.meta.code == 200) {
        this.IsDocumentUpload = false;
        this.defaultDocumentUploadForm();
        this.submittedDocumentUploadInfoData = false;
        this.resultofShowDocument = "";
        this.docError = false;
        $("#add-document-upload-modal").modal("hide");
        this.getDocumentListUpload();
        this.commonService.notifier.notify('success', "Document Updated Successfully.");
      }
      else {
        this.commonService.notifier.notify('error', Res.meta.message);
      }
    })
  }

  deleteDocumentDetailsById(id) {
    let Obj = {
      _id: id
    }
    this.projectManagementService.deleteProjectDocumentDetailsById(Obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.getDocumentListUpload();
        this.commonService.notifier.notify('success', "Document Deleted Successfully.");
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    });
  }

  // for team assign
  teamAssignList: any = [];
  employeeList: any = [];
  designationList: any[] = [];
  teamAssignForm: FormGroup;
  submitAssign;
  submitAssignAll: boolean = false;
  ISeditTeam = false;
  team: number = 1;

  defaultAssignTeamForm() {
    this.teamAssignForm = this.fb.group({
      _id: [],
      technologyId: [null, [Validators.required]],
      employeeId: [null, [Validators.required]],
      projectId: [null],
      isPoc: [false],
      remark: [null],
    })
  }
  getdesignationlist() {

    this.adminLayoutService.getDesignationList().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.designationList = Response.data;
      }
    });
  }

  closeAllAssignEdit() {
    $("#assign-all-team-modal").modal("hide");
  }

  getTeamLists() {
    let projectIdObj = {
      projectId: this.projectId
    }
    this.projectManagementService.getTeamAssignList(projectIdObj).subscribe((Res: any) => {
      if (Res.meta.code == 200) {
        this.teamAssignList = Res.data;
      } else {
        this.teamAssignList = [];
      }
    })
  }

  addTeam() {
    this.employeeList = [];
    this.teamAssignForm.get('technologyId').enable();
    this.teamAssignForm.get('employeeId').enable();
    this.defaultAssignTeamForm();
    this.ISeditTeam = false
    this.submitAssign = false;
    $("#assign-team-modal").modal({ backdrop: 'static', keyboard: false, show: true });
  }

  closeAssignEdit() {
    this.defaultAssignTeamForm();
    $("#assign-team-modal").modal("hide");
  }

  ChangeDepartment(technologyId) {
    this.employeeList = [];
    this.teamAssignForm.controls.employeeId.setValue('');
    if (technologyId) {
      let params = {
        projectId: this.projectId,
        technologyId: technologyId
      }
      this.projectManagementService.getEmployeeByDepartment(params).subscribe((Res: any) => {
        if (Res.meta.code == 200) {
          this.employeeList = Res.data;
        }
      })
    }
  }

  saveTeamAssign() {
    if (this.teamAssignForm.invalid) {
      this.submitAssign = true;
      return;
    }
    let params = {
      'technologyId': this.teamAssignForm.controls.technologyId.value,
      'employeeId': this.teamAssignForm.controls.employeeId.value,
      'projectId': this.projectId,
      'isPoc': this.teamAssignForm.controls.isPoc.value,
      'remark': this.teamAssignForm.controls.remark.value,
    }

    this.projectManagementService.saveTeamAssignData(params).subscribe((Res: any) => {
      if (Res.meta.code == 200) {
        this.submitAssign = false;
        this.defaultAssignTeamForm();
        $("#assign-team-modal").modal("hide");
        this.getTeamLists();
        this.commonService.notifier.notify('success', "Assign Team Member Successfully.");
      }
      else {
        this.commonService.notifier.notify('error', Res.meta.message);
      }
    })
  }

  editTeamById(teamID) {
    this.ISeditTeam = true;
    let Id: any = { '_id': teamID }
    this.projectManagementService.getTeamById(Id).subscribe((Response: any) => {
      this.teamAssignForm.patchValue(Response.data);
      // this.ChangeDepartment(Response.data.technologyId);
      this.employeeList = [{ employeeId: Response.data.employeeId, employeeName: Response.data.firstName + ' ' + Response.data.lastName }];
      this.teamAssignForm.controls.technologyId.setValue(Response.data.technologyId);
      this.teamAssignForm.controls.employeeId.setValue(Response.data.employeeId);
      this.teamAssignForm.get('technologyId').disable();
      this.teamAssignForm.get('employeeId').disable();

      $("#assign-team-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
    }, (error) => {
      ////console.log(error);
      //this.commonService.notifier.notify('error', error.error.Message);
    });
  }

  updateTeamAssign() {
    if (this.teamAssignForm.invalid) {
      this.submitAssign = true;
      return;
    }
    let params = {
      '_id': this.teamAssignForm.controls._id.value,
      'technologyId': this.teamAssignForm.controls.technologyId.value,
      'employeeId': this.teamAssignForm.controls.employeeId.value,
      'projectId': this.projectId,
      'isPoc': this.teamAssignForm.controls.isPoc.value,
      'remark': this.teamAssignForm.controls.remark.value,
    }

    this.projectManagementService.updateTeamAssignData(params).subscribe((Res: any) => {
      if (Res.meta.code == 200) {
        this.submitAssign = false;
        this.defaultAssignTeamForm();
        $("#assign-team-modal").modal("hide");
        this.getTeamLists();
        this.commonService.notifier.notify('success', "Assign Team Member Updated Successfully.");
      }
      else {
        this.commonService.notifier.notify('error', Res.meta.message);
      }
    })
  }

  removeTeamAssignForm = this.fb.group({
    remark: ['', [Validators.required]]
  });

  employeeId;
  teamId;
  submitRemove = false;

  removeTeamMemberPopup(teamId, employeeId) {
    this.teamId = teamId;
    this.employeeId = employeeId
    $("#removeTeamAssign").modal({ backdrop: 'static', keyboard: false, show: true });;
  }

  closeRemoveTeamPopup() {
    $("#removeTeamAssign").modal("hide");
    this.removeTeamAssignForm.reset();
  }

  removeTeamMember() {
    if (this.removeTeamAssignForm.invalid) {
      this.submitRemove = true;
      return;
    }

    let params = {
      "_id": this.teamId,
      "assignProjectId": this.projectId,
      "employeeId": this.employeeId,
      "remark": this.removeTeamAssignForm.controls.remark.value
    }

    this.projectManagementService.removeTeamAssign(params).subscribe((Res: any) => {
      if (Res.meta.code == 200) {
        this.submitRemove = false;
        this.removeTeamAssignForm.reset();
        $("#removeTeamAssign").modal("hide");
        this.getTeamLists();
        this.commonService.notifier.notify('success', "Remove Team Member Successfully.");
      }
      else {
        this.commonService.notifier.notify('error', Res.meta.message);
      }
    })
  }

  //bill
  invoiceList: any = [];
  bill: number = 1;

  getInvoiceList(clientId) {
    let params = {
      clientId: clientId
    }
    this.projectManagementService.getInvoiceMasterListByClientId(params).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.invoiceList = Response.data;
      }
      else {
        this.invoiceList = [];
      }
    });
  }

  addAllTeamAssign() {
    $("#assign-all-team-modal").modal({ backdrop: 'static', keyboard: false, show: true });
  }
  designationId = []
  allTeamAssignData() {
    if (this.designationId.length == 0) {
      this.submitAssignAll = true;
      return
    }
    let Obj = {
      designationId: this.designationId,
      projectId: this.projectId
    }
    this.projectManagementService.allTeamAssignData(Obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        $("#assign-all-team-modal").modal("hide");
        this.getTeamLists();
        this.commonService.notifier.notify('success', "Assign All Designation Team Member Successfully.");
      }
      else {
        this.invoiceList = [];
      }
    })
  }

  screenshotTab: number = 2;
  screenShotsDocuments: any[] = []
  resultOfScreenshotDocuments: any = {};
  @ViewChild('screeshotDoc') myScreenshotVariable: ElementRef;
  screenshotsError: boolean = false;
  screenshotList: any[] = [];

  openScreenshotModal() {
    this.tabClick(2)
    $("#screenshot-modal").modal({ backdrop: 'static', keyboard: false, show: true });
  }
  closeScreenshotModal() {
    $("#screenshot-modal").modal("hide");
  }

  onScreenshotDocumentChange(event: any) {

    var selectedFiles = event.target.files;
    let screenShotModalObj: FormData = new FormData();
    screenShotModalObj.append('projectId', this.projectId);
    for (var i = 0; i < selectedFiles.length; i++) {
      let file = selectedFiles[i];
      this.screenShotsDocuments.push(file);
      screenShotModalObj.append('projectScreenShot', file);
    }

    this.projectManagementService.uploadScreenshots(screenShotModalObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.tabClick(2);
        this.commonService.notifier.notify('success', 'Screenshots uploaded successfully.')
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    })

    event.target.value = '';
    this.myScreenshotVariable.nativeElement.value = "";

  }


  tabClick(type) {
    this.screenshotTab = type;
    this.getScreenshotList();
  }

  getScreenshotList() {
    this.screenshotList = []
    let obj = {
      projectId: this.projectId
    }
    this.projectManagementService.screenshotListData(obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.screenshotList = Response.data;
      }
    })
  }
  removeScreenshots(id: any) {
    let obj = {
      projectScreenShot: id
    }
    this.projectManagementService.deleteScreenShotData(obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.getScreenshotList();
        this.commonService.notifier.notify('success', 'Screenshots deleted successfully.')
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    })
  }



}