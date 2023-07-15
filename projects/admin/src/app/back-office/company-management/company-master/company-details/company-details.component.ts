import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AdminLayoutService } from '../../../../layouts/admin-layout/admin-layout.service';
import { CommonService } from '../../../../shared/common.service';
import { environment } from '../../../../../environments/environment';
import { StorageService, StorageKey } from '../../../../shared/storage.service';
import { CoreHelperService } from '../../../../Providers/core-helper/core-helper.service';
declare const $: any;
import * as moment from 'moment';
import { NgSelectConfig } from '@ng-select/ng-select';
import { parse } from 'path';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CompanyManagementService } from '../../company-management.service';
import { CountryStateCityService } from '../../../../layouts/admin-layout/country-state-city.service';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent implements OnInit {

  companyDetailsForm: FormGroup;
  documentMasterForm: FormGroup;
  bankDetailsForm: FormGroup;

  submittedCompanyInfoData = false;
  submittedDocumentMasterData = false;
  submittedBankDetailsData = false;
  userId: any;
  employeeCompanyList: any;

  countryList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  noData;
  sameAsAbove: boolean = false;
  documentMasterActiveList: any[] = [];
  resultofDocument: any;
  resultofShowDocument: any;
  docError: boolean = false;
  companyId: string | Blob;
  documentMasterList: any[] = [];
  bankDetails: any;
  IsEditBankDetails: boolean = false;
  hideDocBankDetails: boolean;

  get fCompanyDetailsData(): { [key: string]: AbstractControl } {
    return this.companyDetailsForm.controls;
  }
  get fDocumentMasterData(): { [key: string]: AbstractControl } {
    return this.documentMasterForm.controls;
  }
  get fBankData(): { [key: string]: AbstractControl } {
    return this.bankDetailsForm.controls;
  }



  constructor(private http: HttpClient, private service: CountryStateCityService, private fb: FormBuilder, public companyManagementService: CompanyManagementService, public storageService: StorageService, private coreHelper: CoreHelperService, private route: ActivatedRoute, private router: Router, public commonService: CommonService, public adminLayoutService: AdminLayoutService) {
    const currentUrl = this.router.url
    if (currentUrl.includes('add-company-details')) {
      this.hideDocBankDetails = true;
      // this.companyId = '0';
      this.employeeCompanyList = '';
    }
    else if (currentUrl.includes('edit-company-details')) {
      this.route.params.subscribe((params: Params) => {
        this.companyId = params.id;
        this.hideDocBankDetails = false;
        this.getCompanyInformationDetailsList();
      });
    }
  }

  ngOnInit() {
    this.defualtcompanyDetailsForm();
    this.defualtDocumentMasterForm();
    this.defualtBankDetailsForm();
    this.countryList = this.service.getCountries();

    // this.getCountryList();
    this.getDocumentMasterList();


  }

  letterSpaceOnly(event): Boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122) && (charCode != 32)) {
      return false;
    }
    return true;
  }

  // START (COMPLETE)
  // Company Information Form
  //logo
  logoFile: any;
  logoURL: any;
  public logoPath;
  logoMsg;
  IsLogo: boolean = false;
  @ViewChild('logo') myInputVariableLogo: ElementRef;
  previewLogoImage(files) {
    this.logoFile = files[0];
    var mimeType = files[0].type;
    if (mimeType == "image/jpeg" || mimeType == "image/png") {
      var reader = new FileReader();
      this.logoPath = files;
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        this.logoURL = reader.result;
      }
      this.logoMsg = "";
    } else {
      this.logoMsg = "Only JPEG and PNG image is supported.";
      this.logoURL = "";
      this.logoFile = "";
      this.myInputVariableLogo.nativeElement.value = "";
      return;
    }
  }
  removeLogoImageFile() {

    this.logoURL = "";
    this.logoFile = "";
    this.myInputVariableLogo.nativeElement.value = "";
    if (!!this.logoFile) {
      this.IsLogo = true;
    }
  }

  // watermark logo
  watermarkLogoFile: any;
  watermarkLogoURL: any;
  public watermarkLogoPath;
  watermarkLogoMsg;
  IsWatermarkLogo: boolean = false;
  @ViewChild('watermarkLogo') myInputVariableWatermarkLogo: ElementRef;
  previewWatermarkLogoImage(files) {
    this.watermarkLogoFile = files[0];
    var mimeType = files[0].type;
    if (mimeType == "image/jpeg" || mimeType == "image/png") {
      var reader = new FileReader();
      this.watermarkLogoPath = files;
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        this.watermarkLogoURL = reader.result;
      }
      this.watermarkLogoMsg = "";
    } else {
      this.watermarkLogoMsg = "Only JPEG and PNG image is supported.";
      this.watermarkLogoURL = "";
      this.watermarkLogoFile = "";
      this.myInputVariableWatermarkLogo.nativeElement.value = "";
      return;
    }
  }
  removeWatermarkLogoImageFile() {

    this.watermarkLogoURL = "";
    this.watermarkLogoFile = "";
    this.myInputVariableWatermarkLogo.nativeElement.value = "";
    if (!!this.watermarkLogoFile) {
      this.IsWatermarkLogo = true;
    }
  }

  // Round Seal
  roundSealFile: any;
  roundSealURL: any;
  public roundSealPath;
  roundSealMsg;
  IsRoundSeal: boolean = false;
  @ViewChild('roundSeal') myInputVariableroundSeal: ElementRef;
  previewroundSealImage(files) {
    this.roundSealFile = files[0];
    var mimeType = files[0].type;
    if (mimeType == "image/jpeg" || mimeType == "image/png") {
      var reader = new FileReader();
      this.roundSealPath = files;
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        this.roundSealURL = reader.result;
      }
      this.roundSealMsg = "";
    } else {
      this.roundSealMsg = "Only JPEG and PNG image is supported.";
      this.roundSealURL = "";
      this.roundSealFile = "";
      this.myInputVariableroundSeal.nativeElement.value = "";
      return;
    }
  }
  removeroundSealImageFile() {

    this.roundSealURL = "";
    this.roundSealFile = "";
    this.myInputVariableroundSeal.nativeElement.value = "";
    if (!!this.roundSealFile) {
      this.IsRoundSeal = true;
    }
  }

  // director seal
  // Round Seal
  directorSealFile: any;
  directorSealURL: any;
  public directorSealPath;
  directorSealMsg;
  IsDirectorSeal: boolean = false;
  @ViewChild('directorSeal') myInputVariabledirectorSeal: ElementRef;
  previewdirectorSealImage(files) {
    this.directorSealFile = files[0];

    var mimeType = files[0].type;
    if (mimeType == "image/jpeg" || mimeType == "image/png") {
      var reader = new FileReader();
      this.directorSealPath = files;
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        this.directorSealURL = reader.result;
      }
      this.directorSealMsg = "";
    } else {
      this.directorSealMsg = "Only JPEG and PNG image is supported.";
      this.directorSealURL = "";
      this.directorSealFile = "";
      this.myInputVariabledirectorSeal.nativeElement.value = "";
      return;
    }
  }
  removedirectorSealImageFile() {

    this.directorSealURL = "";
    this.directorSealFile = "";
    this.myInputVariabledirectorSeal.nativeElement.value = "";
    if (!!this.directorSealFile) {
      this.IsDirectorSeal = true;
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
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
  onCountryChange(btnName) {

    if (btnName === 'OAddress') {
      if (this.companyDetailsForm.controls.oCountry.value === null) {
        this.stateList = [];
        this.cityList = [];
        this.companyDetailsForm.controls.oState.setValue(null);
        this.companyDetailsForm.controls.oCity.setValue(null);
      }
      else {
        this.stateList = [];
        this.cityList = [];

        this.stateList = this.service.getStatesByCountry(this.companyDetailsForm.controls.oCountry.value);
      }
    }
    else if (btnName === 'RAddress') {

      if (this.companyDetailsForm.controls.rCountry.value === null) {
        this.stateList = [];
        this.cityList = [];
        this.companyDetailsForm.controls.rState.setValue(null);
        this.companyDetailsForm.controls.rCity.setValue(null);
      }
      else {
        this.stateList = [];
        this.cityList = [];

        this.stateList = this.service.getStatesByCountry(this.companyDetailsForm.controls.rCountry.value);
      }
    }
  }
  onStateChange(btnName) {

    if (btnName === 'OAddress') {
      if (this.companyDetailsForm.controls.oState.value === null) {
        this.companyDetailsForm.controls.oCity.setValue(null);
        this.cityList = [];
      }
      else {
        this.cityList = [];

        this.cityList = this.service.getCitiesByState(this.companyDetailsForm.controls.oCountry.value, this.companyDetailsForm.controls.oState.value);
      }
    }
    else if (btnName === 'RAddress') {
      if (this.companyDetailsForm.controls.rState.value === null) {
        this.companyDetailsForm.controls.rCity.setValue(null);
        this.cityList = [];
      }
      else {
        this.cityList = [];

        this.cityList = this.service.getCitiesByState(this.companyDetailsForm.controls.rCountry.value, this.companyDetailsForm.controls.rState.value);
      }
    }



  }
  setIsSameAsAbove(event: any) {
    if (event.target.checked === true) {
      this.companyDetailsForm.controls.rAddress.setValue(this.companyDetailsForm.value.oAddress);
      this.companyDetailsForm.controls.rCountry.setValue(this.companyDetailsForm.value.oCountry);
      this.companyDetailsForm.controls.rState.setValue(this.companyDetailsForm.value.oState);
      this.companyDetailsForm.controls.rCity.setValue(this.companyDetailsForm.value.oCity);
      this.companyDetailsForm.controls.rPincode.setValue(this.companyDetailsForm.value.oPincode);
    }
    else {
      this.companyDetailsForm.controls.rAddress.setValue('');
      this.companyDetailsForm.controls.rCountry.setValue(null);
      this.companyDetailsForm.controls.rState.setValue(null);
      this.companyDetailsForm.controls.rCity.setValue(null);
      this.companyDetailsForm.controls.rPincode.setValue('');
    }
  }

  openCompanyInfoModel() {
    this.defualtcompanyDetailsForm();
    this.submittedCompanyInfoData = false;
    this.logoFile = "";
    this.watermarkLogoFile = "";
    this.roundSealFile = "";
    this.directorSealFile = "";
    // this.getCompanyInformationById();
    $("#add-company-details-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
  }
  closeCompanyInfoModel() {
    this.defualtcompanyDetailsForm();
    this.submittedCompanyInfoData = false;
    this.logoFile = "";
    this.watermarkLogoFile = "";
    this.roundSealFile = "";
    this.directorSealFile = "";
    $("#add-company-details-modal").modal("hide");
  }
  defualtcompanyDetailsForm() {
    this.companyDetailsForm = this.fb.group({
      companyName: ['', [Validators.required]],
      companyEmail: ['', [Validators.required, Validators.pattern(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/)]],
      companyMobile: [''],
      companyTelephone: [''],
      companyWebsite: [''],
      oAddress: ['', [Validators.required]],
      oCountry: [, [Validators.required]],
      oState: [, [Validators.required]],
      oCity: [, [Validators.required]],
      oPincode: ['', [Validators.required]],
      rAddress: ['', [Validators.required]],
      rCountry: [, [Validators.required]],
      rState: [, [Validators.required]],
      rCity: [, [Validators.required]],
      rPincode: ['', [Validators.required]],
      _id: [''],
    })
  }
  saveCompanyDetailsData() {
    this.submittedCompanyInfoData = true;
    if (this.companyDetailsForm.invalid) {
      return;
    }

    this.countryList.filter((x: any) => {
      if (x.shortName === this.companyDetailsForm.value.oCountry) {
        this.companyDetailsForm.controls.oCountry.setValue(x.name);
      }
    });

    this.countryList.filter((x: any) => {
      if (x.shortName === this.companyDetailsForm.value.rCountry) {
        this.companyDetailsForm.controls.rCountry.setValue(x.name);
      }
    })

    let companyInformationDetailsObj: FormData = new FormData();
    companyInformationDetailsObj.append('companyName', this.companyDetailsForm.value.companyName);
    companyInformationDetailsObj.append('companyEmail', this.companyDetailsForm.value.companyEmail);
    companyInformationDetailsObj.append('companyMobile', this.companyDetailsForm.value.companyMobile);
    companyInformationDetailsObj.append('companyTelephone', this.companyDetailsForm.value.companyTelephone);
    companyInformationDetailsObj.append('companyWebsite', this.companyDetailsForm.value.companyWebsite);
    companyInformationDetailsObj.append('oAddress', this.companyDetailsForm.value.oAddress);
    companyInformationDetailsObj.append('oCountry', this.companyDetailsForm.value.oCountry);
    companyInformationDetailsObj.append('oState', this.companyDetailsForm.value.oState);
    companyInformationDetailsObj.append('oCity', this.companyDetailsForm.value.oCity);
    companyInformationDetailsObj.append('oPincode', this.companyDetailsForm.value.oPincode);
    companyInformationDetailsObj.append('rAddress', this.companyDetailsForm.value.rAddress);
    companyInformationDetailsObj.append('rCountry', this.companyDetailsForm.value.rCountry);
    companyInformationDetailsObj.append('rState', this.companyDetailsForm.value.rState);
    companyInformationDetailsObj.append('rCity', this.companyDetailsForm.value.rCity);
    companyInformationDetailsObj.append('rPincode', this.companyDetailsForm.value.rPincode);
    companyInformationDetailsObj.append('companyLogo', this.logoFile);
    companyInformationDetailsObj.append('companyWatermarkLogo', this.watermarkLogoFile);
    companyInformationDetailsObj.append('companyRoundSeal', this.roundSealFile);
    companyInformationDetailsObj.append('companyDirectorSeal', this.directorSealFile);


    this.companyManagementService.SaveCompanyInformationData(companyInformationDetailsObj).subscribe((Res: any) => {
      if (Res.meta.code == 200) {
        this.submittedCompanyInfoData = false;
        this.defualtcompanyDetailsForm();
        this.logoFile = "";
        this.watermarkLogoFile = "";
        this.roundSealFile = "";
        this.directorSealFile = "";
        $("#add-company-details-modal").modal("hide");
        this.companyId = Res.data._id;
        // this.getCompanyInformationDetailsList();
        this.router.navigate(['admin/company-management/edit-company-details/' + this.companyId])
        this.commonService.notifier.notify('success', "Company Details Uploaded Successfully.");
      }
      else {
        this.commonService.notifier.notify('error', Res.meta.message);
      }
    });
  }
  updateCompanyDetailsData() {
    this.submittedCompanyInfoData = true;
    if (this.companyDetailsForm.invalid) {
      return;
    }

    this.countryList.filter((x: any) => {
      if (x.shortName === this.companyDetailsForm.value.oCountry) {
        this.companyDetailsForm.controls.oCountry.setValue(x.name);
      }
    });

    this.countryList.filter((x: any) => {
      if (x.shortName === this.companyDetailsForm.value.rCountry) {
        this.companyDetailsForm.controls.rCountry.setValue(x.name);
      }
    })

    let companyInformationDetailsObj: FormData = new FormData();
    companyInformationDetailsObj.append('_id', this.companyDetailsForm.value._id);
    companyInformationDetailsObj.append('companyName', this.companyDetailsForm.value.companyName);
    companyInformationDetailsObj.append('companyEmail', this.companyDetailsForm.value.companyEmail);
    companyInformationDetailsObj.append('companyMobile', this.companyDetailsForm.value.companyMobile);
    companyInformationDetailsObj.append('companyTelephone', this.companyDetailsForm.value.companyTelephone);
    companyInformationDetailsObj.append('companyWebsite', this.companyDetailsForm.value.companyWebsite);
    companyInformationDetailsObj.append('oAddress', this.companyDetailsForm.value.oAddress);
    companyInformationDetailsObj.append('oCountry', this.companyDetailsForm.value.oCountry);
    companyInformationDetailsObj.append('oState', this.companyDetailsForm.value.oState);
    companyInformationDetailsObj.append('oCity', this.companyDetailsForm.value.oCity);
    companyInformationDetailsObj.append('oPincode', this.companyDetailsForm.value.oPincode);
    companyInformationDetailsObj.append('rAddress', this.companyDetailsForm.value.rAddress);
    companyInformationDetailsObj.append('rCountry', this.companyDetailsForm.value.rCountry);
    companyInformationDetailsObj.append('rState', this.companyDetailsForm.value.rState);
    companyInformationDetailsObj.append('rCity', this.companyDetailsForm.value.rCity);
    companyInformationDetailsObj.append('rPincode', this.companyDetailsForm.value.rPincode);
    companyInformationDetailsObj.append('companyLogo', this.logoFile);
    companyInformationDetailsObj.append('companyWatermarkLogo', this.watermarkLogoFile);
    companyInformationDetailsObj.append('companyRoundSeal', this.roundSealFile);
    companyInformationDetailsObj.append('companyDirectorSeal', this.directorSealFile);

    this.companyManagementService.UpdateCompanyInformationData(companyInformationDetailsObj).subscribe((Res: any) => {
      if (Res.meta.code == 200) {
        this.submittedCompanyInfoData = false;
        this.defualtcompanyDetailsForm();
        this.logoFile = "";
        this.watermarkLogoFile = "";
        this.roundSealFile = "";
        this.directorSealFile = "";
        $("#add-company-details-modal").modal("hide");
        this.getCompanyInformationDetailsList();
        this.commonService.notifier.notify('success', "Company Details Updated Successfully.");
      }
      else {
        this.commonService.notifier.notify('error', Res.meta.message);
      }
    });
  }
  getCompanyInformationById(id) {
    let companyObj = {
      _id: id
    }
    this.companyManagementService.getCompanyDetailsByID(companyObj).subscribe((Res: any) => {
      if (Res.meta.code == 200) {

        this.companyDetailsForm.controls._id.setValue(Res.data._id);
        this.companyDetailsForm.controls.companyName.setValue(Res.data.companyName);
        this.companyDetailsForm.controls.companyEmail.setValue(Res.data.companyEmail);
        this.companyDetailsForm.controls.companyMobile.setValue(Res.data.companyMobile);
        this.companyDetailsForm.controls.companyTelephone.setValue(Res.data.companyTelephone);
        this.companyDetailsForm.controls.companyWebsite.setValue(Res.data.companyWebsite);
        this.companyDetailsForm.controls.oAddress.setValue(Res.data.oAddress);
        if (Res.data.oCountry) {
          this.countryList.filter((x: any) => {
            if (Res.data.oCountry == x.name) {
              this.companyDetailsForm.controls.oCountry.setValue(x.shortName);
            }
          })
          // this.companyDetailsForm.controls.oCountry.setValue(Res.data.oCountry);
          this.onCountryChange('OAddress');
          this.companyDetailsForm.controls.oState.setValue(Res.data.oState);
          this.onStateChange('OAddress');
          this.companyDetailsForm.controls.oCity.setValue(Res.data.oCity);
        }

        this.companyDetailsForm.controls.rAddress.setValue(Res.data.rAddress);

        if (Res.data.rCountry) {
          this.countryList.filter((x: any) => {
            if (Res.data.rCountry == x.name) {
              this.companyDetailsForm.controls.rCountry.setValue(x.shortName);
            }
          })
          // this.companyDetailsForm.controls.rCountry.setValue(Res.data.rCountry);
          this.onCountryChange('RAddress');
          this.companyDetailsForm.controls.rState.setValue(Res.data.rState);
          this.onStateChange('RAddress');
          this.companyDetailsForm.controls.rCity.setValue(Res.data.rCity);
        }



        this.companyDetailsForm.controls.oPincode.setValue(Res.data.oPincode);

        this.companyDetailsForm.controls.rPincode.setValue(Res.data.rPincode);
        this.logoURL = environment.uploadedUrl + Res.data.companyLogo;
        this.logoFile = Res.data.companyLogo;
        this.watermarkLogoURL = environment.uploadedUrl + Res.data.companyWatermarkLogo;
        this.watermarkLogoFile = Res.data.companyWatermarkLogo;
        this.roundSealURL = environment.uploadedUrl + Res.data.companyRoundSeal;
        this.roundSealFile = Res.data.companyRoundSeal;
        this.directorSealURL = environment.uploadedUrl + Res.data.companyDirectorSeal;
        this.directorSealFile = Res.data.companyDirectorSeal;

        $("#add-company-details-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
      }
      else if (Res.meta.code === 1010) {
        this.defualtcompanyDetailsForm();
        $("#add-company-details-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
      }
    });
  }
  getCompanyInformationDetailsList() {
    let companyObj = {
      _id: this.companyId
    }
    this.companyManagementService.getCompanyDetailsByID(companyObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.employeeCompanyList = Response.data;

        // this.companyId = Response.data._id;
        this.getDocumentMasterListByCompanyId();
        this.getBankDetailsList();
      }
      else {
        this.employeeCompanyList = '';
      }
    });
  }
  //END



  // document master 
  @ViewChild('fileDoc') myInputVariableDoc: ElementRef;
  IsEditCompanyDocument: boolean = false;

  getDocumentMasterList() {
    this.documentMasterActiveList = [];

    this.companyManagementService.getDocumentMasterActiveList().subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.documentMasterActiveList = Response.data;
        this.noData = false;
      } else {
        this.noData = true;
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }
  openDocumentMasterModal() {
    this.defualtDocumentMasterForm();
    this.submittedDocumentMasterData = false;
    this.IsEditCompanyDocument = false;
    this.docError = false;
    this.resultofDocument = "";
    this.resultofShowDocument = "";
    $("#add-document-master-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
  }
  closeDocumentMasterModal() {
    this.defualtDocumentMasterForm();
    this.submittedDocumentMasterData = false;
    this.IsEditCompanyDocument = false;
    this.docError = false;
    this.resultofDocument = "";
    this.resultofShowDocument = "";
    $("#add-document-master-modal").modal("hide");
  }
  defualtDocumentMasterForm() {
    this.documentMasterForm = this.fb.group({
      documentMasterId: [, [Validators.required]],
      documentNo: [''],
      _id: [''],
    })
  }
  onDocumentChange(event: any) {

    this.resultofDocument = event.target.files[0];
    this.resultofShowDocument = event.target.files[0];
    if (this.resultofDocument.name) {
      this.docError = false;
    }
    this.myInputVariableDoc.nativeElement.value = "";
  }
  removeDocument() {
    this.resultofDocument = "";
    this.resultofShowDocument = "";
    this.docError = true;
    this.myInputVariableDoc.nativeElement.value = "";
  }
  saveDocumentMasterData() {
    this.submittedDocumentMasterData = true;
    if (this.documentMasterForm.invalid) {
      return;
    }

    let documentMasterDataObj: FormData = new FormData();
    documentMasterDataObj.append('documentMasterId', this.documentMasterForm.value.documentMasterId);
    documentMasterDataObj.append('documentNo', this.documentMasterForm.value.documentNo);
    documentMasterDataObj.append('documents', this.resultofDocument);
    documentMasterDataObj.append('companyId', this.companyId);


    this.companyManagementService.SavedocumentMasterDetails(documentMasterDataObj).subscribe((Res: any) => {
      if (Res.meta.code == 200) {
        this.submittedDocumentMasterData = false;
        this.defualtDocumentMasterForm();
        this.docError = false;
        this.resultofDocument = "";
        this.resultofShowDocument = "";
        $("#add-document-master-modal").modal("hide");
        this.getCompanyInformationDetailsList();
        this.commonService.notifier.notify('success', "Document Saved Successfully.");
      }
      else {
        this.commonService.notifier.notify('error', Res.meta.message);
      }
    });
  }
  updateDocumentMasterData() {
    this.submittedDocumentMasterData = true;
    if (this.documentMasterForm.invalid) {
      return;
    }

    let documentMasterDataObj: FormData = new FormData();
    documentMasterDataObj.append('_id', this.documentMasterForm.value._id);
    documentMasterDataObj.append('documentMasterId', this.documentMasterForm.value.documentMasterId);
    documentMasterDataObj.append('documentNo', this.documentMasterForm.value.documentNo);
    documentMasterDataObj.append('documents', this.resultofDocument);
    documentMasterDataObj.append('companyId', this.companyId);


    this.companyManagementService.updateDocumentMasterDetails(documentMasterDataObj).subscribe((Res: any) => {
      if (Res.meta.code == 200) {
        this.submittedDocumentMasterData = false;
        this.defualtDocumentMasterForm();
        this.docError = false;
        this.resultofDocument = "";
        this.resultofShowDocument = "";
        $("#add-document-master-modal").modal("hide");
        this.getCompanyInformationDetailsList();
        this.commonService.notifier.notify('success', "Document Updated Successfully.");
      }
      else {
        this.commonService.notifier.notify('error', Res.meta.message);
      }
    });
  }
  getDocumentMasterById(id) {
    let companyObj = {
      _id: id
    }
    this.companyManagementService.getDocumentMasterByID(companyObj).subscribe((Res: any) => {
      if (Res.meta.code == 200) {

        this.documentMasterForm.controls._id.setValue(Res.data._id);
        this.documentMasterForm.controls.documentMasterId.setValue(Res.data.documentMasterId);
        this.documentMasterForm.controls.documentNo.setValue(Res.data.documentNo);

        if (Res.data.documents) {
          this.resultofDocument = Res.data.documents;
          this.resultofShowDocument = {
            name: Res.data.documents
          };
        }

        this.companyId = Res.data.companyId;

        this.IsEditCompanyDocument = true;
        $("#add-document-master-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
      }
    });
  }
  getDocumentMasterListByCompanyId() {
    let companyDocumentMasterObj = {
      companyId: this.companyId
    }
    this.companyManagementService.getDocumentMasterList(companyDocumentMasterObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.documentMasterList = Response.data;
      }
    });
  }

  // Bank Details 
  defualtBankDetailsForm() {
    this.bankDetailsForm = this.fb.group({
      cBankName: [, [Validators.required]],
      cAccountNo: ['', [Validators.required]],
      cIfscCode: ['', [Validators.required]],
      cBranchName: ['', [Validators.required]],
      cCompanyName: ['', [Validators.required]],
      cBankBranchAddress: [''],

      eAccountNo: [''],
      eShiftCode: [''],
      eMicrCode: [''],
      eBankName: [''],
      eBranchName: [''],
      _id: [''],
    })
  }
  openBankDetails() {
    this.defualtBankDetailsForm();
    this.submittedBankDetailsData = false;
    this.IsEditBankDetails = false;
    $("#add-bank-details-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
  }
  cancelBankDetails() {
    this.defualtDocumentMasterForm();
    this.submittedDocumentMasterData = false;
    this.IsEditBankDetails = false;
    $("#add-bank-details-modal").modal("hide");
  }
  saveBankDetails() {
    if (this.bankDetailsForm.invalid) {
      this.submittedBankDetailsData = true;
      return
    }

    let bankDetailsObj = {
      companyId: this.companyId,
      cBankName: this.bankDetailsForm.value.cBankName,
      cAccountNo: this.bankDetailsForm.value.cAccountNo,
      cIfscCode: this.bankDetailsForm.value.cIfscCode,
      cBranchName: this.bankDetailsForm.value.cBranchName,
      cCompanyName: this.bankDetailsForm.value.cCompanyName,
      cBankBranchAddress: this.bankDetailsForm.value.cBankBranchAddress,
      eAccountNo: this.bankDetailsForm.value.eAccountNo,
      eShiftCode: this.bankDetailsForm.value.eShiftCode,
      eMicrCode: this.bankDetailsForm.value.eMicrCode,
      eBankName: this.bankDetailsForm.value.eBankName,
      eBranchName: this.bankDetailsForm.value.eBranchName,
    }

    this.companyManagementService.SaveBankDetails(bankDetailsObj).subscribe((Res: any) => {
      if (Res.meta.code == 200) {
        this.defualtBankDetailsForm();
        this.submittedBankDetailsData = false;
        this.IsEditBankDetails = false;
        $("#add-bank-details-modal").modal("hide");
        this.commonService.notifier.notify('success', "Bank Details Uploaded Successfully.");
        this.getBankDetailsList();
      }
    })

  }
  updateBankDetails() {

    if (this.bankDetailsForm.invalid) {
      this.submittedBankDetailsData = true;
      return
    }

    let bankDetailsObj = {
      _id: this.bankDetailsForm.value._id,
      companyId: this.companyId,
      cBankName: this.bankDetailsForm.value.cBankName,
      cAccountNo: this.bankDetailsForm.value.cAccountNo,
      cIfscCode: this.bankDetailsForm.value.cIfscCode,
      cBranchName: this.bankDetailsForm.value.cBranchName,
      cCompanyName: this.bankDetailsForm.value.cCompanyName,
      cBankBranchAddress: this.bankDetailsForm.value.cBankBranchAddress,
      eAccountNo: this.bankDetailsForm.value.eAccountNo,
      eShiftCode: this.bankDetailsForm.value.eShiftCode,
      eMicrCode: this.bankDetailsForm.value.eMicrCode,
      eBankName: this.bankDetailsForm.value.eBankName,
      eBranchName: this.bankDetailsForm.value.eBranchName,
    }

    this.companyManagementService.updateBankDetails(bankDetailsObj).subscribe((Res: any) => {
      if (Res.meta.code == 200) {
        this.defualtBankDetailsForm();
        this.submittedBankDetailsData = false;
        this.IsEditBankDetails = false;
        $("#add-bank-details-modal").modal("hide");
        this.commonService.notifier.notify('success', "Bank Details Updated Successfully.");
        this.getBankDetailsList();
      }
    })

  }
  getBankDetailsByID(id) {
    let Obj = {
      _id: id
    }
    this.companyManagementService.getBankDetailsByID(Obj).subscribe((Res: any) => {
      if (Res.meta.code == 200) {
        this.bankDetailsForm.patchValue(Res.data);
        this.IsEditBankDetails = true;
        $("#add-bank-details-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
      }
    })
  }
  deleteBankDetailsById(id) {
    let Obj = {
      bankDetailsId: id
    }
    this.companyManagementService.getBankDeleteDetailsByID(Obj).subscribe((Res: any) => {
      if (Res.meta.code == 200) {
        this.getBankDetailsList();
      }
    })
  }
  getBankDetailsList() {
    let Obj = {
      companyId: this.companyId
    }
    this.companyManagementService.getBankDetailsList(Obj).subscribe((Res: any) => {
      if (Res.meta.code == 200) {
        this.bankDetails = Res.data;
      }
    })
  }

  generateLedger() {
    this.adminLayoutService.generateCompanyBankLedger().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.commonService.notifier.notify('success', 'Ledger Created Successfully.')
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message)
      }
    })
  }


}
