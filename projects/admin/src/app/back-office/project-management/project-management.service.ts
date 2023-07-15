import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { CommonService } from '../../shared/common.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectManagementService {

  environment: any;

  constructor(private commonService: CommonService, private http: HttpClient) { }

  //Setting: Project Master

  SaveProjectMaster(createroleMasterData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'projectMaster/ProjectMasterDataSave', createroleMasterData, { headers: headers });
  }

  UpdateProjectMaster(updateroleMasterData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'projectMaster/ProjectMasterDataUpdate', updateroleMasterData, { headers: headers });
  }

  getProjectId(params: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'projectMaster/ProjectMasterDataByProjectId', { params: params, headers: headers });
  }

  getProjectMaster() {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'projectMaster/ProjectMasterDataList', { headers: headers });
  }

  StatusProjectMaster(updatestatusroleMasterData: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'projectMaster/projectMasterDataActiveDeActive', updatestatusroleMasterData, { headers: headers });
  }

  getProjectDocument(projectId: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'adminSide/documentDetailsList', { params: projectId, headers: headers });
  }

  saveProjectDocumentUploadData(emergencyContactInfo: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'projectMaster/ProjecDocumentDetailsSave', emergencyContactInfo, { headers: headers });
  }

  getProjectDocumentUploadList(employeeId: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'projectMaster/ProjecDocumentDetailsDataActiveList', { params: employeeId, headers: headers });
  }

  getProjectDocumentUploadById(params: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'projectMaster/ProjecDocumentDetailsById', { params: params, headers: headers });
  }

  deleteProjectDocumentDetailsById(deleteId: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'projectMaster/ProjecDocumentdelete', { params: deleteId, headers: headers });
  }

  UpdateProjectDocumentUploadData(emergencyContactInfo: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'projectMaster/ProjecDocumentDetailsUpdate', emergencyContactInfo, { headers: headers });
  }

  // client master

  getClientMaster() {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'clientMaster/clientList', { headers: headers });
  }

  saveClientBasicInfoMaster(params: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'clientMaster/clientMasterSave', params, { headers: headers });
  }

  getClientMasterId(params: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'clientMaster/clientDetailsById', { params: params, headers: headers });
  }

  updateClientMasterId(params: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'clientMaster/clientMasterUpdate', params, { headers: headers });
  }

  Statusclient(params) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'clientMaster/clientMasterActiveDeActive', params, { headers: headers });
  }

  // client contact details
  getClientContaclList(params) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'clientContactDetails/clientContactDetailsList', { params: params, headers: headers });
  }

  saveClientContactInfoMaster(params: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'clientContactDetails/clientContactDetailsSave', params, { headers: headers });
  }

  getClientContactDetails(params: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'clientContactDetails/clientContactDetailsById', { params: params, headers: headers });
  }

  updateClientContact(params: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'clientContactDetails/clientContactDetailsUpdate', params, { headers: headers });
  }

  StatusclientContack(params) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'clientContactDetails/clientContactDetailsActiveDeActive', params, { headers: headers });
  }
  updateClientContactDefaultFlag(params: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'clientContactDetails/clientContactDetailsisDefaultUpdate', { params: params, headers: headers });
  }

  // for team assign

  getTeamAssignList(params) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'projectMaster/assignTeamListByProjectId', { params: params, headers: headers });
  }

  getEmployeeByDepartment(params) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'projectMaster/employeeListTechnologyId', { params: params, headers: headers });
  }

  saveTeamAssignData(emergencyContactInfo: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'projectMaster/teamAssign', emergencyContactInfo, { headers: headers });
  }

  getTeamById(params: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'projectMaster/assignTeamListById', { params: params, headers: headers });
  }

  updateTeamAssignData(params: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'projectMaster/assignTeamDataUpdate', params, { headers: headers });
  }

  allTeamAssignData(params: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'projectMaster/AllTeamAssignProjectId', params, { headers: headers });
  }
  uploadScreenshots(params: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'projectMaster/projectScreenShotSave', params, { headers: headers });
  }
  screenshotListData(params: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'projectMaster/projectScreenShotListByProjectId', { params: params, headers: headers });
  }
  deleteScreenShotData(params: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'projectMaster/deleteProjectScreenShot', params, { headers: headers });
  }

  removeTeamAssign(params: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'projectMaster/removeTeamAssign', params, { headers: headers });
  }

  getInvoiceMasterListByClientId(params: any) {
    let LoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${LoginUserData.myToken}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'BillMaster/billMasterByClientId', { params: params, headers: headers });
  }
}

