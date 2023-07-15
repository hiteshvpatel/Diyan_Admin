import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AdminLayoutService } from '../../../../layouts/admin-layout/admin-layout.service';
import { CommonService } from '../../../../shared/common.service';
import { environment } from '../../../../../environments/environment';
declare const $: any;

@Component({
  selector: 'app-interview-details',
  templateUrl: './interview-details.component.html',
  styleUrls: ['./interview-details.component.css']
})
export class InterviewDetailsComponent implements OnInit {

  interviewForm: FormGroup;
  interviewFormalRoundForm: FormGroup;
  hrFinalRoundForm: FormGroup;
  interviewId: any;
  isInterviewUpdate: boolean = false;
  get fInterviewData(): { [key: string]: AbstractControl } {
    return this.interviewForm.controls;
  }
  get fInterviewFormalRoundData(): { [key: string]: AbstractControl } {
    return this.interviewFormalRoundForm.controls;
  }
  get fHRFinalInterviewData(): { [key: string]: AbstractControl } {
    return this.hrFinalRoundForm.controls;
  }
  submittedInterviewData = false;
  submittedInterviewCompanyData = false;
  submittedFinalHRInterviewData = false;
  file: any;
  imgURL: any;
  public imagePath;
  message: string;
  resumeUploadFile: any;
  resumenFile: boolean = false
  userId;
  designationList: any[] = [];
  technologyList: any[] = [];
  userMasterList: any[] = [];
  interviewDetails: any;
  empBasicInfoList: any
  @ViewChild('file') myInputVariable: ElementRef;
  @ViewChild('file1') myInputVariableForSignatureImage: ElementRef;
  bloodGroupArray = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  todayDate = new Date();
  maxDate = this.todayDate;
  interviewDetailsPracticalDate: any


  constructor(public fb: FormBuilder, public adminLayoutService: AdminLayoutService, public route: ActivatedRoute, public router: Router, public commonService: CommonService,) {
  }

  ngOnInit(): void {
    this.defaultForm();
    this.defaultFormalRoundForm();
    this.defaultHRForm();
    this.getdesignationlist();
    this.getTechnologylist();

    const url = this.router.url;
    this.getEmployeeActiveList();
    if (url.includes('update-interview-details')) {
      this.isInterviewUpdate = true;
      this.route.params.subscribe((x: any) => {
        this.interviewId = x.id
      })
      this.getInterviewDetailsByID();
    }

  }

  defaultForm() {
    this.interviewForm = this.fb.group({
      _id: [''],
      firstName: ['', [Validators.required]],
      middleName: [''],
      lastName: [''],
      p_Mobile: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      dob: [''],
      p_Email: ['', [Validators.required, Validators.pattern(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/)]],
      gender: ['', [Validators.required]],
      permenentAddress: [''],
      currentAddress: [''],
    });
  }
  defaultFormalRoundForm() {
    this.interviewFormalRoundForm = this.fb.group({
      _id: [''],
      designationID: [null, [Validators.required]],
      technologyID: [null],
      expectedSalary: [''],
      totalExperience: [''],
      currentCompany: [''],
      currentSalary: [''],
      noticePeriod: [''],
      assigndId: [null],
      istelephonic: [false],
      interviewDate: ['', [Validators.required]],
    });
  }

  defaultHRForm() {
    this.hrFinalRoundForm = this.fb.group({
      joiningDate: ['', [Validators.required]],
      finalSalary: ['', [Validators.required]]
    })
  }

  openInterviewCompanyDetailsUpdate() {
    this.getInterviewDetailsByID();
    $("#update-company-modal").modal({ backdrop: 'static', keyboard: false, show: true });
  }
  cancelInterviewCompanyDetails() {
    this.defaultFormalRoundForm();
    this.submittedInterviewCompanyData = false;
    $("#update-company-modal").modal('hide');
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


  // interview Saved 
  SaveInterviewDetails() {
    if (this.interviewForm.invalid) {
      this.submittedInterviewData = true;
      return;
    }
    let interviewObj: FormData = new FormData();
    interviewObj.append('firstName', this.interviewForm.value.firstName);
    interviewObj.append('middleName', this.interviewForm.value.middleName);
    interviewObj.append('lastName', this.interviewForm.value.lastName);
    interviewObj.append('dob', this.interviewForm.value.dob ? moment(this.interviewForm.value.dob).format('DD/MM/yyyy') : '');
    interviewObj.append('p_Mobile', this.interviewForm.value.p_Mobile);
    interviewObj.append('p_Email', this.interviewForm.value.p_Email);
    interviewObj.append('gender', this.interviewForm.value.gender);
    interviewObj.append('permenentAddress', this.interviewForm.value.permenentAddress);
    interviewObj.append('currentAddress', this.interviewForm.value.currentAddress);
    interviewObj.append('photo', this.file ? this.file : '');
    interviewObj.append('resumeUpload', this.resumeUploadFile ? this.resumeUploadFile : '');

    this.adminLayoutService.SaveInterview(interviewObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedInterviewData = false;
        this.resumenFile = false;
        this.defaultForm();
        this.router.navigate(['/admin/update-interview-details/' + Response.data._id]);
        this.commonService.notifier.notify('success', "Interview Details Saved Successfully.");
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }
  // interview Updated
  UpdateInterviewDetails() {

    // if (this.interviewForm.invalid || !this.resumeUploadFile) {
    if (this.interviewForm.invalid) {
      this.submittedInterviewData = true;
      // this.resumenFile = true;
      return;
    }

    let interviewObj: FormData = new FormData();
    interviewObj.append('_id', this.interviewForm.value._id);
    interviewObj.append('firstName', this.interviewForm.value.firstName);
    interviewObj.append('middleName', this.interviewForm.value.middleName);
    interviewObj.append('lastName', this.interviewForm.value.lastName);
    interviewObj.append('dob', this.interviewForm.value.dob ? moment(this.interviewForm.value.dob).format('DD/MM/yyyy') : '');
    interviewObj.append('p_Mobile', this.interviewForm.value.p_Mobile);
    interviewObj.append('p_Email', this.interviewForm.value.p_Email);
    interviewObj.append('gender', this.interviewForm.value.gender);
    interviewObj.append('permenentAddress', this.interviewForm.value.permenentAddress);
    interviewObj.append('currentAddress', this.interviewForm.value.currentAddress);
    interviewObj.append('photo', this.file ? this.file : '');
    interviewObj.append('resumeUpload', this.resumeUploadFile ? this.resumeUploadFile : '');

    this.adminLayoutService.UpdateInterview(interviewObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedInterviewData = false;
        this.resumenFile = false;
        this.defaultForm();
        this.getInterviewDetailsByID();
        $("#update-interview-modal").modal('hide');
        // this.router.navigate(['/admin/interview-list']);
        this.commonService.notifier.notify('success', "Interview Details Updated Successfully.");
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  //get interview Details by Id 
  getInterviewDetailsByID() {
    let interviewObj = {
      _id: this.interviewId
    }
    this.adminLayoutService.getInterviewByID(interviewObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {

        this.interviewDetails = Response.data;
        this.interviewForm.patchValue(Response.data);
        this.interviewFormalRoundForm.patchValue(Response.data);
        this.hrFinalRoundForm.patchValue(Response.data);
        this.interviewForm.controls.gender.setValue(Response.data.gender.toString())

        if (Response.data.practicalDate) {
          let practicalDate = new Date(Response.data.practicalDate.split('/')[2] + '-' + Response.data.practicalDate.split('/')[1] + '-' + Response.data.practicalDate.split('/')[0]);
          // let todayDate = new Date()
          // if (practicalDate > todayDate) {
          this.interviewDetailsPracticalDate = new Date(practicalDate);
          // }
          // else {
          //   this.interviewDetailsPracticalDate = new Date(todayDate)
          // }
        }
        else {
          let interviewDate = new Date(Response.data.interviewDate.split('/')[2] + '-' + Response.data.interviewDate.split('/')[1] + '-' + Response.data.interviewDate.split('/')[0]);
          // let todayDate = new Date();
          // if (interviewDate > todayDate) {
          this.interviewDetailsPracticalDate = interviewDate
          // }
          // else {
          //   this.interviewDetailsPracticalDate = new Date()
          // }
        }

        if (Response.data.dob) {
          this.interviewForm.controls.dob.setValue(new Date(Response.data.dob.split('/')[2] + '-' + Response.data.dob.split('/')[1] + '-' + Response.data.dob.split('/')[0]));
        }
        else {
          this.interviewForm.controls.dob.setValue(null)
        }

        if (Response.data.interviewDate) {
          this.interviewFormalRoundForm.controls.interviewDate.setValue(new Date(Response.data.interviewDate.split('/')[2] + '-' + Response.data.interviewDate.split('/')[1] + '-' + Response.data.interviewDate.split('/')[0]));
        }
        else {
          this.interviewFormalRoundForm.controls.interviewDate.setValue(null)
        }

        if (Response.data.joiningDate) {
          this.hrFinalRoundForm.controls.joiningDate.setValue(new Date(Response.data.joiningDate.split('/')[2] + '-' + Response.data.joiningDate.split('/')[1] + '-' + Response.data.joiningDate.split('/')[0]));
        }
        else {
          this.hrFinalRoundForm.controls.joiningDate.setValue(null)
        }

        if (Response.data.photo) {
          this.imgURL = environment.uploadsUrl + Response.data.photo;
          this.file = Response.data.photo
        }

        if (Response.data.resumeUpload) {
          this.resumeUploadFile = Response.data.resumeUpload
        }

      }
    })
  }

  openInterviewDetailsUpdate() {
    this.getInterviewDetailsByID();
    $("#update-interview-modal").modal({ backdrop: 'static', keyboard: false, show: true });
  }
  cancelInterviewDetails() {
    this.defaultForm()
    this.submittedInterviewData = false;
    this.resumenFile = false;
    $("#update-interview-modal").modal('hide');
  }

  // preview Image 
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
  // remove Upload Image 
  removeuploadFile() {

    this.imgURL = "";
    this.file = "";
    this.myInputVariable.nativeElement.value = "";
  }

  // upload resume 
  previewResumeUpload(files) {
    this.resumeUploadFile = files[0];
    if (files.length === 0) {
      this.resumenFile = true
      return;
    }
    else {
      this.resumenFile = false;
    }
  }
  removeResumeFile() {
    this.resumeUploadFile = "";

    if (!this.resumeUploadFile) {
      this.resumenFile = true;
    }
    else {
      this.resumenFile = false;
    }

    this.myInputVariableForSignatureImage.nativeElement.value = "";
  }


  getEmployeeActiveList() {
    this.adminLayoutService.getuserMaster().subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.userMasterList = Response.data.filter((x: any) => {
          return x.empCompanyInfoData?.status === 1;
        });
      }
    })
  }

  SaveInterviewCompanyDetails() {
    if (this.interviewFormalRoundForm.invalid) {
      this.submittedInterviewCompanyData = true;
      return;
    }

    let companyObj = {
      _id: this.interviewId,
      isformal: true,
      stage: 1,
      nextstage: 2,
      stageStatus: 2,
      interviewDate: moment(this.interviewFormalRoundForm.value.interviewDate).format('DD/MM/yyyy'),
      istelephonic: this.interviewFormalRoundForm.value.istelephonic,
      technologyID: this.interviewFormalRoundForm.value.technologyID,
      designationID: this.interviewFormalRoundForm.value.designationID,
      currentSalary: this.interviewFormalRoundForm.value.currentSalary.toString(),
      expectedSalary: this.interviewFormalRoundForm.value.expectedSalary.toString(),
      totalExperience: this.interviewFormalRoundForm.value.totalExperience,
      noticePeriod: this.interviewFormalRoundForm.value.noticePeriod,
      assigndId: this.interviewFormalRoundForm.value.assigndId,
      currentCompany: this.interviewFormalRoundForm.value.currentCompany,
    }

    this.adminLayoutService.saveInterviewCompanyInfo(companyObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        $("#update-company-modal").modal('hide');
        this.commonService.notifier.notify('success', 'Company Details Saved Successfully.')
        this.getInterviewDetailsByID();
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message)
      }
    })

  }

  openInterviewFinalRoundUpdate() {
    this.getInterviewDetailsByID();
    $("#update-hr-final-modal").modal({ backdrop: 'static', keyboard: false, show: true });
  }
  cancelInterviewHRFinalRound() {
    this.defaultHRForm();
    this.submittedFinalHRInterviewData = false;
    $("#update-hr-final-modal").modal('hide');

  }

  SaveInterviewHRDetails() {
    if (this.hrFinalRoundForm.invalid) {
      this.submittedFinalHRInterviewData = true;
      return;
    }
    let Obj = {
      _id: this.interviewId,
      isHrfinal: true,
      stage: 4,
      stageStatus: 2,
      joiningDate: moment(this.hrFinalRoundForm.value.joiningDate).format('DD/MM/yyyy'),
      finalSalary: this.hrFinalRoundForm.value.finalSalary
    }
    this.adminLayoutService.saveInterviewCompanyInfo(Obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        $("#update-hr-final-modal").modal('hide');
        this.commonService.notifier.notify('success', 'HR Round Details Saved Successfully.')
        this.getInterviewDetailsByID();
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message)
      }
    })
  }


  hrFinalRemark = '';
  hrFinalRemarkCheck: boolean = false;

  openHrFinalRejectModal() {
    this.hrFinalRemark = '';
    this.hrFinalRemarkCheck = false;
    $("#update-hr-final-reject-modal").modal({ backdrop: 'static', keyboard: false, show: true });
  }
  cancleHrFinalRejectModal() {
    this.hrFinalRemark = '';
    this.hrFinalRemarkCheck = false;
    $("#update-hr-final-reject-modal").modal('hide');
  }

  hrFinalRoundReject() {
    if (!this.hrFinalRemark) {
      this.hrFinalRemarkCheck = true;
      return;
    }

    let Obj = {
      _id: this.interviewId,
      stage: 4,
      stageStatus: 3,
      isRejected: true,
      isHrfinal: false,
      hrFinalRemark: this.hrFinalRemark
    }
    this.adminLayoutService.saveInterviewCompanyInfo(Obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.getInterviewDetailsByID();
        this.hrFinalRemark = '';
        this.hrFinalRemarkCheck = false;
        $("#update-hr-final-reject-modal").modal('hide');
      }
    })
  }

}
