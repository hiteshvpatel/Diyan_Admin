import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { CommonService } from '../../shared/common.service';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class LoginLayoutService {
    environment: any;

    constructor(private commonService: CommonService, private http: HttpClient) { }


    adminEmployeeLogin(data: any): Observable<any> {
        return this.http.post(this.commonService.rootData.rootUrl + 'adminside/login', data);
    }

}