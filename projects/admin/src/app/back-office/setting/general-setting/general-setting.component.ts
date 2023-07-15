import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { environment } from '../../../../environments/environment';
import { AdminLayoutService } from '../../../layouts/admin-layout/admin-layout.service';
import { CommonService } from '../../../shared/common.service';
import { StorageService, StorageKey } from '../../../shared/storage.service';

@Component({
    selector: 'app-admin-general-setting',
    templateUrl: './general-setting.component.html',
    styleUrls: ['./general-setting.component.css']
})
export class Admingeneralsettingcomponent implements OnInit {
    settingForm: FormGroup;
    // activestoreList:[];
    // rolewisemenuForm: FormGroup;
    // menuList: any;
    // selectedRole: any;
    file: any;
    imgURL: any;
    public imagePathloginlayoutbg;
    public imagePathmenu;
    public imagePathlogo;
    message: string;
    filelogo: any;
    filemenu: any;
    fileloginlayoutbg: any;
    imgURLloginlayoutbg: string | ArrayBuffer;
    imgURLmenu: string | ArrayBuffer;
    imgURLlogo: string | ArrayBuffer;
    colour;
    isView: boolean;
    isCreated: boolean;
    isUpdated: boolean;
    isDeleted: boolean;
    @ViewChild('filelogo') myInputVariablelogo: ElementRef;
    @ViewChild('filemenu') myInputVariablemenu: ElementRef;
    @ViewChild('fileloginlayoutbg') myInputVariableloginlayoutbg: ElementRef;
    messagelogo: string;
    messagemenu: string;
    messageloginlayoutbg: string;

    constructor(private http: HttpClient, private fb: FormBuilder, public storageService: StorageService, private route: ActivatedRoute, private router: Router, public commonService: CommonService, public adminLayoutService: AdminLayoutService) {
        let pagePermission = { module: "admingeneralsetting" }
        this.adminLayoutService.getpagePermission(pagePermission).subscribe((Response: any) => {

            if (Response.meta.code == 200) {

                this.isView = Response.data.isView;
                this.isCreated = Response.data.isCreated;
                this.isUpdated = Response.data.isUpdated;
                this.isDeleted = Response.data.isDeleted;
                if (this.isView === false && this.isCreated === false && this.isUpdated === false) {
                    this.router.navigate(['admin/dashboard']);
                }

            }
            //for select sub industry step
        }, (error) => {
            console.log(error.error.Message);
        });
    }


    ngOnInit() {
        // this.selectedRole = "";
        // this.getactivestorelist();
        this.defaultForm();
        this.getgeneralsetting();

    }

    defaultForm() {

        this.settingForm = this.fb.group({
            _id: [''],
            colour: ['', [Validators.required]]
        })
    }



    previewlogo(files) {

        this.filelogo = files[0];
        //file = this.flies[0];
        if (files.length === 0)
            return;

        var mimeType = files[0].type;
        if (mimeType == "image/jpeg" || mimeType == "image/png") {
            var reader = new FileReader();
            this.imagePathlogo = files;
            reader.readAsDataURL(files[0]);
            reader.onload = (_event) => {
                this.imgURLlogo = reader.result;
            }
            this.messagelogo = "";
        } else {
            this.messagelogo = "Only JPEG and PNG image is supported.";
            this.imgURLlogo = "";
            this.filelogo = "";
            this.myInputVariablelogo.nativeElement.value = "";
            return;
        }
    }

    previewmenu(files) {

        this.filemenu = files[0];
        //file = this.flies[0];
        if (files.length === 0)
            return;

        var mimeType = files[0].type;
        if (mimeType == "image/jpeg" || mimeType == "image/png") {
            var reader = new FileReader();
            this.imagePathmenu = files;
            reader.readAsDataURL(files[0]);
            reader.onload = (_event) => {
                this.imgURLmenu = reader.result;
            }
            this.messagemenu = "";
        } else {
            this.messagemenu = "Only JPEG and PNG image is supported.";
            this.imgURLmenu = "";
            this.filemenu = "";
            this.myInputVariablemenu.nativeElement.value = "";
            return;
        }
    }
    previewloginlayoutbg(files) {

        this.fileloginlayoutbg = files[0];
        //file = this.flies[0];
        if (files.length === 0)
            return;

        var mimeType = files[0].type;
        if (mimeType == "image/jpeg" || mimeType == "image/png") {
            var reader = new FileReader();
            this.imagePathloginlayoutbg = files;
            reader.readAsDataURL(files[0]);
            reader.onload = (_event) => {
                this.imgURLloginlayoutbg = reader.result;
            }
            this.messageloginlayoutbg = "";
        } else {
            this.messageloginlayoutbg = "Only JPEG and PNG image is supported.";
            this.imgURLloginlayoutbg = "";
            this.fileloginlayoutbg = "";
            this.myInputVariableloginlayoutbg.nativeElement.value = "";
            return;
        }
    }

    removeuploadlogo() {

        this.imgURLlogo = "";
        this.filelogo = "";
        this.myInputVariablelogo.nativeElement.value = "";
    }
    removeuploadmenu() {


        this.filemenu = "";
        this.imgURLmenu = "";
        this.myInputVariablemenu.nativeElement.value = "";

    }
    removeuploadloginlayoutbg() {


        this.fileloginlayoutbg = "";
        this.imgURLloginlayoutbg = "";
        this.myInputVariableloginlayoutbg.nativeElement.value = "";
    }
    getgeneralsetting() {


        this.adminLayoutService.getsettinggeneralsetting().subscribe((Response: any) => {

            this.settingForm.controls._id.setValue(Response.data._id);
            this.settingForm.controls.colour.setValue(Response.data.colour);
            //this.imgURL = environment.uploadsUrl +"photos/" + Response.data.profileImage;
            //this.file = Response.data.profileImage;
            if (Response.data.logo != "") {
                this.imgURLlogo = environment.uploadsUrl + "photos/" + Response.data.logo;
                this.filelogo = Response.data.logo;
            } else {
                this.imgURLlogo = "";
                this.filelogo = "";
            }
            if (Response.data.sidebarImage != "") {
                this.imgURLmenu = environment.uploadsUrl + "photos/" + Response.data.sidebarImage;
                this.filemenu = Response.data.sidebarImage;
            } else {
                this.imgURLmenu = "";
                this.filemenu = "";
            }
            if (Response.data.loginLayoutBackgroundImage != "") {
                this.imgURLloginlayoutbg = environment.uploadsUrl + "photos/" + Response.data.loginLayoutBackgroundImage;
                this.fileloginlayoutbg = Response.data.loginLayoutBackgroundImage;
            } else {
                this.imgURLloginlayoutbg = "";
                this.fileloginlayoutbg = "";
            }
            // this.storageService.setValue(StorageKey.colour, Response.data.colour);
            // this.storageService.setValue(StorageKey.logo, Response.data.logo);
            // this.storageService.setValue(StorageKey.sidebarImage, Response.data.sidebarImage);
            // this.storageService.setValue(StorageKey.loginLayoutBackgroundImage, Response.data.loginLayoutBackgroundImage);

        })
    }

    UpdateGeneralSetting() {


        let loginModelObj: FormData = new FormData();
        loginModelObj.append('_id', this.settingForm.value._id);
        loginModelObj.append('colour', this.settingForm.value.colour);
        loginModelObj.append('logo', this.filelogo);
        loginModelObj.append('sidebarImage', this.filemenu);
        loginModelObj.append('loginLayoutBackgroundImage', this.fileloginlayoutbg);



        this.adminLayoutService.Updatesettinggeneralsetting(loginModelObj).subscribe((Response: any) => {

            if (Response.meta.code == 200) {

                window.location.reload();
                //this.getgeneralsetting();
                //this.commonService.notifier.notify('success', Response.meta.message);
            } else {
                this.commonService.notifier.notify('error', Response.meta.message);
            }

        }, (error) => {
            console.log(error);
        });
    }








}