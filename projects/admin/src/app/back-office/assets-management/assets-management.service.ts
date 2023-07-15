import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { CommonService } from '../../shared/common.service';

@Injectable({
  providedIn: 'root'
})
export class AssetsManagementService {

  environment: any;

  constructor(private commonService: CommonService, private http: HttpClient) { }

  // supplier master 
  SaveSupplierMaster(createroleMasterData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'supplierMaster/supplierMasterSave', createroleMasterData, { headers: headers });
  }

  getSupplierMaster() {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'supplierMaster/supplierList', { headers: headers });
  }

  getSupplierMasterId(params: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'supplierMaster/supplierDetailsById', { params: params, headers: headers });
  }

  UpdateSupplierMaster(updateroleMasterData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'supplierMaster/supplierMasterUpdate', updateroleMasterData, { headers: headers });
  }

  StatusSupplierMaster(updatestatusroleMasterData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'supplierMaster/supplierMasterActiveDeActive', updatestatusroleMasterData, { headers: headers });
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



  // category master
  SaveCategoryMaster(createuserMasterData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'categoryMaster/categoryMasterSave', createuserMasterData, { headers: headers });
  }

  UpdateCategoryMaster(updateuserMasterData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'categoryMaster/categoryMasterUpdate', updateuserMasterData, { headers: headers });
  }
  getCategoryMaster() {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'categoryMaster/categoryList', { headers: headers });
  }
  getcategoryMasterId(params: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'categoryMaster/categoryDetailsById', { params: params, headers: headers });
  }
  StatusCategoryMaster(updatestatusroleMasterData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'categoryMaster/categoryMasterActiveDeActive', updatestatusroleMasterData, { headers: headers });
  }


  // product master
  getSupplierMasterActiveList() {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'supplierMaster/activeSupplierMasterList', { headers: headers });
  }

  getCategoryMasterActiveList() {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'categoryMaster/activeCategoryMasterList', { headers: headers });
  }
  getCloneProductListByCategoryId(data: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'product/categoryIdWiseActiveProductList', { params: data, headers: headers });
  }
  getCloneProductList(data: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'product/cloneProductList', { params: data, headers: headers });
  }

  SaveProductMaster(createuserMasterData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'product/productCreate', createuserMasterData, { headers: headers });
  }

  UpdateProductMaster(updateuserMasterData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'product/updateProduct', updateuserMasterData, { headers: headers });
  }
  getProductMaster() {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'product/getProductList', { headers: headers });
  }
  getProductMasterId(params: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'product/productGetById', { params: params, headers: headers });
  }
  StatusProductMaster(updatestatusroleMasterData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'product/productActiveDeactive', updatestatusroleMasterData, { headers: headers });
  }

  // supplier purchaase master
  SaveSupplierPurchaseMaster(createSupplierPurchaseData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'supplierPurchase/Save-supplierPurchaseMaster', createSupplierPurchaseData, { headers: headers });
  }
  SaveSupplierPurchaseBillImage(createSupplierPurchaseData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'supplierPurchase/supplierPurchaseMasterSaveBillImage', createSupplierPurchaseData, { headers: headers });
  }
  getSupplierPurchaseMaster() {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'supplierPurchase/supplierPurchaseMasterList', { headers: headers });
  }

  getSupplierPurchaseMasterId(params: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'supplierPurchase/supplierPurchaseById', { params: params, headers: headers });
  }
  UpdateSupplierPurchaseMaster(createSupplierPurchaseData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'supplierPurchase/SupplierPurchaseMasterUpdate', createSupplierPurchaseData, { headers: headers });
  }

  getAssetsProductHistoryList(data: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'adminSide/getassetHistorylistforAdmin', { params: data, headers: headers });
  }

}
