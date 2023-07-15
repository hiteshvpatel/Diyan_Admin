import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AdminLayoutService } from '../../../layouts/admin-layout/admin-layout.service';
import { CommonService } from '../../../shared/common.service';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Params, Router } from '@angular/router';
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
  selector: 'app-add-new-supplier-purchase',
  templateUrl: './add-new-supplier-purchase.component.html',
  styleUrls: ['./add-new-supplier-purchase.component.scss']
})
export class AddNewSupplierPurchaseComponent implements OnInit {

  ISEditSupplierPurchase = false;
  l: number;
  p: number = 1;
  itemsPage: any;
  mySelect;
  supplierPurchaseForm: FormGroup;
  supplierPurchaseListlength: any;
  categoryMasterList: any[]
  supplierMasterList: any[]

  file: any;
  imgURL: any;
  public imagePath;
  message: string;
  imageError: boolean = false;
  @ViewChild('file') myInputVariable: ElementRef;
  showWarrantyEndDate: boolean = false;
  showInvalidEndDate: boolean;
  minWarrentyDate: NgbDateStruct;
  purchaseList: any;
  get fSupplierPurchaseMasterData() { return this.supplierPurchaseForm.controls; }
  submittedSupplierPurchaseData = false;
  noData;
  perentList: any;
  isView: boolean;
  isCreated: boolean;
  isUpdated: boolean;
  isDeleted: boolean;
  searchTerm: string;
  supplierPurchaseId: any;

  constructor(public commonService: CommonService, private route: ActivatedRoute, public storageService: StorageService, public assetsmanagementService: AssetsManagementService, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private spinner: NgxSpinnerService) {
    const currentUrl = this.router.url
    if (currentUrl.includes('add-new-supplier-purchase-master')) {
      this.ISEditSupplierPurchase = false;
      this.defaultForm();
      this.addProductDataItem();
    }
    else if (currentUrl.includes('edit-supplier-purchase-master')) {
      this.route.params.subscribe((params: Params) => {
        this.supplierPurchaseId = params.id;
      });
      this.ISEditSupplierPurchase = true;
      this.defaultForm();
      this.purchaseList = this.supplierPurchaseForm.get('purchaseItem') as FormArray;
      this.editSupplierPurchase();
    }
  }

  ngOnInit() {
    this.noData = false;
    this.mySelect = 5;
    this.l = 10;
    this.ISEditSupplierPurchase = false;
    this.getCategorymasterList();
    this.getSupplierMasterList();
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

  defaultForm() {
    this.supplierPurchaseForm = this.fb.group({
      _id: ['0'],
      supplierId: [, [Validators.required]],
      purchaseDate: [, [Validators.required]],
      InvoiceNumber: [, [Validators.required]],
      purchaseItem: this.fb.array([]),
    });
  }

  createProductData(oItem?: object): FormGroup {
    return this.fb.group({
      categoryId: [(oItem['categoryId'] ? oItem['categoryId'] : null),],
      productName: [(oItem['productName'] ? oItem['productName'] : ''),],
      barcode: [(oItem['barcode'] ? oItem['barcode'] : ''),],
      qunatity: [(oItem['qunatity'] ? oItem['qunatity'] : ''),],
      warrantyStartDate: [(oItem['warrantyStartDate'] ? oItem['warrantyStartDate'] : ''),],
      warrantyEndDate: [(oItem['warrantyEndDate'] ? oItem['warrantyEndDate'] : ''),],
      CGST: [(oItem['CGST'] ? oItem['CGST'] : ''),],
      SGST: [(oItem['SGST'] ? oItem['SGST'] : ''),],
      IGST: [(oItem['IGST'] ? oItem['IGST'] : ''),],
      amount: [(oItem['amount'] ? oItem['amount'] : ''),],
    });
  }

  addProductDataItem() {
    this.purchaseList = this.supplierPurchaseForm.get('purchaseItem') as FormArray;
    this.purchaseList.push(this.createProductData({}));
    for (let i = 0; i < this.purchaseList.length; i++) {
      var purchaseItem = (this.supplierPurchaseForm.get('purchaseItem') as FormArray).at(i) as FormGroup;
      purchaseItem.get('categoryId').setValidators([Validators.required]);
      purchaseItem.get('productName').setValidators([Validators.required]);
      purchaseItem.get('barcode').setValidators([Validators.required]);
      purchaseItem.get('qunatity').setValidators([Validators.required]);
      purchaseItem.get('warrantyStartDate').setValidators([Validators.required]);
      purchaseItem.get('warrantyEndDate').setValidators([Validators.required]);
      purchaseItem.get('CGST').setValidators([Validators.required]);
      purchaseItem.get('SGST').setValidators([Validators.required]);
      purchaseItem.get('IGST').setValidators([Validators.required]);
      purchaseItem.get('amount').setValidators([Validators.required]);
    }
  }

  removeProductItem(index: any) {
    if (this.purchaseList.length > 0) {
      var purchaseItem = (this.supplierPurchaseForm.get('purchaseItem') as FormArray).at(index) as FormGroup;
      purchaseItem.get('categoryId').clearValidators();
      purchaseItem.get('productName').clearValidators();
      purchaseItem.get('barcode').clearValidators();
      purchaseItem.get('qunatity').clearValidators();
      purchaseItem.get('warrantyStartDate').clearValidators();
      purchaseItem.get('warrantyEndDate').clearValidators();
      purchaseItem.get('CGST').clearValidators();
      purchaseItem.get('SGST').clearValidators();
      purchaseItem.get('IGST').clearValidators();
      purchaseItem.get('amount').clearValidators();

      this.purchaseList.removeAt(index);

    }
  }

  onWarrentyStartChange(i: any) {
    var purchaseItem = (this.supplierPurchaseForm.get('purchaseItem') as FormArray).at(i) as FormGroup;
    purchaseItem.get('warrantyEndDate').setValue('');
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
      this.imageError = false
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
    this.imageError = true;
    this.myInputVariable.nativeElement.value = "";
  }

  saveSupplierPurchase() {

    if (this.supplierPurchaseForm.invalid) {
      this.submittedSupplierPurchaseData = true;
      if (!this.file || this.file == '') {
        this.imageError = true;
        return;
      }
      else {
        return;
      }
    }

    let purchaseItemData = [];
    this.supplierPurchaseForm.value.purchaseItem.forEach((x: any) => {
      let purchaseData = {
        categoryId: x.categoryId,
        productName: x.productName,
        barcode: x.barcode,
        qunatity: x.qunatity,
        warrantyStartDate: moment(x.warrantyStartDate).format('DD/MM/yyyy'),
        warrantyEndDate: moment(x.warrantyEndDate).format('DD/MM/yyyy'),
        CGST: x.CGST,
        SGST: x.SGST,
        IGST: x.IGST,
        amount: x.amount,
      }
      purchaseItemData.push(purchaseData);
    })

    let supplierPurchaseMasterModelObj = {
      supplierId: this.supplierPurchaseForm.value.supplierId,
      purchaseDate: this.supplierPurchaseForm.value.purchaseDate ? moment(this.supplierPurchaseForm.value.purchaseDate).format('DD/MM/yyy') : '',
      InvoiceNumber: this.supplierPurchaseForm.value.InvoiceNumber,
      purchaseItem: purchaseItemData,
    };


    this.assetsmanagementService.SaveSupplierPurchaseMaster(supplierPurchaseMasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {

        let supplierPurchaseImage: FormData = new FormData();
        supplierPurchaseImage.append('_id', Response.data._id);
        supplierPurchaseImage.append('billImage', this.file);

        this.assetsmanagementService.SaveSupplierPurchaseBillImage(supplierPurchaseImage).subscribe((Response: any) => {

          if (Response.meta.code == 200) {
            this.submittedSupplierPurchaseData = false;
            this.defaultForm();
            this.ISEditSupplierPurchase = false;
            this.imageError = false;
            this.imgURL = '';
            this.router.navigate(['/admin/assets-management/supplier-purchase-master']);
            this.commonService.notifier.notify('success', "Supplier Purchase Master Saved Successfully");
          }
          else {
            this.commonService.notifier.notify('error', Response.meta.message);
          }
        })
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  editSupplierPurchase() {
    let Obj = {
      _id: this.supplierPurchaseId
    }
    this.assetsmanagementService.getSupplierPurchaseMasterId(Obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.ISEditSupplierPurchase = true;
        this.supplierPurchaseForm.controls._id.setValue(Response.data._id);
        this.supplierPurchaseForm.controls.supplierId.setValue(Response.data.supplierId);
        this.supplierPurchaseForm.controls.purchaseDate.setValue(new Date(Response.data.purchaseDate.split('/')[2] + '-' + Response.data.purchaseDate.split('/')[1] + '-' + Response.data.purchaseDate.split('/')[0]));
        this.supplierPurchaseForm.controls.InvoiceNumber.setValue(Response.data.InvoiceNumber);
        Response.data.purchaseItem.forEach((x: any) => {
          let purchaseData = {
            categoryId: x.categoryId,
            productName: x.productName,
            barcode: x.barcode,
            qunatity: x.qunatity,
            warrantyStartDate: new Date(x.warrantyStartDate.split('/')[2] + '-' + x.warrantyStartDate.split('/')[1] + '-' + x.warrantyStartDate.split('/')[0]),
            warrantyEndDate: new Date(x.warrantyEndDate.split('/')[2] + '-' + x.warrantyEndDate.split('/')[1] + '-' + x.warrantyEndDate.split('/')[0]),
            CGST: x.CGST,
            SGST: x.SGST,
            IGST: x.IGST,
            amount: x.amount,
          }
          this.purchaseList.push(this.createProductData(purchaseData));
        })
        this.file = Response.data.billImage;
        this.imgURL = environment.uploadsUrl + 'photos/' + Response.data.billImage;
      }
    })
  }

  updateSupplierPurchase() {

    if (this.supplierPurchaseForm.invalid) {
      this.submittedSupplierPurchaseData = true;
      if (!this.file || this.file == '') {
        this.imageError = true;
        return;
      }
      else {
        return;
      }
    }

    let purchaseItemData = [];
    this.supplierPurchaseForm.value.purchaseItem.forEach((x: any) => {
      let purchaseData = {
        categoryId: x.categoryId,
        productName: x.productName,
        barcode: x.barcode,
        qunatity: x.qunatity,
        warrantyStartDate: moment(x.warrantyStartDate).format('DD/MM/yyyy'),
        warrantyEndDate: moment(x.warrantyEndDate).format('DD/MM/yyyy'),
        CGST: x.CGST,
        SGST: x.SGST,
        IGST: x.IGST,
        amount: x.amount,
      }
      purchaseItemData.push(purchaseData);
    })

    let supplierPurchaseMasterModelObj = {
      _id: this.supplierPurchaseForm.value._id,
      supplierId: this.supplierPurchaseForm.value.supplierId,
      purchaseDate: this.supplierPurchaseForm.value.purchaseDate ? moment(this.supplierPurchaseForm.value.purchaseDate).format('DD/MM/yyy') : '',
      InvoiceNumber: this.supplierPurchaseForm.value.InvoiceNumber,
      purchaseItem: purchaseItemData,
    };


    this.assetsmanagementService.UpdateSupplierPurchaseMaster(supplierPurchaseMasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {

        let supplierPurchaseImage: FormData = new FormData();
        supplierPurchaseImage.append('_id', Response.data._id);
        supplierPurchaseImage.append('billImage', this.file);

        this.assetsmanagementService.SaveSupplierPurchaseBillImage(supplierPurchaseImage).subscribe((Response: any) => {

          if (Response.meta.code == 200) {
            this.submittedSupplierPurchaseData = false;
            this.defaultForm();
            this.ISEditSupplierPurchase = false;
            this.imageError = false;
            this.imgURL = '';
            this.router.navigate(['/admin/assets-management/supplier-purchase-master']);
            this.commonService.notifier.notify('success', "Supplier Purchase Master Updated Successfully.");
          }
          else {
            this.commonService.notifier.notify('error', Response.meta.message);
          }
        })
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }




}
