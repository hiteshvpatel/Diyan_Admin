import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { LoginLayoutService } from '../../layouts/login-layout/login-layout.service';
import { CommonService } from './../../shared/common.service';
import { CookieService } from 'ngx-cookie-service';
import * as Chartist from 'chartist';
import { Router } from '@angular/router';
import { StorageService, StorageKey } from '../../shared/storage.service';
import { CoreHelperService } from '../../Providers/core-helper/core-helper.service';
import { AdminLayoutService } from '../../layouts/admin-layout/admin-layout.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  profileImage: any;
  get fChangePasswordData() { return this.changePasswordForm.controls; }
  submittedChangePasswordData = false;
  hide1;
  hide2;
  hide3;

  constructor(private fb: FormBuilder, private router: Router, public commonService: CommonService, private coreHelper: CoreHelperService, private cookieService: CookieService, public adminLayoutService: AdminLayoutService, public storageService: StorageService) { }

  ngOnInit(): void {
    this.defaultChangePasswordForm();
    this.profileImage = environment.uploadedUrl + this.storageService.getValue(StorageKey.profileImage);
  }

  defaultChangePasswordForm() {
    this.changePasswordForm = this.fb.group({
      oldpwd: ['', [Validators.required]],
      newpwd: ['', [Validators.required, this.coreHelper.patternPasswordValidator()]],
      confirmPwd: ['', [Validators.required]],
    }, {
      validator: [this.coreHelper.MustMatch('newpwd', 'confirmPwd')]
    });
  }

  updateChangepwd() {

    this.submittedChangePasswordData = true;
    if (this.changePasswordForm.invalid) {

      return;
    }
    let changepwdObj = {
      "oldpwd": this.changePasswordForm.value.oldpwd,
      "newpwd": this.changePasswordForm.value.newpwd
    }
    this.adminLayoutService.changePassword(changepwdObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.logout();
        this.submittedChangePasswordData = false;
        this.defaultChangePasswordForm();
        this.commonService.notifier.notify('success', Response.meta.message);
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  logout() {
    this.storageService.removeValue(StorageKey._id);
    this.storageService.removeValue(StorageKey.firstName);
    this.storageService.removeValue(StorageKey.middleName);
    this.storageService.removeValue(StorageKey.lastName);
    this.storageService.removeValue(StorageKey.myToken);
    this.storageService.removeValue(StorageKey.employeeId);
    this.storageService.removeValue(StorageKey.roleType);
    this.storageService.removeValue(StorageKey.profileImage);
    this.storageService.removeValue(StorageKey.email);
    this.storageService.removeValue(StorageKey.p_Email);
    this.storageService.removeValue(StorageKey.accountType);
    this.storageService.removeValue(StorageKey.IsDiyanLogin);
    this.router.navigate(['/admin/admin-login']);
  }

}
