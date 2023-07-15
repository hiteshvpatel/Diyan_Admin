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
import { AssetsManagementService } from '../assets-management.service';
import { CountryStateCityService } from '../../../layouts/admin-layout/country-state-city.service';

declare const $: any;

interface supplierMasterData {
  companyName: string;
  contactPersonName: string;
  phone: string;
  email: string;
  address: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  gstno: string;
  panNo: string;
}

@Component({
  selector: 'app-supplier-master',
  templateUrl: './supplier-master.component.html',
  styleUrls: ['./supplier-master.component.scss']
})
export class SupplierMasterComponent implements OnInit {

  IsEditSupplierMaster = false;
  suppliermasterList: supplierMasterData[];
  allsuppliermaster: supplierMasterData[];
  supplierMasterList: supplierMasterData[];
  l: number;
  p: number = 1;
  itemsPage: any;
  mySelect;
  supplierMasterForm: FormGroup;
  x: number;
  t: number;
  listindex: number;
  suppliermasterListlength: any;
  allimageList: any;
  countryList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];

  get fSupplierData() { return this.supplierMasterForm.controls; }
  submittedSupplierMasterData = false;
  public imagePath;
  imgURL: any;
  message: string;
  noData: boolean = false;
  noimageData;

  activeTab: number;
  imageList: any;
  //image: any;
  file: any;
  Image: any;
  isView: boolean;
  isCreated: boolean;
  isUpdated: boolean;
  isDeleted: boolean;
  searchTerm: string;

  constructor(public commonService: CommonService, private service: CountryStateCityService, public assetsManagementService: AssetsManagementService, public storageService: StorageService, public adminLayoutService: AdminLayoutService, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private spinner: NgxSpinnerService) {
    let pagePermission = { module: "suppliermaster" }
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
    this.IsEditSupplierMaster = false;
    this.getSupplierMasterList();
    this.defaultForm();
    // this.getCountryList();
    this.countryList = this.service.getCountries();
  }
  defaultForm() {
    this.supplierMasterForm = this.fb.group({
      _id: [''],
      companyName: ['', [Validators.required]],
      contactPersonName: [''],
      phone: [''],
      email: [''],
      address: [''],
      country: [],
      state: [],
      city: [],
      pincode: [''],
      gstno: [''],
      panNo: [''],
    });
  }

  itemsPerPage(): void {
    this.l = this.mySelect;
  }

  numberAndletterOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
      return false;
    }
    return true;
  }

  getCountryList() {
    this.countryList = [];

    this.assetsManagementService.getCountryMasterList().subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.countryList = Response.data;
        this.noData = false;
      } else {
        this.noData = true;
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }

  // onCountryChange() {

  //   if (this.supplierMasterForm.controls.countryId.value === null) {
  //     this.stateList = [];
  //     this.cityList = [];
  //     this.supplierMasterForm.controls.stateId.setValue(null);
  //     this.supplierMasterForm.controls.cityId.setValue(null);
  //   }
  //   else {
  //     this.stateList = [];
  //     this.cityList = [];
  //     let stateObj = {
  //       countryId: this.supplierMasterForm.controls.countryId.value
  //     }
  //     this.assetsManagementService.getStateMasterListByCountryID(stateObj).subscribe((Response: any) => {

  //       if (Response.meta.code == 200) {
  //         this.stateList = Response.data;
  //         this.noData = false;
  //       } else {
  //         this.noData = true;
  //       }
  //     }, (error) => {
  //       console.log(error.error.Message);
  //     });
  //   }
  // }
  onCountryChange() {

    if (this.supplierMasterForm.controls.country.value === null) {
      this.stateList = [];
      this.cityList = [];
      this.supplierMasterForm.controls.state.setValue(null);
      this.supplierMasterForm.controls.city.setValue(null);
    }
    else {
      this.stateList = [];
      this.cityList = [];

      this.stateList = this.service.getStatesByCountry(this.supplierMasterForm.controls.country.value);
      console.log(this.stateList, 'sdasdasdasdasdsa')
    }
  }
  onStateChange() {
    if (this.supplierMasterForm.controls.state.value === null) {
      this.supplierMasterForm.controls.city.setValue(null);
      this.cityList = [];
    }
    else {
      this.cityList = [];

      this.cityList = this.service.getCitiesByState(this.supplierMasterForm.controls.country.value, this.supplierMasterForm.controls.state.value);;

    }
  }

  generateLedger() {
    this.adminLayoutService.generateSupplierLedger().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.commonService.notifier.notify('success', 'Ledger Created Successfully.')
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message)
      }
    })
  }

  // onStateChange() {
  //   if (this.supplierMasterForm.controls.stateId.value === null) {
  //     this.supplierMasterForm.controls.cityId.setValue(null);
  //     this.cityList = [];
  //   }
  //   else {
  //     this.cityList = [];
  //     let cityObj = {
  //       cityId: this.supplierMasterForm.controls.stateId.value
  //     }
  //     this.assetsManagementService.getCityMasterListByStateID(cityObj).subscribe((Response: any) => {

  //       if (Response.meta.code == 200) {
  //         this.cityList = Response.data;
  //         this.noData = false;
  //       } else {
  //         this.noData = true;
  //       }
  //     }, (error) => {
  //       console.log(error.error.Message);
  //     });
  //   }
  // }


  addSupplierMaster() {
    this.defaultForm();
    this.submittedSupplierMasterData = false;
    $("#add-supplier-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
    this.IsEditSupplierMaster = false;
  }

  cancelSupplierMaster() {
    this.submittedSupplierMasterData = false;
    $("#add-supplier-modal").modal("hide");
    this.defaultForm();
    this.IsEditSupplierMaster = false;
  }
  saveSupplierMaster() {


    if (this.supplierMasterForm.invalid) {
      this.submittedSupplierMasterData = true;
      return;
    }
    let suppliermasterModelObj = {
      companyName: this.supplierMasterForm.controls.companyName.value,
      contactPersonName: this.supplierMasterForm.controls.contactPersonName.value,
      phone: this.supplierMasterForm.controls.phone.value,
      email: this.supplierMasterForm.controls.email.value,
      address: this.supplierMasterForm.controls.address.value,
      country: this.supplierMasterForm.controls.country.value ? this.supplierMasterForm.controls.country.value : "",
      state: this.supplierMasterForm.controls.state.value ? this.supplierMasterForm.controls.state.value : "",
      city: this.supplierMasterForm.controls.city.value ? this.supplierMasterForm.controls.city.value : "",
      pincode: this.supplierMasterForm.controls.pincode.value,
      gstno: this.supplierMasterForm.controls.gstno.value,
      panNo: this.supplierMasterForm.controls.panNo.value,
    };


    this.assetsManagementService.SaveSupplierMaster(suppliermasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedSupplierMasterData = false;
        this.getSupplierMasterList();
        this.defaultForm();
        this.IsEditSupplierMaster = false;
        this.commonService.notifier.notify('success', "Supplier Master Uploaded Successfully", Response.meta.message);
        $("#add-supplier-modal").modal("hide");
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  search(value: string): void {
    this.suppliermasterList = this.allsuppliermaster.filter((val: any) => JSON.stringify(val).toLowerCase().includes(value.toLowerCase()));
    this.p = 1;
    if (this.suppliermasterList.length == 0) {
      this.noData = true;
    } else {
      this.noData = false;
    }
  }

  getSupplierMasterList() {

    this.assetsManagementService.getSupplierMaster().subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.supplierMasterList = Response.data;
        this.suppliermasterList = this.supplierMasterList
        this.allsuppliermaster = this.suppliermasterList
        this.suppliermasterList = this.supplierMasterList.slice();
        this.suppliermasterListlength = Response.data.length;
        this.sortingList({ active: 'companyName', direction: 'asc' })
        this.noData = false;
      } else {
        this.noData = true;
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }


  editSupplierMaster(paramsObj) {

    this.IsEditSupplierMaster = true;
    let Id: any = { '_id': paramsObj.id }
    this.assetsManagementService.getSupplierMasterId(Id).subscribe((Response: any) => {

      this.supplierMasterForm.controls._id.setValue(Response.data._id)
      this.supplierMasterForm.controls.companyName.setValue(Response.data.companyName)
      this.supplierMasterForm.controls.contactPersonName.setValue(Response.data.contactPersonName)
      this.supplierMasterForm.controls.phone.setValue(Response.data.phone)
      this.supplierMasterForm.controls.email.setValue(Response.data.email)
      this.supplierMasterForm.controls.address.setValue(Response.data.address)
      this.supplierMasterForm.controls.country.setValue(Response.data.country)
      this.onCountryChange();
      this.supplierMasterForm.controls.state.setValue(Response.data.state)
      this.onStateChange();
      this.supplierMasterForm.controls.city.setValue(Response.data.city)
      this.supplierMasterForm.controls.pincode.setValue(Response.data.pincode)
      this.supplierMasterForm.controls.gstno.setValue(Response.data.gstno)
      this.supplierMasterForm.controls.panNo.setValue(Response.data.panNo)
      $("#add-supplier-modal").modal({ backdrop: 'static', keyboard: false, show: true });;

    }, (error) => {
      ////console.log(error);
      //this.commonService.notifier.notify('error', error.error.Message);
    });
  }
  updateSupplierMaster() {


    if (this.supplierMasterForm.invalid) {
      this.submittedSupplierMasterData = true;
      return;
    }
    let suppliermasterModelObj = {
      _id: this.supplierMasterForm.controls._id.value,
      companyName: this.supplierMasterForm.controls.companyName.value,
      contactPersonName: this.supplierMasterForm.controls.contactPersonName.value,
      phone: this.supplierMasterForm.controls.phone.value,
      email: this.supplierMasterForm.controls.email.value,
      address: this.supplierMasterForm.controls.address.value,
      country: this.supplierMasterForm.controls.country.value ? this.supplierMasterForm.controls.country.value : "",
      state: this.supplierMasterForm.controls.state.value ? this.supplierMasterForm.controls.state.value : "",
      city: this.supplierMasterForm.controls.city.value ? this.supplierMasterForm.controls.city.value : "",
      pincode: this.supplierMasterForm.controls.pincode.value,
      gstno: this.supplierMasterForm.controls.gstno.value,
      panNo: this.supplierMasterForm.controls.panNo.value,
    };

    this.assetsManagementService.UpdateSupplierMaster(suppliermasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedSupplierMasterData = false;
        this.getSupplierMasterList();
        this.defaultForm();
        this.IsEditSupplierMaster = false;
        this.commonService.notifier.notify('success', "Supplier Master Updated Successfully", Response.meta.message);
        $("#add-supplier-modal").modal("hide");
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  statusSupplierMaster(paramsObj) {


    let statusSupplierMasterModelObj = {
      "_id": paramsObj.id,
      "status": paramsObj.status
    };


    this.assetsManagementService.StatusSupplierMaster(statusSupplierMasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedSupplierMasterData = false;
        this.getSupplierMasterList();
        this.defaultForm();
        this.IsEditSupplierMaster = false;
        this.commonService.notifier.notify('success', Response.meta.message);
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  sortingList(sort: Sort) {

    const data = this.allsuppliermaster.slice();
    if (!sort.active || sort.direction === '') {
      this.suppliermasterList = data;
      return;
    }

    this.suppliermasterList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      switch (sort.active) {
        case 'companyName': return compare(a.companyName, b.companyName, isAsc);
        case 'contactPersonName': return compare(a.contactPersonName, b.contactPersonName, isAsc);
        case 'email': return compare(a.email, b.email, isAsc);
        default: return 0;
      }
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
