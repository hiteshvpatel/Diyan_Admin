import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { CommonService } from '../../shared/common.service';

@Injectable({
    providedIn: 'root'
})
export class AccountManagementService {

    environment: any;

    constructor(private commonService: CommonService, private http: HttpClient) { }

    // group master
    SaveGroupMaster(groupMasterData: any) {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.post(this.commonService.rootData.rootUrl + 'groupMaster/groupMasterCreate', groupMasterData, { headers: headers });
    }
    UpdateGroupMaster(groupMasterData: any) {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.post(this.commonService.rootData.rootUrl + 'groupMaster/groupMasterUpdate', groupMasterData, { headers: headers });
    }
    getGroupMasterDetailsByID(groupMasterId: any) {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.get(this.commonService.rootData.rootUrl + 'groupMaster/groupMasterDetailsById', { params: groupMasterId, headers: headers });
    }
    getGroupMasterDetailsList() {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.get(this.commonService.rootData.rootUrl + 'groupMaster/activeParentChildGroupMasterList', { headers: headers });
    }
    activeParentGroupList() {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.get(this.commonService.rootData.rootUrl + 'groupMaster/activeParentGroupMasterList', { headers: headers });
    }
    StatusGroupMaster(groupMasterData: any) {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.post(this.commonService.rootData.rootUrl + 'groupMaster/groupMasterActiveDeactive', groupMasterData, { headers: headers });
    }



    // Unit master
    SaveUnitMaster(unitMasterData: any) {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.post(this.commonService.rootData.rootUrl + 'unitMaster/unitMasterCreate', unitMasterData, { headers: headers });
    }
    UpdateUnitMaster(unitMasterData: any) {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.post(this.commonService.rootData.rootUrl + 'unitMaster/unitMasterUpdate', unitMasterData, { headers: headers });
    }
    getUnitMasterDetailsByID(unitMasterId: any) {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.get(this.commonService.rootData.rootUrl + 'unitMaster/unitMasterDetailsById', { params: unitMasterId, headers: headers });
    }
    getUnitMasterDetailsList() {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.get(this.commonService.rootData.rootUrl + 'unitMaster/unitMasterList', { headers: headers });
    }
    StatusUnitMaster(unitMasterData: any) {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.post(this.commonService.rootData.rootUrl + 'unitMaster/unitMasterActiveDeactive', unitMasterData, { headers: headers });
    }


    // Ledger master
    SaveLedgerMaster(ledgerMasterData: any) {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.post(this.commonService.rootData.rootUrl + 'ledgerMaster/ledgerMasterCreate', ledgerMasterData, { headers: headers });
    }
    UpdateLedgerMaster(ledgerMasterData: any) {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.post(this.commonService.rootData.rootUrl + 'ledgerMaster/ledgerMasterUpdate', ledgerMasterData, { headers: headers });
    }
    getLedgerMasterDetailsByID(ledgerMasterId: any) {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.get(this.commonService.rootData.rootUrl + 'ledgerMaster/ledgerMasterDetailsById', { params: ledgerMasterId, headers: headers });
    }
    getLedgerMasterDetailsList() {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.get(this.commonService.rootData.rootUrl + 'ledgerMaster/ledgerMasterList', { headers: headers });
    }
    StatusLedgerMaster(ledgerMasterData: any) {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.post(this.commonService.rootData.rootUrl + 'ledgerMaster/ledgerMasterActiveDeactive', ledgerMasterData, { headers: headers });
    }
    getGroupMasterActiveList() {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.get(this.commonService.rootData.rootUrl + 'groupMaster/activeGroupMasterList', { headers: headers });
    }
    getUnitMasterActiveList() {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.get(this.commonService.rootData.rootUrl + 'unitMaster/activeUnitMasterList', { headers: headers });
    }
    getLedgerMasterActiveList() {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.get(this.commonService.rootData.rootUrl + 'ledgerMaster/activeLedgerMasterList', { headers: headers });
    }


    // Account Entry master
    SaveAccountEntryMaster(accountEntryMasterData: any) {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.post(this.commonService.rootData.rootUrl + 'acountEntryMaster/AcountEntryMasterCreate', accountEntryMasterData, { headers: headers });
    }
    UpdateAccountEntryMaster(accountEntryMasterData: any) {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.post(this.commonService.rootData.rootUrl + 'acountEntryMaster/AcountEntryMasterUpdate', accountEntryMasterData, { headers: headers });
    }
    deleteAccountEntryMasterDetailsByID(accountEntryMasterId: any) {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.get(this.commonService.rootData.rootUrl + 'acountEntryMaster/deleteAcountEntryMaster', { params: accountEntryMasterId, headers: headers });
    }
    getAccountEntryMasterDetailsList() {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.get(this.commonService.rootData.rootUrl + 'acountEntryMaster/acountEntryMasterList', { headers: headers });
    }


    // Account to account transfer master
    SaveAccountToAccountTransferMaster(accountToAccountTransferMasterData: any) {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.post(this.commonService.rootData.rootUrl + 'acountEntryMaster/addNewAcountToAcountTransfer', accountToAccountTransferMasterData, { headers: headers });
    }
    UpdateAccountToAccountTransferMaster(accountToAccountTransferMasterData: any) {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.post(this.commonService.rootData.rootUrl + 'acountEntryMaster/addNewAcountToAcountTransferUpdate', accountToAccountTransferMasterData, { headers: headers });
    }
    deleteAccountToAccountTransferMasterDetailsByID(accountToAccountTransferMasterId: any) {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.get(this.commonService.rootData.rootUrl + 'acountEntryMaster/acountEntryMasterDetailsById', { params: accountToAccountTransferMasterId, headers: headers });
    }
    getAccountToAccountTransferMasterDetailsList() {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.get(this.commonService.rootData.rootUrl + 'acountEntryMaster/addNewAcountToAcountTransferList', { headers: headers });
    }


    // account entry report
    getAccountEntryReportDetailsByID(accountEntryReportById: any) {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.get(this.commonService.rootData.rootUrl + 'acountEntryMaster/acountEntryReport', { params: accountEntryReportById, headers: headers });
    }
    getGroupWiseAccountEntryReportDetailsByID(accountEntryReportById: any) {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.get(this.commonService.rootData.rootUrl + 'acountEntryMaster/groupWiseAcountEntryReport', { params: accountEntryReportById, headers: headers });
    }
    acountEntryListDateGroupIdLedgerIdWise(accountEntryList: any) {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.get(this.commonService.rootData.rootUrl + 'acountEntryMaster/acountEntryListDateGroupIdLedgerIdWise', { params: accountEntryList, headers: headers });
    }
    deleteAccountListData(deleteAccountData: any) {
        let headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        })
        return this.http.post(this.commonService.rootData.rootUrl + 'acountEntryMaster/addNewAcountToAcountTransferDelete', deleteAccountData, { headers: headers });
    }


}
