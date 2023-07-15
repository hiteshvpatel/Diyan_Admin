import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { environment } from '../../../../environments/environment';

declare const $: any;
interface categoryMasterData {
  categoryName: string;
}

@Component({
  selector: 'app-category-master',
  templateUrl: './category-master.component.html',
  styleUrls: ['./category-master.component.scss']
})
export class CategoryMasterComponent implements OnInit {
  ISeditCategoryMaster = false;
  categoryMasterList: categoryMasterData[];
  allcategorymaster: categoryMasterData[];
  categorymasterList: categoryMasterData[];
  l: number;
  p: number = 1;
  itemsPage: any;
  mySelect;
  categorymasterForm: FormGroup;
  x: number;
  t: number;
  listindex: number;
  categorymasterListlength: any;
  allimageList: any;
  @ViewChild('file') myInputVariable: ElementRef;
  get fCategorynameData() { return this.categorymasterForm.controls; }
  submittedCategoryMasterData = false;
  public imagePath;
  imgURL: any;
  message: string;
  noData;
  noimageData;
  imgUrl = environment.uploadedUrl;

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


  constructor(public commonService: CommonService, public adminLayoutService: AdminLayoutService, public storageService: StorageService, public assetsmanagementService: AssetsManagementService, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private spinner: NgxSpinnerService) {
    let pagePermission = { module: "categorymaster" }
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
    this.mySelect = 10;
    this.l = 10;
    this.ISeditCategoryMaster = false;
    this.getCategorymasterList();
    this.defaultForm();
  }

  defaultForm() {
    this.categorymasterForm = this.fb.group({
      _id: [''],
      categoryName: ['', [Validators.required]],
    });
  }

  itemsPerPage(): void {
    this.l = this.mySelect;
  }


  addCategoryMaster() {
    $("#add-category-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
    this.defaultForm();
    this.ISeditCategoryMaster = false;
    this.submittedCategoryMasterData = false;
    this.imgURL = "";
    this.file = "";
    ;
    this.myInputVariable.nativeElement.value = "";
  }

  cancelCategorymaster() {
    $("#add-category-modal").modal("hide");
    this.defaultForm();
    this.ISeditCategoryMaster = false;
    this.submittedCategoryMasterData = false;
    this.imgURL = "";
    this.file = "";
    ;
    this.myInputVariable.nativeElement.value = "";
  }
  saveCategorymaster() {
    if (this.categorymasterForm.invalid) {
      this.submittedCategoryMasterData = true;
      return;
    }


    let categorymasterModelObj: FormData = new FormData();
    categorymasterModelObj.append('categoryName', this.categorymasterForm.value.categoryName);
    categorymasterModelObj.append('category_Image', this.file);
    this.assetsmanagementService.SaveCategoryMaster(categorymasterModelObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.submittedCategoryMasterData = false;
        this.getCategorymasterList();
        this.defaultForm();
        ;
        this.ISeditCategoryMaster = false;
        this.file = '';
        this.commonService.notifier.notify('success', "Category Master Uploaded Successfully", Response.meta.message);
        $("#add-category-modal").modal("hide");
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  search(value: string): void {
    this.categorymasterList = this.allcategorymaster.filter((val: any) => val.categoryName.toLowerCase().includes(value.toLowerCase()));
    this.p = 1;
    if (this.categorymasterList.length == 0) {
      this.noData = true;
    } else {
      this.noData = false;
    }
  }

  getCategorymasterList() {

    this.assetsmanagementService.getCategoryMaster().subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.categoryMasterList = Response.data;
        this.categorymasterList = this.categoryMasterList
        this.allcategorymaster = this.categorymasterList
        this.categorymasterList = this.categoryMasterList.slice();
        this.categorymasterListlength = Response.data.length;
        this.sortingList({ active: 'categoryName', direction: 'asc' })
        this.noData = false;
      } else {
        this.noData = true;
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }


  editCategorymaster(paramsObj) {

    this.ISeditCategoryMaster = true;
    let Id: any = { '_id': paramsObj.id }
    this.assetsmanagementService.getcategoryMasterId(Id).subscribe((Response: any) => {

      this.categorymasterForm.controls._id.setValue(Response.data._id)
      this.categorymasterForm.controls.categoryName.setValue(Response.data.categoryName)
      if (Response.data.category_Image) {
        this.imgURL = environment.uploadedUrl + Response.data.category_Image;
        this.file = Response.data.category_Image;
      }
      else {
        this.imgURL = '';
        this.file = ''
      }
      $("#add-category-modal").modal({ backdrop: 'static', keyboard: false, show: true });;

    }, (error) => {
      ////console.log(error);
      //this.commonService.notifier.notify('error', error.error.Message);
    });
  }
  updateCategorymaster() {
    if (this.categorymasterForm.invalid) {
      this.submittedCategoryMasterData = true;
      return;
    }

    let categorymasterModelObj: FormData = new FormData();
    categorymasterModelObj.append('_id', this.categorymasterForm.value._id);
    categorymasterModelObj.append('categoryName', this.categorymasterForm.value.categoryName);
    categorymasterModelObj.append('category_Image', this.file);

    this.assetsmanagementService.UpdateCategoryMaster(categorymasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedCategoryMasterData = false;
        this.getCategorymasterList();
        ;
        this.file = '';
        this.defaultForm();
        this.ISeditCategoryMaster = false;
        this.commonService.notifier.notify('success', "Category Master Updated Successfully", Response.meta.message);
        $("#add-category-modal").modal("hide");
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  statusCategorymaster(paramsObj) {


    let statuscategorymasterModelObj = {
      "_id": paramsObj.id,
      "status": paramsObj.status
    };


    this.assetsmanagementService.StatusCategoryMaster(statuscategorymasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedCategoryMasterData = false;
        this.getCategorymasterList();
        this.defaultForm();
        this.ISeditCategoryMaster = false;
        this.commonService.notifier.notify('success', Response.meta.message);
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

  sortingList(sort: Sort) {

    const data = this.allcategorymaster.slice();
    if (!sort.active || sort.direction === '') {
      this.categorymasterList = data;
      return;
    }

    this.categorymasterList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      switch (sort.active) {
        case 'categoryName': return compare(a.categoryName, b.categoryName, isAsc);
        default: return 0;
      }
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}