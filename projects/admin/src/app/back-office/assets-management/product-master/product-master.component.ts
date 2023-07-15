import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AdminLayoutService } from '../../../layouts/admin-layout/admin-layout.service';
import { CommonService } from '../../../shared/common.service';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import * as Chartist from 'chartist';
import { NgxSpinnerService } from "ngx-spinner";
import { Sort } from '@angular/material/sort';
import { StorageService, StorageKey } from '../../../shared/storage.service';
import { stringify } from 'querystring';
import { AssetsManagementService } from '../assets-management.service';
import { environment } from '../../../../environments/environment';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

declare const $: any;



@Component({
  selector: 'app-product-master',
  templateUrl: './product-master.component.html',
  styleUrls: ['./product-master.component.css']
})
export class ProductMasterComponent implements OnInit {
  ISeditProduct = false;
  productList: any[] = [];
  allproduct: any[] = [];
  ProductList: any[] = [];
  l: number;
  p: number = 1;
  itemsPage: any;
  mySelect;
  productForm: FormGroup;
  cloneProductForm: FormGroup;
  x: number;
  t: number;
  listindex: number;
  productListlength: any;
  categoryMasterList: any[]
  supplierMasterList: any[]
  cloneProductList: any[] = []

  file: any;
  imgURL: any;
  public imagePath;
  message: string;
  imageError: boolean = false;
  @ViewChild('file') myInputVariable: ElementRef;
  showWarrantyEndDate: boolean = false;
  showInvalidEndDate: boolean;
  minWarrentyDate: NgbDateStruct;
  get fTitleData() { return this.productForm.controls; }
  get fPathData() { return this.productForm.controls; }
  get fCloneData() { return this.cloneProductForm.controls; }
  submittedProductData = false;
  submittedCloneProductData = false;
  noData;
  perentList: any;
  isView: boolean;
  isCreated: boolean;
  isUpdated: boolean;
  isDeleted: boolean;
  searchTerm: string;
  productIDGetByAssignProduct = "";
  viewProductModelShow: boolean = false;

  constructor(public commonService: CommonService, public adminLayoutService: AdminLayoutService, public storageService: StorageService, public assetsmanagementService: AssetsManagementService, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private spinner: NgxSpinnerService, private route: ActivatedRoute) {
    let pagePermission = { module: "productmaster" }
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


    this.route.queryParams.subscribe((x: any) => {
      this.productIDGetByAssignProduct = x.id
    })

    if (this.productIDGetByAssignProduct) {
      this.viewProductModelShow = true;
      let Obj = {
        id: this.productIDGetByAssignProduct
      }
      this.editProductmaster(Obj)
    }

  }

  ngOnInit() {
    this.noData = false;
    this.mySelect = 5;
    this.l = 10;
    this.ISeditProduct = false;
    this.getProductList();
    this.getCategorymasterList();
    this.getSupplierMasterList();
    this.defaultForm();
    this.defaultCloneProductForm();
    this.getProductListfoorCloneByClientId();
  }

  defaultForm() {
    this.productForm = this.fb.group({
      _id: ['0'],
      supplierId: [, [Validators.required]],
      categoryId: [, [Validators.required]],
      productNo: [''],
      purchasedDate: [null],
      productName: ['', [Validators.required]],
      barcodeNo: [''],
      amount: [''],
      supplierInNo: [''],
      warrantyStartDate: [null],
      warrantyEndDate: [null],
      productDescription: [''],
    });
  }
  defaultCloneProductForm() {
    this.cloneProductForm = this.fb.group({
      categoryId: [null],
      productId: [null, [Validators.required]]
    });
  }

  getProductListfoorCloneByClientId() {
    this.cloneProductForm.controls.productId.setValue(null);
    this.cloneProductList = [];
    let Obj = {
      categoryId: this.cloneProductForm.value.categoryId == null ? '' : this.cloneProductForm.value.categoryId
    }
    this.assetsmanagementService.getCloneProductListByCategoryId(Obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.cloneProductList = Response.data
      }
    })
  }

  cloneProductBySetData() {
    let cloneProductObj = {
      productId: this.cloneProductForm.controls.productId.value,
      categoryId: this.cloneProductForm.controls.categoryId.value == null ? '' : this.cloneProductForm.controls.categoryId.value
    }
    this.assetsmanagementService.getCloneProductList(cloneProductObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {

        this.productForm.controls._id.setValue(Response.data[0]._id)
        this.productForm.controls.supplierId.setValue(Response.data[0].supplierId)
        this.productForm.controls.categoryId.setValue(Response.data[0].categoryId)
        if (Response.data[0].purchasedDate) {
          this.productForm.controls.purchasedDate.setValue(new Date(Response.data[0].purchasedDate.split('/')[2] + '-' + Response.data[0].purchasedDate.split('/')[1] + '-' + Response.data[0].purchasedDate.split('/')[0]));
        }
        else {
          this.productForm.controls.purchasedDate.setValue('');
        }
        this.productForm.controls.productName.setValue(Response.data[0].productName)
        this.productForm.controls.productNo.setValue(Response.data[0].productNo)
        this.productForm.controls.barcodeNo.setValue(Response.data[0].barcodeNo)
        this.productForm.controls.amount.setValue(Response.data[0].amount)
        this.productForm.controls.supplierInNo.setValue(Response.data[0].supplierInNo)
        if (Response.data[0].warrantyStartDate) {
          this.productForm.controls.warrantyStartDate.setValue(new Date(Response.data[0].warrantyStartDate.split('/')[2] + '-' + Response.data[0].warrantyStartDate.split('/')[1] + '-' + Response.data[0].warrantyStartDate.split('/')[0]));
        }
        else {
          this.productForm.controls.warrantyStartDate.setValue('')
        }
        if (Response.data[0].warrantyEndDate) {
          this.productForm.controls.warrantyEndDate.setValue(new Date(Response.data[0].warrantyEndDate.split('/')[2] + '-' + Response.data[0].warrantyEndDate.split('/')[1] + '-' + Response.data[0].warrantyEndDate.split('/')[0]));
        }
        else {
          this.productForm.controls.warrantyEndDate.setValue('')
        }
        this.productForm.controls.productDescription.setValue(Response.data[0].productDescription)
        if (Response.data[0].billImage) {
          this.imgURL = Response.data[0].billImage;
          this.file = Response.data[0].billImage;
        }
        else {
          this.imgURL = '';
          this.file = ''
        }
      }
    })
  }

  clearDate(id: any) {
    if (id == 0) {
      this.productForm.controls.purchasedDate.setValue(null);
    }
    else if (id == 1) {
      this.productForm.controls.warrantyStartDate.setValue(null);
    }
    else if (id == 2) {
      this.productForm.controls.warrantyEndDate.setValue(null);
    }
  }

  itemsPerPage(): void {
    this.l = this.mySelect;
  }

  addProduct() {
    $("#add-product-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
    this.ISeditProduct = false;
    this.imageError = false;
    this.viewProductModelShow = false;
    this.imgURL = '';
    this.submittedProductData = false;
    this.defaultCloneProductForm()
    this.myInputVariable.nativeElement.value = ""
  }

  cancelProduct() {
    $("#add-product-modal").modal("hide");
    if (this.viewProductModelShow == true) {
      this.viewProductModelShow = false;
      $("#view-product-modal").modal("hide");
      this.router.navigate(['/admin/assets-management/assign-product-list'])
    }
    this.defaultForm();
    this.defaultCloneProductForm()
    this.ISeditProduct = false;
    this.submittedProductData = false;
    this.viewProductModelShow = false;
    this.imageError = false;
    this.imgURL = '';
    this.myInputVariable.nativeElement.value = ""
  }

  onWarrentyStartChange() {
    this.productForm.controls.warrantyEndDate.setValue(null);
  }

  search(value: any): void {
    this.productList = this.allproduct.filter((val: any) => JSON.stringify(val).toLowerCase().includes(value.toLowerCase()));
    this.p = 1;

    if (this.productList.length == 0) {
      this.noData = true;
    } else {
      this.noData = false;
    }
  }

  viewProductHistory(id) {
    this.router.navigate(['admin/assets-management/assests-product-history/' + id])
  }

  saveProduct() {

    if (this.productForm.invalid) {
      this.submittedProductData = true;
      return;
    }



    let productmasterModelObj: FormData = new FormData();
    productmasterModelObj.append('supplierId', this.productForm.value.supplierId);
    productmasterModelObj.append('categoryId', this.productForm.value.categoryId);
    productmasterModelObj.append('purchasedDate', this.productForm.value.purchasedDate ? moment(this.productForm.value.purchasedDate).format('DD/MM/yyyy') : '');
    productmasterModelObj.append('productName', this.productForm.value.productName);
    productmasterModelObj.append('productNo', this.productForm.value.productNo);
    productmasterModelObj.append('barcodeNo', !!this.productForm.value.barcodeNo ? this.productForm.value.barcodeNo : '');
    productmasterModelObj.append('amount', this.productForm.value.amount);
    productmasterModelObj.append('supplierInNo', this.productForm.value.supplierInNo);
    productmasterModelObj.append('warrantyStartDate', this.productForm.value.warrantyStartDate ? moment(this.productForm.value.warrantyStartDate).format('DD/MM/yyyy') : '');
    productmasterModelObj.append('warrantyEndDate', this.productForm.value.warrantyEndDate ? moment(this.productForm.value.warrantyEndDate).format('DD/MM/yyyy') : '');
    productmasterModelObj.append('productDescription', this.productForm.value.productDescription);
    productmasterModelObj.append('billImage', this.file);
    this.assetsmanagementService.SaveProductMaster(productmasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        $("#add-product-modal").modal("hide");
        this.submittedProductData = false;
        this.getProductList();
        this.defaultForm();
        this.getCategorymasterList();
        this.getSupplierMasterList();
        this.ISeditProduct = false;
        this.imageError = false;
        this.imgURL = '';
        this.commonService.notifier.notify('success', "Product Master Uploaded Successfully", Response.meta.message);
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  getProductList() {

    this.assetsmanagementService.getProductMaster().subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.ProductList = Response.data;
        this.productList = this.ProductList
        this.allproduct = this.productList
        this.productList = this.ProductList.slice();
        this.productListlength = Response.data.length;
        this.sortingList({ active: 'productName', direction: 'asc' })
        this.noData = false;
      } else {
        this.noData = true;
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }

  editProductmaster(paramsObj) {

    this.ISeditProduct = true;
    let Id: any = { 'productId': paramsObj.id }
    this.assetsmanagementService.getProductMasterId(Id).subscribe((Response: any) => {

      this.productForm.controls._id.setValue(Response.data._id)
      this.productForm.controls.supplierId.setValue(Response.data.supplierId)
      this.productForm.controls.categoryId.setValue(Response.data.categoryId)
      if (Response.data.purchasedDate) {
        this.productForm.controls.purchasedDate.setValue(new Date(Response.data.purchasedDate.split('/')[2] + '-' + Response.data.purchasedDate.split('/')[1] + '-' + Response.data.purchasedDate.split('/')[0]));
      }
      else {
        this.productForm.controls.purchasedDate.setValue('');
      }
      this.productForm.controls.productName.setValue(Response.data.productName)
      this.productForm.controls.productNo.setValue(Response.data.productNo)
      this.productForm.controls.barcodeNo.setValue(Response.data.barcodeNo)
      this.productForm.controls.amount.setValue(Response.data.amount)
      this.productForm.controls.supplierInNo.setValue(Response.data.supplierInNo)
      if (Response.data.warrantyStartDate) {
        this.productForm.controls.warrantyStartDate.setValue(new Date(Response.data.warrantyStartDate.split('/')[2] + '-' + Response.data.warrantyStartDate.split('/')[1] + '-' + Response.data.warrantyStartDate.split('/')[0]));
      }
      else {
        this.productForm.controls.warrantyStartDate.setValue('')
      }
      if (Response.data.warrantyEndDate) {
        this.productForm.controls.warrantyEndDate.setValue(new Date(Response.data.warrantyEndDate.split('/')[2] + '-' + Response.data.warrantyEndDate.split('/')[1] + '-' + Response.data.warrantyEndDate.split('/')[0]));
      }
      else {
        this.productForm.controls.warrantyEndDate.setValue('')
      }
      this.productForm.controls.productDescription.setValue(Response.data.productDescription)
      if (Response.data.billImage) {
        this.imgURL = Response.data.billImage;
        this.file = Response.data.billImage;
      }
      else {
        this.imgURL = '';
        this.file = ''
      }
      if (this.viewProductModelShow === false) {
        $("#add-product-modal").modal({ backdrop: 'static', keyboard: false, show: true });
      }
      else {
        this.productForm.disable();
        $("#view-product-modal").modal({ backdrop: 'static', keyboard: false, show: true });
      }
    }, (error) => {
      ////console.log(error);
      //this.commonService.notifier.notify('error', error.error.Message);
    });
  }
  updateProduct() {
    if (this.productForm.invalid) {
      this.submittedProductData = true;
      return;
    }

    let productmasterModelObj: FormData = new FormData();
    productmasterModelObj.append('_id', this.productForm.value._id);
    productmasterModelObj.append('supplierId', this.productForm.value.supplierId);
    productmasterModelObj.append('categoryId', this.productForm.value.categoryId);
    productmasterModelObj.append('purchasedDate', this.productForm.value.purchasedDate ? moment(this.productForm.value.purchasedDate).format('DD/MM/yyyy') : '');
    productmasterModelObj.append('productName', this.productForm.value.productName);
    productmasterModelObj.append('productNo', this.productForm.value.productNo);
    productmasterModelObj.append('barcodeNo', this.productForm.value.barcodeNo);
    productmasterModelObj.append('amount', this.productForm.value.amount);
    productmasterModelObj.append('supplierInNo', this.productForm.value.supplierInNo);
    productmasterModelObj.append('warrantyStartDate', this.productForm.value.warrantyStartDate ? moment(this.productForm.value.warrantyStartDate).format('DD/MM/yyyy') : '');
    productmasterModelObj.append('warrantyEndDate', this.productForm.value.warrantyEndDate ? moment(this.productForm.value.warrantyEndDate).format('DD/MM/yyyy') : '');
    productmasterModelObj.append('productDescription', this.productForm.value.productDescription);
    productmasterModelObj.append('billImage', this.file);

    this.assetsmanagementService.UpdateProductMaster(productmasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        $("#add-product-modal").modal("hide");
        this.submittedProductData = false;
        this.getProductList();
        this.defaultForm();
        this.imageError = false;
        this.imgURL = '';
        this.ISeditProduct = false;
        this.commonService.notifier.notify('success', "Product Master Updated Successfully", Response.meta.message);
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  statusProduct(paramsObj) {


    let statusproductModelObj = {
      "_id": paramsObj.id,
      "status": paramsObj.status
    };


    this.assetsmanagementService.StatusProductMaster(statusproductModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedProductData = false;
        this.getProductList();
        this.defaultForm();
        this.ISeditProduct = false;
        this.commonService.notifier.notify('success', Response.meta.message);
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }
  getCategorymasterList() {

    this.assetsmanagementService.getCategoryMasterActiveList().subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.categoryMasterList = Response.data;
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }
  getSupplierMasterList() {

    this.assetsmanagementService.getSupplierMasterActiveList().subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.supplierMasterList = Response.data;
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }
  preview(files) {

    this.file = files[0];
    if (files.length === 0)
      return;

    this.imgURL = this.file.name;
    this.myInputVariable.nativeElement.value = "";
  }
  removeuploadFile() {
    this.imgURL = "";
    this.file = "";
    this.imageError = true;
    this.myInputVariable.nativeElement.value = "";
  }

  sortingList(sort: Sort) {

    const data = this.allproduct.slice();
    if (!sort.active || sort.direction === '') {
      this.productList = data;
      return;
    }

    this.productList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      switch (sort.active) {
        case 'productName': return compare(a.productName, b.productName, isAsc);
        case 'companyName': return compare(a.companyName, b.companyName, isAsc);
        case 'categoryName': return compare(a.categoryName, b.categoryName, isAsc);
        case 'productNo': return compare(a.productNo, b.productNo, isAsc);
        default: return 0;
      }
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}