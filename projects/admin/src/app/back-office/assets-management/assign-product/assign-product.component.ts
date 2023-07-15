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
import { AssignProductService } from './assign-product.service'
import { DatePipe } from '@angular/common';
import { AssetsManagementService } from '../assets-management.service';

declare const $: any;

@Component({
  selector: 'app-assign-product',
  templateUrl: './assign-product.component.html',
  styleUrls: ['./assign-product.component.scss']
})
export class AssignProductComponent implements OnInit {

  IsEditAssignProduct = false;
  assignProductList: any[] = [];
  allAssignMaster: any[] = [];
  assignMasterList: any[] = [];
  l: number;
  p: number = 1;
  itemsPage: any;
  mySelect;
  assignProjectMasterForm: FormGroup;
  removeAssignedProductForm: FormGroup;
  productForm: FormGroup;
  x: number;
  t: number;
  listindex: number;
  assignProductListlength: any;
  categoryMasterList: any[] = [];
  productMasterList: any[] = [];
  userId: any;
  allAssignProductList: any[] = [];
  supplierMasterList: any[] = [];

  get fAssignProductData() { return this.assignProjectMasterForm.controls; }
  get fRemoveAssignProductData() { return this.removeAssignedProductForm.controls; }
  submittedAssignProductMasterData = false;
  submittedRemoveAssignProductMasterData = false;
  noData;


  activeTab: number;
  imageList: any;
  //image: any;
  file: any;
  Image: any;
  imgURL: any;
  isView: boolean;
  isCreated: boolean;
  isUpdated: boolean;
  isDeleted: boolean;
  searchTerm: string;

  todayDate = new Date()

  constructor(public commonService: CommonService, public assetsmanagementService: AssetsManagementService, public datePipe: DatePipe, public assignProductService: AssignProductService, public storageService: StorageService, public adminLayoutService: AdminLayoutService, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private spinner: NgxSpinnerService) {
    console.log(this.todayDate);
    let pagePermission = { module: "assignproduct" }
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
    this.IsEditAssignProduct = false;
    this.getSupplierMasterList();
    this.getCategoryMasterList();
    this.getAssignMasterList();
    this.defaultForm();
    this.defaultRemoveAssignedProductForm();
    this.defaultProductForm()
  }

  defaultProductForm() {
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
  // onPageChange(e) {
  //   if (!!this.searchTerm) {
  //     this.p = 1
  //   }
  // }
  search(value: string): void {
    this.assignProductList = this.allAssignProductList.filter((val) => JSON.stringify(val).toLowerCase().includes(value.toLowerCase()));;

    this.p = 1;

    if (this.assignProductList.length == 0) {
      this.noData = true;
    } else {
      this.noData = false;
    }
  }
  GotoViewProduct(id: any) {
    let Id: any = { 'productId': id }
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

      this.productForm.disable();
      $("#view-product-modal").modal({ backdrop: 'static', keyboard: false, show: true });
    }, (error) => {
    });
  }
  cancelProduct() {
    $("#view-product-modal").modal("hide");
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
  defaultForm() {
    this.assignProjectMasterForm = this.fb.group({
      categoryID: [, [Validators.required]],
      assetProductId: [, [Validators.required]],
    });
  }
  defaultRemoveAssignedProductForm() {
    this.removeAssignedProductForm = this.fb.group({
      assetProductId: [''],
      assigned: [''],
      reason: ['', [Validators.required]]
    });
  }

  itemsPerPage(): void {
    this.l = this.mySelect;
  }

  getCategoryMasterList() {
    this.assignProductService.getCategoryMasterList().subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.categoryMasterList = Response.data;
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }
  getProductListbyCategoryId(event) {
    this.productMasterList = [];
    let productObj = {
      categoryId: this.assignProjectMasterForm.value.categoryID
    }
    this.assignProductService.getProductMasterList(productObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.productMasterList = Response.data;
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }
  getAssignMasterList() {

    this.assignProductService.getAssignedProductMasterList().subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        let list = [];
        Response.data.filter((x: any) => {
          let productList = []
          x.ProductData.filter((y: any) => {
            let warrantyStartDate = y.warrantyStartDate.split('/')[2] + '-' + y.warrantyStartDate.split('/')[1] + '-' + y.warrantyStartDate.split('/')[0]
            let warrantyEndDate = y.warrantyEndDate.split('/')[2] + '-' + y.warrantyEndDate.split('/')[1] + '-' + y.warrantyEndDate.split('/')[0]


            let productDataObj = {
              categoryName: y.categoryName,
              productDescription: y.productDescription,
              productName: y.productName,
              productNo: y.productNo,
              warrantyEndDate: new Date(warrantyEndDate),
              warrantyStartDate: new Date(warrantyStartDate),
              _id: y._id,
            }
            productList.push(productDataObj);
          })
          let DataObj = {
            employeeId: x.employeeId,
            userName: x.userName,
            ProductData: productList
          }
          list.push(DataObj);
        })

        this.assignMasterList = list;
        this.allAssignProductList = this.assignMasterList;
        this.assignProductList = this.allAssignProductList;
        this.allAssignMaster = this.assignProductList;
        this.assignProductList = this.assignMasterList.slice();
        this.assignProductListlength = list.length;
        this.sortingList({ active: 'userName', direction: 'asc' })
        this.noData = false;
      } else {
        this.noData = true;
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }
  openRemoveAssignedProduct(assetProductId, assigned) {
    this.defaultRemoveAssignedProductForm();
    this.removeAssignedProductForm.controls.assetProductId.setValue(assetProductId);
    this.removeAssignedProductForm.controls.assigned.setValue(assigned);
    this.submittedRemoveAssignProductMasterData = false;
    $("#remove-product-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
  }
  closeRemoveAssignedProduct() {
    this.defaultRemoveAssignedProductForm();
    this.submittedRemoveAssignProductMasterData = false;
    $("#remove-product-modal").modal("hide");
  }
  removeAssignProductToEmployee() {
    if (this.removeAssignedProductForm.invalid) {
      this.submittedRemoveAssignProductMasterData = true;
      return;
    }
    let Obj = {
      assetProductId: this.removeAssignedProductForm.controls.assetProductId.value,
      assigned: this.removeAssignedProductForm.controls.assigned.value,
      reason: this.removeAssignedProductForm.controls.reason.value
    }
    this.assignProductService.removeProductToEmployees(Obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.defaultRemoveAssignedProductForm();
        this.submittedRemoveAssignProductMasterData = false;
        $("#remove-product-modal").modal("hide");
        this.getAssignMasterList();
        this.commonService.notifier.notify('success', "Remove Assigned Product Successfully.");
      }
    });
  }

  assignProductToEmployee() {
    if (this.assignProjectMasterForm.invalid) {
      this.submittedAssignProductMasterData = true;
      return;
    }
    let assignProductObj = {
      assigned: this.userId,
      assetProductId: this.assignProjectMasterForm.value.assetProductId
    }

    this.assignProductService.assignProductToEmployees(assignProductObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        $("#add-supplier-modal").modal("hide");
        this.commonService.notifier.notify('success', "Product is Assign Successfully.");
        this.getAssignMasterList();
      }
    });

  }

  addSupplierMaster(employeeId) {
    this.userId = employeeId
    this.defaultForm();
    this.submittedAssignProductMasterData = false;
    $("#add-supplier-modal").modal({ backdrop: 'static', keyboard: false, show: true });;
    this.IsEditAssignProduct = false;
  }

  cancelSupplierMaster() {
    this.submittedAssignProductMasterData = false;
    $("#add-supplier-modal").modal("hide");
    this.defaultForm();
    this.IsEditAssignProduct = false;
  }
  // saveSupplierMaster() {


  //   if (this.assignProjectMasterForm.invalid) {
  //     this.submittedAssignProductMasterData = true;
  //     return;
  //   }
  //   let suppliermasterModelObj = {
  //     companyName: this.assignProjectMasterForm.controls.companyName.value,
  //     contactPersonName: this.assignProjectMasterForm.controls.contactPersonName.value,
  //     phone: this.assignProjectMasterForm.controls.phone.value,
  //     email: this.assignProjectMasterForm.controls.email.value,
  //     address: this.assignProjectMasterForm.controls.address.value,
  //     country: this.assignProjectMasterForm.controls.country.value,
  //     state: this.assignProjectMasterForm.controls.state.value,
  //     city: this.assignProjectMasterForm.controls.city.value,
  //     pincode: this.assignProjectMasterForm.controls.pincode.value,
  //     gstno: this.assignProjectMasterForm.controls.gstno.value,
  //     panNo: this.assignProjectMasterForm.controls.panNo.value,
  //   };


  //   this.assignProductService.getSupplierMaster().subscribe((Response: any) => {

  //     if (Response.meta.code == 200) {
  //       this.submittedAssignProductMasterData = false;
  //       this.getAssignMasterList();
  //       this.defaultForm();
  //       this.IsEditAssignProduct = false;
  //       this.commonService.notifier.notify('success', Response.meta.message);
  //       $("#add-supplier-modal").modal("hide");
  //     }
  //     else {
  //       this.commonService.notifier.notify('error', Response.meta.message);
  //     }
  //   }, (error) => {
  //     console.log(error);
  //   });
  // }
  // editSupplierMaster(paramsObj) {

  //   this.IsEditAssignProduct = true;
  //   let Id: any = { '_id': paramsObj.id }
  //   this.assignProductService.getSupplierMaster().subscribe((Response: any) => {

  //     this.assignProjectMasterForm.controls._id.setValue(Response.data._id)
  //     this.assignProjectMasterForm.controls.companyName.setValue(Response.data.companyName)
  //     this.assignProjectMasterForm.controls.contactPersonName.setValue(Response.data.contactPersonName)
  //     this.assignProjectMasterForm.controls.phone.setValue(Response.data.phone)
  //     this.assignProjectMasterForm.controls.email.setValue(Response.data.email)
  //     this.assignProjectMasterForm.controls.address.setValue(Response.data.address)
  //     this.assignProjectMasterForm.controls.country.setValue(Response.data.country)
  //     this.assignProjectMasterForm.controls.state.setValue(Response.data.state)
  //     this.assignProjectMasterForm.controls.city.setValue(Response.data.city)
  //     this.assignProjectMasterForm.controls.pincode.setValue(Response.data.pincode)
  //     this.assignProjectMasterForm.controls.gstno.setValue(Response.data.gstno)
  //     this.assignProjectMasterForm.controls.panNo.setValue(Response.data.panNo)
  //     $("#add-supplier-modal").modal({ backdrop: 'static', keyboard: false, show: true });;

  //   });
  // }
  // updateSupplierMaster() {


  //   if (this.assignProjectMasterForm.invalid) {
  //     this.submittedAssignProductMasterData = true;
  //     return;
  //   }
  //   let suppliermasterModelObj = {
  //     _id: this.assignProjectMasterForm.controls._id.value,
  //     companyName: this.assignProjectMasterForm.controls.companyName.value,
  //     contactPersonName: this.assignProjectMasterForm.controls.contactPersonName.value,
  //     phone: this.assignProjectMasterForm.controls.phone.value,
  //     email: this.assignProjectMasterForm.controls.email.value,
  //     address: this.assignProjectMasterForm.controls.address.value,
  //     country: this.assignProjectMasterForm.controls.country.value,
  //     state: this.assignProjectMasterForm.controls.state.value,
  //     city: this.assignProjectMasterForm.controls.city.value,
  //     pincode: this.assignProjectMasterForm.controls.pincode.value,
  //     gstno: this.assignProjectMasterForm.controls.gstno.value,
  //     panNo: this.assignProjectMasterForm.controls.panNo.value,
  //   };

  //   this.assignProductService.getSupplierMaster().subscribe((Response: any) => {

  //     if (Response.meta.code == 200) {
  //       this.submittedAssignProductMasterData = false;
  //       this.getAssignMasterList();
  //       this.defaultForm();
  //       this.IsEditAssignProduct = false;
  //       this.commonService.notifier.notify('success', Response.meta.message);
  //       $("#add-supplier-modal").modal("hide");
  //     }
  //     else {
  //       this.commonService.notifier.notify('error', Response.meta.message);
  //     }
  //   }, (error) => {
  //     console.log(error);
  //   });
  // }
  // statusSupplierMaster(paramsObj) {


  //   let statusSupplierMasterModelObj = {
  //     "_id": paramsObj.id,
  //     "status": paramsObj.status
  //   };


  //   this.assignProductService.getSupplierMaster().subscribe((Response: any) => {

  //     if (Response.meta.code == 200) {
  //       this.submittedAssignProductMasterData = false;
  //       this.getAssignMasterList();
  //       this.defaultForm();
  //       this.IsEditAssignProduct = false;
  //       this.commonService.notifier.notify('success', Response.meta.message);
  //     }
  //     else {
  //       this.commonService.notifier.notify('error', Response.meta.message);
  //     }
  //   }, (error) => {
  //     console.log(error);
  //   });
  // }



  sortingList(sort: Sort) {

    const data = this.allAssignProductList.slice();
    if (!sort.active || sort.direction === '') {
      this.assignProductList = data;
      return;
    }

    this.assignProductList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      switch (sort.active) {
        case 'userName': return compare(a.userName, b.userName, isAsc);
        default: return 0;
      }
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}