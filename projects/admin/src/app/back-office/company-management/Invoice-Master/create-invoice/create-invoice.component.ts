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
import { CurrencyLists } from '../../../project-management/currency';


@Component({
    selector: 'app-create-invoice',
    templateUrl: './create-invoice.component.html',
    styleUrls: ['./create-invoice.component.scss']
})
export class CreateInvoiceComponent implements OnInit {


    invoiceGenerateForm: FormGroup;
    noData: boolean;
    companyActiveDataList: any[] = [];
    templeteActiveDataList: any[] = [];
    currencyActiveDataList: any[] = [];
    clientActiveDataList: any[] = [];
    financialActiveDataList: any[] = [];

    get fInvoiceData() { return this.invoiceGenerateForm.controls; }
    submittedInvoiceData = false;

    CurrencyName = Object.keys(CurrencyLists);

    itemName: boolean = false;
    amount: boolean = false;
    discount: boolean = false;
    cgst: boolean = false;
    sgst: boolean = false;
    igst: boolean = false;
    quantity: boolean = false;
    hours: boolean = false;
    rate: boolean = false;
    hsnCode: boolean = false;
    description: boolean = false;
    templeteList: any;
    invoiceId: any;
    addGenerateInvoice: boolean = false;

    constructor(private http: HttpClient, private fb: FormBuilder, public companyManagementService: CompanyManagementService, public storageService: StorageService, private coreHelper: CoreHelperService, private route: ActivatedRoute, private router: Router, public commonService: CommonService, public adminLayoutService: AdminLayoutService) {
        const currentUrl = this.router.url
        if (currentUrl.includes('generate-invoice')) {
            this.addGenerateInvoice = false;
        }
        else if (currentUrl.includes('edit-generated-invoice')) {
            this.route.params.subscribe((params: Params) => {
                this.invoiceId = params.id;
                this.addGenerateInvoice = true;
                this.editInvoiceData();
            });
        }
    }

    ngOnInit() {
        // console.log(this.CurrencyName);

        this.getCompanyActiveList();
        this.getTempleteActiveList();
        this.getCurrencyActiveList();
        this.getClientActiveList();
        this.getFinancialActiveList();
        this.defaultForm();
        this.templeteList = this.invoiceGenerateForm.get('billItem') as FormArray;
    }

    defaultForm() {
        this.invoiceGenerateForm = this.fb.group({
            companyId: [, [Validators.required]],
            billDate: ['', [Validators.required]],
            billNo: [''],
            isInternational: ["false"],
            templateId: [, [Validators.required]],
            currencyName: [, [Validators.required]],
            clientId: [, [Validators.required]],
            finacialYearId: [, [Validators.required]],
            finalAmount: ['', [Validators.required]],
            billItem: this.fb.array([]),
            _id: [''],
        })
    }

    createTempleteItem(oItem?: object): FormGroup {
        return this.fb.group({
            itemName: [(oItem['itemName'] ? oItem['itemName'] : ''),],
            amount: [(oItem['amount'] ? oItem['amount'] : ''),],
            discount: [(oItem['discount'] ? oItem['discount'] : ''),],
            cgst: [(oItem['cgst'] ? oItem['cgst'] : ''),],
            cgstAmount: [(oItem['cgstAmount'] ? oItem['cgstAmount'] : 0),],
            sgst: [(oItem['sgst'] ? oItem['sgst'] : ''),],
            sgstAmount: [(oItem['sgstAmount'] ? oItem['sgstAmount'] : 0),],
            igst: [(oItem['igst'] ? oItem['igst'] : ''),],
            igstAmount: [(oItem['igstAmount'] ? oItem['igstAmount'] : 0),],
            description: [(oItem['description'] ? oItem['description'] : ''),],
            hsnCode: [(oItem['hsnCode'] ? oItem['hsnCode'] : ''),],
            hours: [(oItem['hours'] ? oItem['hours'] : ''),],
            rate: [(oItem['rate'] ? oItem['rate'] : ''),],
            quantity: [(oItem['quantity'] ? oItem['quantity'] : ''),],
            subTotal: [(oItem['subTotal'] ? oItem['subTotal'] : ''),],
        });
    }

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
    numberDecimalOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode != 46)) {
            return false;
        }
        return true;
    }

    addTempleteItem(): void {

        this.templeteList.push(this.createTempleteItem({}));

        for (let i = 0; i < this.templeteList.length; i++) {
            var billItem = (this.invoiceGenerateForm.get('billItem') as FormArray).at(i) as FormGroup;

            if (this.itemName == true) {
                billItem.get('itemName').setValidators([Validators.required]);
            }
            else {
                billItem.get('itemName').clearValidators();
            }
            if (this.amount == true) {
                billItem.get('amount').setValidators([Validators.required]);
            }
            else {
                billItem.get('amount').clearValidators();
            }
            if (this.discount == true) {
                billItem.get('discount').setValidators([Validators.required]);
            }
            else {
                billItem.get('discount').clearValidators();
            }
            if (this.cgst == true) {
                billItem.get('cgst').setValidators([Validators.required]);
            }
            else {
                billItem.get('cgst').clearValidators();
            }
            if (this.sgst == true) {
                billItem.get('sgst').setValidators([Validators.required]);
            }
            else {
                billItem.get('sgst').clearValidators();
            }
            if (this.igst == true) {
                billItem.get('igst').setValidators([Validators.required]);
            }
            else {
                billItem.get('igst').clearValidators();
            }
            if (this.description == true) {
                billItem.get('description').setValidators([Validators.required]);
            }
            else {
                billItem.get('description').clearValidators();
            }
            if (this.hsnCode == true) {
                billItem.get('hsnCode').setValidators([Validators.required]);
            }
            else {
                billItem.get('hsnCode').clearValidators();
            }
            if (this.hours == true) {
                billItem.get('hours').setValidators([Validators.required]);
            }
            else {
                billItem.get('hours').clearValidators();
            }
            if (this.rate == true) {
                billItem.get('rate').setValidators([Validators.required]);
            }
            else {
                billItem.get('rate').clearValidators();
            }
            if (this.quantity == true) {
                billItem.get('quantity').setValidators([Validators.required]);
            }
            else {
                billItem.get('quantity').clearValidators();
            }
        }

    }
    removeTempleteItem(index): void {

        if (this.templeteList.controls.length == 1) {
            this.invoiceGenerateForm.controls.templateId.setValue(null);
            this.itemName = false;
            this.amount = false;
            this.discount = false;
            this.cgst = false;
            this.sgst = false;
            this.igst = false;
            this.quantity = false;
            this.hours = false;
            this.rate = false;
            this.hsnCode = false;
            this.description = false;
        }
        else {
            this.templeteList.removeAt(index);
            this.quantityChange(index)
        }

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
    getTempleteActiveList() {
        this.templeteActiveDataList = [];

        this.companyManagementService.getTempleteActiveList().subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                this.templeteActiveDataList = Response.data;
            }
            //for select sub industry step
        }, (error) => {
            console.log(error.error.Message);
        });
    }
    getCurrencyActiveList() {
        this.currencyActiveDataList = [];

        this.companyManagementService.getCurrencyActiveList().subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                this.currencyActiveDataList = Response.data;
            }
            //for select sub industry step
        }, (error) => {
            console.log(error.error.Message);
        });
    }
    getClientActiveList() {
        this.clientActiveDataList = [];

        this.companyManagementService.getClientActiveList().subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                this.clientActiveDataList = Response.data;
            }
            //for select sub industry step
        }, (error) => {
            console.log(error.error.Message);
        });
    }
    // onCompanyChange() {
    //     this.clientActiveDataList = [];
    //     this.invoiceGenerateForm.controls.clientId.setValue(null);
    //     let params = {
    //         companyId: this.invoiceGenerateForm.controls.companyId.value
    //     }
    //     this.companyManagementService.getClientActiveByListByComapany(params).subscribe((Response: any) => {

    //         if (Response.meta.code == 200) {
    //             this.clientActiveDataList = Response.data;
    //         }
    //         //for select sub industry step
    //     }, (error) => {
    //         console.log(error.error.Message);
    //     });
    // }

    getFinancialActiveList() {
        this.financialActiveDataList = [];

        this.companyManagementService.getFinancialActiveList().subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                this.financialActiveDataList = Response.data;
            }
            //for select sub industry step
        }, (error) => {
            console.log(error.error.Message);
        });
    }

    onTempleteChange(event, onEdit) {
        // this.defaultForm();
        this.invoiceGenerateForm.controls.finalAmount.setValue(0);
        this.templeteList.clear();
        this.itemName = false;
        this.amount = false;
        this.discount = false;
        this.cgst = false;
        this.sgst = false;
        this.igst = false;
        this.quantity = false;
        this.hours = false;
        this.rate = false;
        this.hsnCode = false;
        this.description = false;
        if (event != null || !!event) {
            let Obj = {
                _id: this.invoiceGenerateForm.value.templateId
            }
            this.companyManagementService.getTempleteListById(Obj).subscribe((Response: any) => {
                if (Response.meta.code == 200) {
                    if (onEdit === false) {
                        this.templeteList.push(this.createTempleteItem({}));
                    }
                    this.itemName = Response.data.itemName;
                    this.amount = Response.data.amount;
                    this.discount = Response.data.discount;
                    this.cgst = Response.data.CGST;
                    this.sgst = Response.data.SGST;
                    this.igst = Response.data.IGST;
                    this.description = Response.data.description;
                    this.hsnCode = Response.data.HSNCode;
                    this.hours = Response.data.hours;
                    this.rate = Response.data.rate;
                    this.quantity = Response.data.quantity;

                    for (let i = 0; i < this.templeteList.length; i++) {
                        var billItem = (this.invoiceGenerateForm.get('billItem') as FormArray).at(i) as FormGroup;

                        if (this.itemName == true) {
                            billItem.get('itemName').setValidators([Validators.required]);
                        }
                        else {
                            billItem.get('itemName').clearValidators();
                        }
                        if (this.amount == true) {
                            billItem.get('amount').setValidators([Validators.required]);
                        }
                        else {
                            billItem.get('amount').clearValidators();
                        }
                        if (this.discount == true) {
                            billItem.get('discount').setValidators([Validators.required]);
                        }
                        else {
                            billItem.get('discount').clearValidators();
                        }
                        if (this.cgst == true) {
                            billItem.get('cgst').setValidators([Validators.required]);
                        }
                        else {
                            billItem.get('cgst').clearValidators();
                        }
                        if (this.sgst == true) {
                            billItem.get('sgst').setValidators([Validators.required]);
                        }
                        else {
                            billItem.get('sgst').clearValidators();
                        }
                        if (this.igst == true) {
                            billItem.get('igst').setValidators([Validators.required]);
                        }
                        else {
                            billItem.get('igst').clearValidators();
                        }
                        if (this.description == true) {
                            billItem.get('description').setValidators([Validators.required]);
                        }
                        else {
                            billItem.get('description').clearValidators();
                        }
                        if (this.hsnCode == true) {
                            billItem.get('hsnCode').setValidators([Validators.required]);
                        }
                        else {
                            billItem.get('hsnCode').clearValidators();
                        }
                        if (this.hours == true) {
                            billItem.get('hours').setValidators([Validators.required]);
                        }
                        else {
                            billItem.get('hours').clearValidators();
                        }
                        if (this.rate == true) {
                            billItem.get('rate').setValidators([Validators.required]);
                        }
                        else {
                            billItem.get('rate').clearValidators();
                        }
                        if (this.quantity == true) {
                            billItem.get('quantity').setValidators([Validators.required]);
                        }
                        else {
                            billItem.get('quantity').clearValidators();
                        }
                    }
                }
            });
        }
        else {
            this.itemName = false;
            this.amount = false;
            this.discount = false;
            this.cgst = false;
            this.sgst = false;
            this.igst = false;
            this.quantity = false;
            this.hours = false;
            this.rate = false;
            this.hsnCode = false;
            this.description = false;
        }
    }


    quantityChange(index) {

        let subTotalQunHourRate: any;
        var billItem = (this.invoiceGenerateForm.get('billItem') as FormArray).at(index) as FormGroup;
        // if (!!this.invoiceGenerateForm.value.billItem[index].quantity) {

        //     if (!!this.invoiceGenerateForm.value.billItem[index].rate) {

        //         subTotalQunHourRate = parseInt(this.invoiceGenerateForm.value.billItem[index].quantity) * parseInt(this.invoiceGenerateForm.value.billItem[index].rate);
        //         if (!!this.invoiceGenerateForm.value.billItem[index].discount) {
        //             let discountAmount = (subTotalQunHourRate / 100) * parseFloat(this.invoiceGenerateForm.value.billItem[index].discount);
        //             subTotalQunHourRate = subTotalQunHourRate - discountAmount;
        //         }

        //         if (!!this.invoiceGenerateForm.value.billItem[index].cgst) {
        //             var cgstAmount = (subTotalQunHourRate / 100) * parseFloat(this.invoiceGenerateForm.value.billItem[index].cgst);
        //             billItem.get('cgstAmount').setValue(cgstAmount.toFixed(2));
        //         }
        //         else {
        //             // this.cgstAmount[index] = 0;
        //             billItem.get('cgstAmount').setValue(0);
        //         }

        //         if (!!this.invoiceGenerateForm.value.billItem[index].sgst) {
        //             var sgstAmount = (subTotalQunHourRate / 100) * parseFloat(this.invoiceGenerateForm.value.billItem[index].sgst);
        //             billItem.get('sgstAmount').setValue(sgstAmount.toFixed(2));
        //         }
        //         else {
        //             // this.sgstAmount[index] = 0;
        //             billItem.get('sgstAmount').setValue(0);
        //         }

        //         if (!!this.invoiceGenerateForm.value.billItem[index].igst) {
        //             var igstAmount = (subTotalQunHourRate / 100) * parseFloat(this.invoiceGenerateForm.value.billItem[index].igst);
        //             billItem.get('igstAmount').setValue(igstAmount.toFixed(2));
        //         }
        //         else {
        //             // this.igstAmount[index] = 0;
        //             billItem.get('igstAmount').setValue(0);
        //         }

        //         if (!!this.invoiceGenerateForm.value.billItem[index].quantity && !!this.invoiceGenerateForm.value.billItem[index].rate && ((!!this.invoiceGenerateForm.value.billItem[index].cgst && !!this.invoiceGenerateForm.value.billItem[index].sgst) || !!this.invoiceGenerateForm.value.billItem[index].igst)) {
        //             var subTotalAmount = subTotalQunHourRate + parseFloat(this.invoiceGenerateForm.value.billItem[index].cgstAmount) + parseFloat(this.invoiceGenerateForm.value.billItem[index].sgstAmount) + parseFloat(this.invoiceGenerateForm.value.billItem[index].igstAmount);
        //             billItem.get('subTotal').setValue(subTotalAmount);

        //             this.invoiceGenerateForm.controls.finalAmount.setValue(0);
        //             for (let x = 0; x <= this.templeteList.length; x++) {
        //                 let finalAmount = this.invoiceGenerateForm.value.finalAmount + this.invoiceGenerateForm.value.billItem[x].subTotal;
        //                 this.invoiceGenerateForm.controls.finalAmount.setValue(finalAmount);
        //             }

        //         }

        //     }
        //     else {
        //         billItem.get('rate').setValue('');
        //         billItem.get('subTotal').setValue('');
        //         billItem.get('cgstAmount').setValue(0);
        //         billItem.get('sgstAmount').setValue(0);
        //         billItem.get('igstAmount').setValue(0);
        //         this.invoiceGenerateForm.controls.finalAmount.setValue(0);
        //         for (let x = 0; x <= this.templeteList.length; x++) {
        //             let finalAmount = this.invoiceGenerateForm.value.finalAmount + this.invoiceGenerateForm.value.billItem[x].subTotal;
        //             this.invoiceGenerateForm.controls.finalAmount.setValue(finalAmount);
        //         }
        //     }
        // }
        // else if (!!this.invoiceGenerateForm.value.billItem[index].hours) {
        //     if (!!this.invoiceGenerateForm.value.billItem[index].rate) {
        //         subTotalQunHourRate = parseInt(this.invoiceGenerateForm.value.billItem[index].hours) * parseInt(this.invoiceGenerateForm.value.billItem[index].rate);
        //         if (!!this.invoiceGenerateForm.value.billItem[index].discount) {
        //             let discountAmount = (subTotalQunHourRate / 100) * parseFloat(this.invoiceGenerateForm.value.billItem[index].discount);
        //             subTotalQunHourRate = subTotalQunHourRate - discountAmount;
        //         }

        //         if (!!this.invoiceGenerateForm.value.billItem[index].cgst) {
        //             var cgstAmount = (subTotalQunHourRate / 100) * parseFloat(this.invoiceGenerateForm.value.billItem[index].cgst);
        //             billItem.get('cgstAmount').setValue(cgstAmount.toFixed(2));
        //         }
        //         else {
        //             // this.cgstAmount[index] = 0;
        //             billItem.get('cgstAmount').setValue(0);
        //         }

        //         if (!!this.invoiceGenerateForm.value.billItem[index].sgst) {
        //             var sgstAmount = (subTotalQunHourRate / 100) * parseFloat(this.invoiceGenerateForm.value.billItem[index].sgst);
        //             billItem.get('sgstAmount').setValue(sgstAmount.toFixed(2));
        //         }
        //         else {
        //             // this.sgstAmount[index] = 0;
        //             billItem.get('sgstAmount').setValue(0);
        //         }

        //         if (!!this.invoiceGenerateForm.value.billItem[index].igst) {
        //             var igstAmount = (subTotalQunHourRate / 100) * parseFloat(this.invoiceGenerateForm.value.billItem[index].igst);
        //             billItem.get('igstAmount').setValue(igstAmount.toFixed(2));
        //         }
        //         else {
        //             // this.igstAmount[index] = 0;
        //             billItem.get('igstAmount').setValue(0);
        //         }

        //         if (!!this.invoiceGenerateForm.value.billItem[index].hours && !!this.invoiceGenerateForm.value.billItem[index].rate) {

        //             if (((!!this.invoiceGenerateForm.value.billItem[index].cgst && !!this.invoiceGenerateForm.value.billItem[index].sgst) || !!this.invoiceGenerateForm.value.billItem[index].igst)) {
        //                 var subTotalAmount = subTotalQunHourRate + parseFloat(this.invoiceGenerateForm.value.billItem[index].cgstAmount) + parseFloat(this.invoiceGenerateForm.value.billItem[index].sgstAmount) + parseFloat(this.invoiceGenerateForm.value.billItem[index].igstAmount);
        //                 billItem.get('subTotal').setValue(subTotalAmount);

        //                 this.invoiceGenerateForm.controls.finalAmount.setValue(0);
        //                 for (let x = 0; x <= this.templeteList.length; x++) {
        //                     let finalAmount = this.invoiceGenerateForm.value.finalAmount + this.invoiceGenerateForm.value.billItem[x].subTotal;
        //                     this.invoiceGenerateForm.controls.finalAmount.setValue(finalAmount);
        //                 }
        //             }
        //             else {
        //                 var subTotalAmount = subTotalQunHourRate;
        //                 billItem.get('subTotal').setValue(subTotalAmount);

        //                 this.invoiceGenerateForm.controls.finalAmount.setValue(0);
        //                 for (let x = 0; x <= this.templeteList.length; x++) {
        //                     let finalAmount = this.invoiceGenerateForm.value.finalAmount + this.invoiceGenerateForm.value.billItem[x].subTotal;
        //                     this.invoiceGenerateForm.controls.finalAmount.setValue(finalAmount);
        //                 }
        //             }

        //         }

        //     }
        //     else {
        //         billItem.get('rate').setValue('');
        //         billItem.get('subTotal').setValue('');
        //         billItem.get('cgstAmount').setValue(0);
        //         billItem.get('sgstAmount').setValue(0);
        //         billItem.get('igstAmount').setValue(0);
        //         this.invoiceGenerateForm.controls.finalAmount.setValue(0);
        //         for (let x = 0; x <= this.templeteList.length; x++) {
        //             let finalAmount = this.invoiceGenerateForm.value.finalAmount + this.invoiceGenerateForm.value.billItem[x].subTotal;
        //             this.invoiceGenerateForm.controls.finalAmount.setValue(finalAmount);
        //         }
        //     }

        // }
        // else {
        //     billItem.get('quantity').setValue('');
        //     // billItem.get('rate').setValue('');
        //     billItem.get('subTotal').setValue('');
        //     billItem.get('cgstAmount').setValue(0);
        //     billItem.get('sgstAmount').setValue(0);
        //     billItem.get('igstAmount').setValue(0);
        // }

        let quantityValue;
        let hoursValue;
        let rateValue;
        if (!!billItem.value.quantity) {
            quantityValue = parseInt(billItem.value.quantity)
        }
        else {
            quantityValue = 1;
        }
        if (!!billItem.value.hours) {
            hoursValue = parseInt(billItem.value.hours)
        }
        else {
            hoursValue = 1;
        }
        if (!!billItem.value.rate) {
            rateValue = parseInt(billItem.value.rate)
        }
        else {
            rateValue = 1;
        }

        let subRateAmount = quantityValue * hoursValue * rateValue;

        let rateAmount;
        let discountAmount;
        if (!!billItem.value.discount) {
            discountAmount = (subRateAmount / 100) * parseInt(billItem.value.discount);
            rateAmount = subRateAmount - discountAmount
        }
        else {
            rateAmount = subRateAmount
        }

        let cgstAmount;
        let sgstAmount;
        let igstAmount;
        if (!!billItem.value.cgst) {
            cgstAmount = (rateAmount / 100) * parseInt(billItem.value.cgst);
            billItem.get('cgstAmount').setValue(cgstAmount.toFixed(2));
        }
        else {
            cgstAmount = 0;
            billItem.get('cgstAmount').setValue(0);
        }
        if (!!billItem.value.sgst) {
            sgstAmount = (rateAmount / 100) * parseInt(billItem.value.sgst);
            billItem.get('sgstAmount').setValue(sgstAmount.toFixed(2));
        }
        else {
            sgstAmount = 0;
            billItem.get('sgstAmount').setValue(0);
        }
        if (!!billItem.value.igst) {
            igstAmount = (rateAmount / 100) * parseInt(billItem.value.igst);
            billItem.get('igstAmount').setValue(igstAmount.toFixed(2));
        }
        else {
            igstAmount = 0;
            billItem.get('igstAmount').setValue(0);
        }

        let subTotal = rateAmount + cgstAmount + sgstAmount + igstAmount
        billItem.get('subTotal').setValue(subTotal);



        this.invoiceGenerateForm.controls.finalAmount.setValue(0);
        for (let x = 0; x <= this.templeteList.length; x++) {
            let finalAmount = this.invoiceGenerateForm.value.finalAmount + this.invoiceGenerateForm.value.billItem[x].subTotal;
            this.invoiceGenerateForm.controls.finalAmount.setValue(finalAmount);
        }


    }

    editInvoiceData() {
        let obj = {
            _id: this.invoiceId
        }
        this.companyManagementService.getInvoiceMasterListById(obj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {
                this.invoiceGenerateForm.controls.billDate.setValue(new Date(Res.data.billDate.split('/')[2] + '-' + Res.data.billDate.split('/')[1] + '-' + Res.data.billDate.split('/')[0]));
                this.invoiceGenerateForm.controls._id.setValue(Res.data._id);
                this.invoiceGenerateForm.controls.companyId.setValue(Res.data.companyId);
                this.invoiceGenerateForm.controls.billNo.setValue(Res.data.billNo);

                this.invoiceGenerateForm.controls.templateId.setValue(Res.data.templateId);
                this.onTempleteChange(Res.data.templateId, true);

                this.invoiceGenerateForm.controls.currencyName.setValue(Res.data.currencyName);
                this.invoiceGenerateForm.controls.finacialYearId.setValue(Res.data.finacialYearId);
                this.invoiceGenerateForm.controls.finalAmount.setValue(Res.data.finalAmount);
                this.invoiceGenerateForm.controls.finacialYearId.setValue(Res.data.finacialYearId);
                this.invoiceGenerateForm.controls.isInternational.setValue(Res.data.isInternational.toString());
                // this.onCompanyChange()
                this.invoiceGenerateForm.controls.clientId.setValue(Res.data.clientId);
                Res.data.billItem.forEach((x: any) => {
                    this.templeteList.push(this.createTempleteItem(x));
                });
            }
        })
    }


    saveCreatedInvoice() {
        if (this.invoiceGenerateForm.invalid) {
            this.submittedInvoiceData = true;
            return
        }

        if (this.invoiceGenerateForm.value.isInternational === "false") {
            this.invoiceGenerateForm.controls.isInternational.setValue(false);
        }
        else if (this.invoiceGenerateForm.value.isInternational === "true") {
            this.invoiceGenerateForm.controls.isInternational.setValue(true);
        }

        let obj = {
            companyId: this.invoiceGenerateForm.value.companyId,
            billDate: moment(this.invoiceGenerateForm.value.billDate).format('DD/MM/yyyy'),
            billNo: this.invoiceGenerateForm.value.billNo,
            templateId: this.invoiceGenerateForm.value.templateId,
            currencyName: this.invoiceGenerateForm.value.currencyName,
            clientId: this.invoiceGenerateForm.value.clientId,
            finacialYearId: this.invoiceGenerateForm.value.finacialYearId,
            finalAmount: this.invoiceGenerateForm.value.finalAmount,
            billItem: this.invoiceGenerateForm.value.billItem,
            isInternational: this.invoiceGenerateForm.value.isInternational
        }

        this.companyManagementService.SaveCreatedInvoiceData(obj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {
                this.defaultForm();
                this.router.navigate(['admin/company-management/invoice-list']);
                this.commonService.notifier.notify('success', "Invoice Saved Successfully.");
            }
        })



    }
    updateCreatedInvoice() {
        if (this.invoiceGenerateForm.invalid) {
            return
        }

        if (this.invoiceGenerateForm.value.isInternational === "false") {
            this.invoiceGenerateForm.controls.isInternational.setValue(false);
        }
        else if (this.invoiceGenerateForm.value.isInternational === "true") {
            this.invoiceGenerateForm.controls.isInternational.setValue(true);
        }

        let obj = {
            _id: this.invoiceGenerateForm.value._id,
            companyId: this.invoiceGenerateForm.value.companyId,
            billDate: moment(this.invoiceGenerateForm.value.billDate).format('DD/MM/yyyy'),
            billNo: this.invoiceGenerateForm.value.billNo,
            templateId: this.invoiceGenerateForm.value.templateId,
            currencyName: this.invoiceGenerateForm.value.currencyName,
            clientId: this.invoiceGenerateForm.value.clientId,
            finacialYearId: this.invoiceGenerateForm.value.finacialYearId,
            finalAmount: this.invoiceGenerateForm.value.finalAmount,
            billItem: this.invoiceGenerateForm.value.billItem,
            isInternational: this.invoiceGenerateForm.value.isInternational
        }

        this.companyManagementService.UpdateCreatedInvoiceData(obj).subscribe((Res: any) => {
            if (Res.meta.code == 200) {
                this.defaultForm();
                this.router.navigate(['admin/company-management/invoice-list']);
                this.commonService.notifier.notify('success', "Invoice Updated Successfully.");
            }
        })



    }




}
