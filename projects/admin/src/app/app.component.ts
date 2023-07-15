import { Component, OnInit } from '@angular/core';
import { CommonService } from './shared/common.service';
import { AdminLayoutService } from '../app/layouts/admin-layout/admin-layout.service';
import { HttpClient } from '@angular/common/http'
import { NgxSpinnerService } from "ngx-spinner";
import { StorageService, StorageKey } from '../app/shared/storage.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    constructor(private http: HttpClient,private router: Router, private cookieService: CookieService, private commonService: CommonService, private spinner: NgxSpinnerService, public adminLayoutService: AdminLayoutService, public storageService: StorageService) {
        
        // if (this.storageService.getValue(StorageKey.IsDiyanLogin) == 'true') {
        //     this.router.navigate(['/admin/dashboard']);
        // }

        
    }
    ngOnInit() {
    }
    
}
