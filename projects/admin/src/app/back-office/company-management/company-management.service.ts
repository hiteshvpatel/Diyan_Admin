import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { CommonService } from '../../shared/common.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyManagementService {

  environment: any;

  constructor(private commonService: CommonService, private http: HttpClient) { }

  SaveCompanyInformationData(companyInformationObj: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'companyDocumentType/companyMasterSave', companyInformationObj, { headers: headers });
  }
  UpdateCompanyInformationData(companyInformationObj: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'companyDocumentType/companyMasterUpdate', companyInformationObj, { headers: headers });
  }
  getCompanyDetailsByID(documentUploadByID: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'companyDocumentType/companyDetailsById', { params: documentUploadByID, headers: headers });
  }
  getCompanyDetailsList() {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'companyDocumentType/companyMasterList', { headers: headers });
  }
  StatusCompanyMaster(companyMasterData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'companyDocumentType/companyMasterActiveDeActive', companyMasterData, { headers: headers });
  }


  getCountryMasterList() {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'supplierMaster/countryList', { headers: headers });
  }
  getStateMasterListByCountryID(countryId) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'supplierMaster/stateListByCountryId', { params: countryId, headers: headers });
  }
  getCityMasterListByStateID(stateId) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'supplierMaster/cityistByCityId', { params: stateId, headers: headers });
  }


  // document Master
  SavedocumentMaster(createroleMasterData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'companyDocumentType/companyDocumentTypeSave', createroleMasterData, { headers: headers });
  }

  getdocumentMaster() {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'companyDocumentType/companyDocumentTypeList', { headers: headers });
  }

  getdocumentMasterId(params: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'companyDocumentType/companyDocumentTypeById', { params: params, headers: headers });
  }

  UpdatedocumentMaster(updateroleMasterData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'companyDocumentType/companyDocumentTypeUpdate', updateroleMasterData, { headers: headers });
  }

  StatusdocumentMaster(updatestatusroleMasterData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'companyDocumentType/companyDocumentTypeActiveDeActive', updatestatusroleMasterData, { headers: headers });
  }

  // document master
  getDocumentMasterActiveList() {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'companyDocumentType/activecompanyDocumentTypeList', { headers: headers });
  }
  SavedocumentMasterDetails(saveDocumentMasterData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'companyDocumentMaster/companydocumentMasterSave', saveDocumentMasterData, { headers: headers });
  }
  updateDocumentMasterDetails(updateDocumentMasterData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'companyDocumentMaster/companyDocumentMasterUpdate', updateDocumentMasterData, { headers: headers });
  }
  getDocumentMasterByID(documentUploadByID: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'companyDocumentMaster/companydocumentMasterById', { params: documentUploadByID, headers: headers });
  }
  getDocumentMasterList(companyId: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'companyDocumentMaster/companyDocumentMasterBycompanyId', { params: companyId, headers: headers });
  }

  // bank details
  SaveBankDetails(saveDocumentMasterData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'companyBankDetails/companyBankDetailsSave', saveDocumentMasterData, { headers: headers });
  }
  updateBankDetails(updateDocumentMasterData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'companyBankDetails/companybankDetailsUpdate', updateDocumentMasterData, { headers: headers });
  }
  getBankDetailsByID(documentUploadByID: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'companyBankDetails/companyBankDetailsById', { params: documentUploadByID, headers: headers });
  }
  getBankDeleteDetailsByID(documentUploadByID: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'companyBankDetails/deleteCompanyBankDetails', { params: documentUploadByID, headers: headers });
  }
  getBankDetailsList(companyId: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'companyBankDetails/companybankDetailsBycompanyId', { params: companyId, headers: headers });
  }


  // template master
  SaveTempleteMaster(createTemplete: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'TemplateMaster/templateMasterSave', createTemplete, { headers: headers });
  }
  getTempleteList() {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'TemplateMaster/templateList', { headers: headers });
  }
  UpdateTempleteMaster(createTemplete: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'TemplateMaster/templateDetailsUpdate', createTemplete, { headers: headers });
  }
  getTempleteListById(templeteId: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'TemplateMaster/templateById', { params: templeteId, headers: headers });
  }


  // generate invoice 
  getCompanyActiveList() {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'BillMaster/companyActiveDataList', { headers: headers });
  }
  getTempleteActiveList() {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'BillMaster/templateActiveDataList', { headers: headers });
  }
  getCurrencyActiveList() {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'BillMaster/currencyActiveDataList', { headers: headers });
  }
  getClientActiveList() {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'BillMaster/clientActiveDataList', { headers: headers });
  }
  getClientActiveByListByComapany(params: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'clientMaster/clientListCompanyWise', { params: params, headers: headers });
  }
  getFinancialActiveList() {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'BillMaster/finacialActiveDataList', { headers: headers });
  }
  SaveCreatedInvoiceData(invoiceInformation: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'BillMaster/billMasterSave', invoiceInformation, { headers: headers });
  }
  UpdateCreatedInvoiceData(invoiceInformation: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'BillMaster/billMasterUpdate', invoiceInformation, { headers: headers });
  }
  getInvoiceMasterList() {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'BillMaster/billMasterList', { headers: headers });
  }
  getInvoiceMasterListById(invoiceId: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'BillMaster/billMasterListById', { params: invoiceId, headers: headers });
  }
  invoiceDetailsPdfAdminSide(downloadInvoiceByID: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'BillMaster/invoiceDetailsPdfAdminSide', { params: downloadInvoiceByID, headers: headers });
  }


}

