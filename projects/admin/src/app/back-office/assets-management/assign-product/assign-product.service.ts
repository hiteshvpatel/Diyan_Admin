import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { CommonService } from '../../../shared/common.service';

@Injectable({
  providedIn: 'root'
})
export class AssignProductService {

  environment: any;

  constructor(private commonService: CommonService, private http: HttpClient) { }

  assignProductToEmployees(data: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'product/assignAssets', data, { headers: headers });
  }
  removeProductToEmployees(data: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'product/removeassignAssets', data, { headers: headers });
  }

  getAssignedProductMasterList() {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'product/activeUserwiseListWithAssetProductDes', { headers: headers });
  }

  getCategoryMasterList() {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'categoryMaster/activeCategoryMasterList', { headers: headers });
  }

  getProductMasterList(categoryId) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'product/productGetBycategoryId', { params: categoryId, headers: headers });
  }

}
