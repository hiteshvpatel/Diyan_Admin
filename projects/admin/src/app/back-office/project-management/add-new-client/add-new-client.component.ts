import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonService } from '../../../shared/common.service';
import { StorageService, StorageKey } from '../../../shared/storage.service';
// import { AdminLayoutService } from '../../../layouts/admin-layout/admin-layout.service';
import { ProjectManagementService } from '../project-management.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AssetsManagementService } from '../../assets-management/assets-management.service';
import { CountryStateCityService } from '../../../layouts/admin-layout/country-state-city.service';
import { CompanyManagementService } from '../../company-management/company-management.service';
import * as moment from 'moment';
declare const $: any;

@Component({
  selector: 'app-add-new-client',
  templateUrl: './add-new-client.component.html',
  styleUrls: ['./add-new-client.component.css']
})
export class AddNewClientComponent implements OnInit {
  profileDetails: boolean;
  clientId: string;
  ISeditClient = false;
  clientMasterForm: FormGroup;
  clientContactMasterForm: FormGroup;
  submittedClientData = false;
  submittedClientContactData = false;
  clientDetails: any;
  clientContactList: any[] = [];
  IsClientContact: boolean = false;
  l: number;
  p: number = 1;
  itemsPage: any;
  mySelect;
  companyActiveDataList: any[] = [];
  maxDate = new Date();

  countryList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];


  get fClientData(): { [key: string]: AbstractControl } {
    return this.clientMasterForm.controls;
  }
  get fClientContactData(): { [key: string]: AbstractControl } {
    return this.clientContactMasterForm.controls;
  }


  constructor(public companyManagementService: CompanyManagementService, private fb: FormBuilder, private service: CountryStateCityService, public assetsManagementService: AssetsManagementService, public storageService: StorageService, private route: ActivatedRoute, private router: Router, public commonService: CommonService, public projectManagementService: ProjectManagementService) {
    const currentUrl = this.router.url;
    this.countryList = this.service.getCountries();
    console.log(this.countryList);
    if (currentUrl.includes('add-new-client')) {
      this.clientId = "0";
      this.ISeditClient = false;
    } else {
      this.route.params.subscribe((params: Params) => {
        this.clientId = params.id;
      });
      this.ISeditClient = true;
      this.editClientDetails();
    }
  }

  defaultForm() {
    this.clientMasterForm = this.fb.group({
      _id: [''],
      clientName: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      country: [, [Validators.required]],
      state: [],
      city: [],
      address: [''],
      GSTIN: [''],
      pancard: ['']
    });
  }

  defaultContactForm() {
    this.clientContactMasterForm = this.fb.group({
      _id: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      birthDate: [''],
      email: ['', [Validators.required, Validators.pattern(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/)]],
      phone: ['', [Validators.required]],
      whatsUpNumber: ['', [Validators.required]],
      skypeId: [''],
      remark: [''],
    });
  }

  editClientDetails() {
    let clientID = { '_id': this.clientId }
    this.projectManagementService.getClientMasterId(clientID).subscribe((Response: any) => {
      if (Response.meta.code == 200) {

        this.clientDetails = Response.data;
        this.clientMasterForm.patchValue(Response.data);
        this.countryList.filter((x: any) => {
          if (Response.data.country === x.name) {
            this.clientMasterForm.controls.country.setValue(x.shortName);
          }
        })
        this.stateList = this.service.getStatesByCountry(this.clientMasterForm.controls.country.value);

        if (!!this.clientMasterForm.value.state) {
          this.clientMasterForm.controls.state.setValue(Response.data.state);
        }
        else {
          this.clientMasterForm.controls.state.setValue(null);
        }

        if (!!this.clientMasterForm.value.state) {
          this.cityList = this.service.getCitiesByState(this.clientMasterForm.controls.country.value, this.clientMasterForm.controls.state.value)

          if (!!this.clientMasterForm.value.city) {
            this.clientMasterForm.controls.city.setValue(Response.data.city)
          }
          else {
            this.clientMasterForm.controls.city.setValue(null)
          }
        }
        else {
          this.clientMasterForm.controls.city.setValue(null);
        }


        this.getClientContactList();
      }
    });
  }

  numberAndletterOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
      return false;
    }
    return true;
  }


  ngOnInit(): void {
    this.defaultForm();
    this.defaultContactForm();
    // this.getCompanyActiveList();
    this.mySelect = 5;
    this.l = 5;
  }

  onCountryChange() {

    if (this.clientMasterForm.controls.country.value === null) {
      this.stateList = [];
      this.cityList = [];
      this.clientMasterForm.controls.state.setValue(null);
      this.clientMasterForm.controls.city.setValue(null);
    }
    else {
      this.stateList = [];
      this.cityList = [];
      this.clientMasterForm.controls.state.setValue(null);
      this.clientMasterForm.controls.city.setValue(null);
      this.stateList = this.service.getStatesByCountry(this.clientMasterForm.controls.country.value);
      console.log(this.stateList, 'sdasdasdasdasdsa')
    }
  }

  onStateChange() {
    if (this.clientMasterForm.controls.state.value === null) {
      this.clientMasterForm.controls.city.setValue(null);
      this.cityList = [];
    }
    else {
      this.cityList = [];
      this.clientMasterForm.controls.city.setValue(null);
      this.cityList = this.service.getCitiesByState(this.clientMasterForm.controls.country.value, this.clientMasterForm.controls.state.value);;

    }
  }

  itemsPerPage(): void {
    this.l = this.mySelect;
    this.p = 1;
  }

  SaveClient(btnName) {
    if (this.clientMasterForm.invalid) {
      this.submittedClientData = true;
      return;
    }

    this.countryList.filter((x: any) => {
      if (x.shortName === this.clientMasterForm.value.country) {
        this.clientMasterForm.controls.country.setValue(x.name);
      }
    })


    let clientmasterModelObj: FormData = new FormData();
    clientmasterModelObj.append('clientName', this.clientMasterForm.value.clientName);
    clientmasterModelObj.append('companyName', this.clientMasterForm.value.companyName);
    clientmasterModelObj.append('country', this.clientMasterForm.value.country);
    clientmasterModelObj.append('state', this.clientMasterForm.value.state == null ? '' : this.clientMasterForm.value.state);
    clientmasterModelObj.append('city', this.clientMasterForm.value.city == null ? '' : this.clientMasterForm.value.city);
    clientmasterModelObj.append('address', this.clientMasterForm.value.address);
    clientmasterModelObj.append('GSTIN', this.clientMasterForm.value.GSTIN);
    clientmasterModelObj.append('pancard', this.clientMasterForm.value.pancard);
    this.projectManagementService.saveClientBasicInfoMaster(clientmasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedClientData = false;
        if (btnName === 'continue') {
          this.router.navigate(['/admin/project-management/edit-client/' + Response.data._id]);
          this.commonService.notifier.notify('success', "Client Created Successfully.");
        }
        else if (btnName === 'save') {
          this.defaultForm();
          this.router.navigate(['/admin/project-management/client-master']);
          this.commonService.notifier.notify('success', "Client Created Successfully.");
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

  UpdateClient() {
    if (this.clientMasterForm.invalid) {
      this.submittedClientData = true;
      return;
    }
    this.countryList.filter((x: any) => {
      if (x.shortName === this.clientMasterForm.value.country) {
        this.clientMasterForm.controls.country.setValue(x.name);
      }
    })
    let params = {
      _id: this.clientMasterForm.value._id,
      clientName: this.clientMasterForm.value.clientName,
      companyName: this.clientMasterForm.value.companyName,
      country: this.clientMasterForm.value.country,
      state: this.clientMasterForm.value.state == null ? '' : this.clientMasterForm.value.state,
      city: this.clientMasterForm.value.city == null ? '' : this.clientMasterForm.value.city,
      address: this.clientMasterForm.value.address,
      GSTIN: this.clientMasterForm.value.GSTIN,
      pancard: this.clientMasterForm.value.pancard,

    }

    this.projectManagementService.updateClientMasterId(params).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedClientData = false;
        this.editClientDetails();
        this.closeBasicInfoModel();
        this.commonService.notifier.notify('success', "User Basic Information Updated Successfully.");
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  getClientContactList() {
    let clientIdObj = {
      clientId: this.clientId
    }
    this.projectManagementService.getClientContaclList(clientIdObj).subscribe((Res: any) => {
      if (Res.meta.code == 200) {
        this.clientContactList = Res.data
      }
    })
  }

  saveClientContactDetails() {
    if (this.clientContactMasterForm.invalid) {
      this.submittedClientContactData = true;
      return;
    }

    let contactObj = {
      firstName: this.clientContactMasterForm.value.firstName,
      lastName: this.clientContactMasterForm.value.lastName,
      email: this.clientContactMasterForm.value.email,
      phone: this.clientContactMasterForm.value.phone,
      whatsUpNumber: this.clientContactMasterForm.value.whatsUpNumber,
      skypeId: this.clientContactMasterForm.value.skypeId,
      remark: this.clientContactMasterForm.value.remark,
      clientId: this.clientId,
      birthDate: this.clientContactMasterForm.value.birthDate ? moment(this.clientContactMasterForm.value.birthDate).format('DD/MM/yyyy') : ''
    }
    this.projectManagementService.saveClientContactInfoMaster(contactObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.editClientDetails();
        this.defaultContactForm();
        this.cancelClientContact()
        this.commonService.notifier.notify('success', 'Client contact detials save Successfully');

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

  letterOnly(event): Boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
      return false;
    }
    return true;
  }

  openBasicInfoModel() {
    this.editClientDetails();
    $("#add-client-basic-details-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
  }
  closeBasicInfoModel() {
    $("#add-client-basic-details-modal").modal("hide");
  }

  cancelClientContact() {

    $("#add-contact-details-modal").modal("hide");
    this.defaultContactForm();
  }

  addClientContact() {
    this.defaultContactForm();
    this.IsClientContact = false;
    this.submittedClientContactData = false;
    $("#add-contact-details-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
  }

  cancelClient() {
    this.defaultForm();
    this.ISeditClient = false;
    this.router.navigate(['/admin/project-management/client-master']);
  }

  editClientContact(id) {

    let clientParams = {
      _id: id
    }
    this.projectManagementService.getClientContactDetails(clientParams).subscribe((Res: any) => {

      if (Res.meta.code == 200) {

        this.clientContactMasterForm.controls._id.setValue(Res.data._id);
        this.clientContactMasterForm.controls.firstName.setValue(Res.data.firstName);
        this.clientContactMasterForm.controls.lastName.setValue(Res.data.lastName);
        this.clientContactMasterForm.controls.email.setValue(Res.data.email);
        this.clientContactMasterForm.controls.phone.setValue(Res.data.phone);
        this.clientContactMasterForm.controls.whatsUpNumber.setValue(Res.data.whatsUpNumber);
        this.clientContactMasterForm.controls.skypeId.setValue(Res.data.skypeId);
        this.clientContactMasterForm.controls.remark.setValue(Res.data.remark);
        if (this.clientContactMasterForm.controls.birthDate) {
          this.clientContactMasterForm.controls.birthDate.setValue(new Date(Res.data.birthDate.split('/')[2] + '-' + Res.data.birthDate.split('/')[1] + '-' + Res.data.birthDate.split('/')[0]));
        }
        else {
          this.clientContactMasterForm.controls.birthDate.setValue('')
        }
        this.IsClientContact = true;
        $("#add-contact-details-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
      }
    });
  }

  updateClientContactDetails() {

    if (this.clientContactMasterForm.invalid) {
      this.submittedClientContactData = true;
      return;
    }
    let updateContactObj = {
      _id: this.clientContactMasterForm.value._id,
      firstName: this.clientContactMasterForm.value.firstName,
      lastName: this.clientContactMasterForm.value.lastName,
      email: this.clientContactMasterForm.value.email,
      phone: this.clientContactMasterForm.value.phone,
      whatsUpNumber: this.clientContactMasterForm.value.whatsUpNumber,
      skypeId: this.clientContactMasterForm.value.skypeId,
      remark: this.clientContactMasterForm.value.remark,
      birthDate: this.clientContactMasterForm.value.birthDate ? moment(this.clientContactMasterForm.value.birthDate).format('DD/MM/yyyy') : ''
    }
    this.projectManagementService.updateClientContact(updateContactObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.editClientDetails();
        this.cancelClientContact()
        this.commonService.notifier.notify('success', 'Client Contact Details Updated Successfully');

      }
      else if (Response.meta.code == 1005) {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    })
  }

  statusClientContact(paramsObj) {
    let statusclientContactObj = {
      "_id": paramsObj.id,
      "status": paramsObj.status
    };
    this.projectManagementService.StatusclientContack(statusclientContactObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.getClientContactList();
        this.commonService.notifier.notify('success', Response.meta.message);
      }
      else {
        this.commonService.notifier.notify('success', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  updateClientIsDefault(id) {
    let Obj = {
      clientId: this.clientId,
      _id: id
    }
    this.projectManagementService.updateClientContactDefaultFlag(Obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.getClientContactList();
        this.commonService.notifier.notify('success', 'Update Default Client Details.');
      }
    })
  }

  // getCompanyActiveList() {
  //   this.companyActiveDataList = [];
  //   this.clientMasterForm.controls.companyId.setValue(null);

  //   this.companyManagementService.getCompanyActiveList().subscribe((Response: any) => {

  //     if (Response.meta.code == 200) {
  //       this.companyActiveDataList = Response.data;
  //     }
  //   }, (error) => {
  //     console.log(error.error.Message);
  //   });
  // }
}
