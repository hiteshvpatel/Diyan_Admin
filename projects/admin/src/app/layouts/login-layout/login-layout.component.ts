import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import 'rxjs/add/operator/filter';
import { LoginnavbarComponent } from '../../components/login-navbar/login-navbar.component';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { StorageService, StorageKey } from '../../shared/storage.service';

import * as $ from "jquery";

@Component({
  selector: 'app-login-layout',
    templateUrl: './login-layout.component.html',
    styleUrls: ['./login-layout.component.css']
})
export class LoginLayoutComponent implements OnInit {

    constructor(public location: Location, private router: Router, public storageService: StorageService) {
        if (this.storageService.getValue(StorageKey.IsDiyanLogin) === 'true') {
            this.router.navigate(['/admin/dashboard']);
        }
    }

  ngOnInit() {
      
  }
  

}
