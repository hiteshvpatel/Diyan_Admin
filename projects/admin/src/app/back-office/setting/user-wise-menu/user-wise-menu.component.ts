import { Component, OnInit } from '@angular/core';
import { AdminLayoutService } from '../../../layouts/admin-layout/admin-layout.service';
import { CommonService } from '../../../shared/common.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import * as Chartist from 'chartist';
import { NgxSpinnerService } from "ngx-spinner";
import { Sort } from '@angular/material/sort';
import { StorageService, StorageKey } from '../../../shared/storage.service';

declare const $: any;

interface roleMasterData {
    roleName: string;
}



@Component({
    selector: 'app-user-wise-menu',
    templateUrl: './user-wise-menu.component.html',
    styleUrls: ['./user-wise-menu.component.css']
})
export class UserwisemenuComponent implements OnInit {


    userwisemenuForm: FormGroup;
    selectForm: FormGroup;
    submittedMenuData = false;
    activeroleList: any;
    activeuserList: any;
    menuList: any;
    selectedRole = null;
    selectedUser = null;
    isView: boolean;
    isCreated: boolean;
    isUpdated: boolean;
    isDeleted: boolean;

    isCreatedAllSelect: boolean = false;
    isViewAllSelect: boolean = false;
    isUpdatedAllSelect: boolean = false;
    isDeletedAllSelect: boolean = false;

    constructor(public commonService: CommonService, public storageService: StorageService, public adminLayoutService: AdminLayoutService, private fb: FormBuilder, private router: Router, private cookieService: CookieService, private spinner: NgxSpinnerService) {
        let pagePermission = { module: "userwisemenu" }
        this.adminLayoutService.getpagePermission(pagePermission).subscribe((Response: any) => {

            if (Response.meta.code == 200) {

                this.isView = Response.data.isView;
                this.isCreated = Response.data.isCreated;
                this.isUpdated = Response.data.isUpdated;
                this.isDeleted = Response.data.isDeleted;
                if (this.isView === false || this.isCreated === false || this.isUpdated === false) {
                    this.router.navigate(['admin/dashboard']);
                }

            }
            //for select sub industry step
        }, (error) => {
            console.log(error.error.Message);
        });
    }

    ngOnInit() {
        this.getRoleActiveList();
        this.selectedRole = null;
        this.selectedUser = null;
        this.defaultForm();
        //this.defaultselectForm();
        this.menuList = this.userwisemenuForm.get('menuList') as FormArray;
        //this.menuList.push(this.createMenuItem({}));
    }
    defaultForm() {
        this.userwisemenuForm = this.fb.group({
            menuList: this.fb.array([]),
        });
    }
    addMenuItem(oItem?: any) {

        let IG = this.fb.group({
            menuId: [(oItem['_id'] ? oItem['_id'] : ''),],
            title: [(oItem['title'] ? oItem['title'] : ''),],
            isCreated: [(oItem['isCreated'] ? oItem['isCreated'] : false),],
            isUpdated: [(oItem['isUpdated'] ? oItem['isUpdated'] : false),],
            isView: [(oItem['isView'] ? oItem['isView'] : false),],
            isDeleted: [(oItem['isDeleted'] ? oItem['isDeleted'] : false),],
            isShowChildrenList: [(oItem['isShowChildrenList'] ? oItem['isShowChildrenList'] : false),],
            childrenData: this.fb.array([]),
        });
        (<FormArray>this.userwisemenuForm.get('menuList')).push(IG);
        let menuIndex = (<FormArray>this.userwisemenuForm.get('menuList')).length - 1;
        oItem.childrenData.forEach(cItem => {
            this.addChildrenItem(menuIndex, cItem);
        });
    }
    addChildrenItem(oItem: number, cItem?: any) {

        let cd = this.fb.group({
            menuId: [(cItem['_id'] ? cItem['_id'] : ''),],
            title: [(cItem['title'] ? cItem['title'] : ''),],
            isCreated: [(cItem['isCreated'] ? cItem['isCreated'] : false),],
            isUpdated: [(cItem['isUpdated'] ? cItem['isUpdated'] : false),],
            isView: [(cItem['isView'] ? cItem['isView'] : false),],
            isDeleted: [(cItem['isDeleted'] ? cItem['isDeleted'] : false),],
        });
        (<FormArray>(<FormGroup>(<FormArray>this.userwisemenuForm.controls['menuList'])
            .controls[oItem]).controls['childrenData']).push(cd);

    }

    getRoleActiveList() {

        this.adminLayoutService.getRoleList().subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                this.activeroleList = Response.data;
            } else {
            }
            //for select sub industry step
        }, (error) => {
            console.log(error.error.Message);
        });
    }
    onRoleChange(role) {

        this.menuList.clear();
        this.selectedUser = null;
        let roleId = { roleId: this.selectedRole }
        this.adminLayoutService.getUserActiveList(roleId).subscribe((Response: any) => {

            this.selectedRole
            if (Response.meta.code == 200) {
                this.activeuserList = Response.data[0].admindata;

            } else {
            }
            //for select sub industry step
        }, (error) => {
            console.log(error.error.Message);
        });
    }
    onUserChange(user) {

        this.menuList.clear();
        //this.selectedRole = 
        let userId = { userId: this.selectedUser, roleId: this.selectedRole }
        this.adminLayoutService.getUserwisemenuList(userId).subscribe((Response: any) => {

            //this.selectForm.controls.role.setValue(this.selectedRole);
            if (Response.meta.code == 200) {

                this.isCreatedAllSelect = false;
                this.isViewAllSelect = false;
                this.isUpdatedAllSelect = false;
                this.isDeletedAllSelect = false;

                Response.data.forEach(oItem => {
                    this.addMenuItem(oItem);
                });

                var totalCreatedSelected = 0;
                var totalViewSelected = 0;
                var totalUpdatedSelected = 0;
                var totalDeletedSelected = 0;

                (this.userwisemenuForm.controls['menuList'] as FormArray).controls.map((menuList: any) => {
                    if (menuList.value.isCreated == false) {
                        totalCreatedSelected++;
                    }
                    else {
                        (menuList.controls['childrenData'] as FormArray).controls.map((childrenList: any) => {
                            if (childrenList.value.isCreated == false) {
                                totalCreatedSelected++;
                            }
                        })
                    }

                    if (menuList.value.isView == false) {
                        totalViewSelected++;
                    }
                    else {
                        (menuList.controls['childrenData'] as FormArray).controls.map((childrenList: any) => {
                            if (childrenList.value.isView == false) {
                                totalViewSelected++;
                            }
                        })
                    }

                    if (menuList.value.isUpdated == false) {
                        totalUpdatedSelected++;
                    }
                    else {
                        (menuList.controls['childrenData'] as FormArray).controls.map((childrenList: any) => {
                            if (childrenList.value.isUpdated == false) {
                                totalUpdatedSelected++;
                            }
                        })
                    }

                    if (menuList.value.isDeleted == false) {
                        totalDeletedSelected++;
                    }
                    else {
                        (menuList.controls['childrenData'] as FormArray).controls.map((childrenList: any) => {
                            if (childrenList.value.isDeleted == false) {
                                totalDeletedSelected++;
                            }
                        })
                    }

                });
                if (totalCreatedSelected > 0) {
                    this.isCreatedAllSelect = false
                } else {
                    this.isCreatedAllSelect = true
                }

                if (totalViewSelected > 0) {
                    this.isViewAllSelect = false
                } else {
                    this.isViewAllSelect = true
                }

                if (totalUpdatedSelected > 0) {
                    this.isUpdatedAllSelect = false
                } else {
                    this.isUpdatedAllSelect = true
                }

                if (totalDeletedSelected > 0) {
                    this.isDeletedAllSelect = false
                } else {
                    this.isDeletedAllSelect = true
                }

            } else {
            }
            //for select sub industry step
        }, (error) => {
            console.log(error.error.Message);
        });
    }


    isCreatedAllSelectchildrenData(boolean: any) {
        if (boolean === true) {
            (this.userwisemenuForm.controls['menuList'] as FormArray).controls.map((menuList: any) => {
                menuList.get('isCreated').setValue(true);

                (menuList.controls['childrenData'] as FormArray).controls.map((childrenList: any) => {
                    childrenList.get('isCreated').setValue(true);
                })
            })
        }
        else {
            (this.userwisemenuForm.controls['menuList'] as FormArray).controls.map((menuList: any) => {
                menuList.get('isCreated').setValue(false);

                (menuList.controls['childrenData'] as FormArray).controls.map((childrenList: any) => {
                    childrenList.get('isCreated').setValue(false);
                })
            })
        }
    }
    isUpdatedAllSelectchildrenData(boolean: any) {
        if (boolean === true) {
            (this.userwisemenuForm.controls['menuList'] as FormArray).controls.map((menuList: any) => {
                menuList.get('isUpdated').setValue(true);

                (menuList.controls['childrenData'] as FormArray).controls.map((childrenList: any) => {
                    childrenList.get('isUpdated').setValue(true);
                })
            })
        }
        else {
            (this.userwisemenuForm.controls['menuList'] as FormArray).controls.map((menuList: any) => {
                menuList.get('isUpdated').setValue(false);

                (menuList.controls['childrenData'] as FormArray).controls.map((childrenList: any) => {
                    childrenList.get('isUpdated').setValue(false);
                })
            })
        }
    }
    isViewAllSelectchildrenData(boolean: any) {
        if (boolean === true) {
            (this.userwisemenuForm.controls['menuList'] as FormArray).controls.map((menuList: any) => {
                menuList.get('isView').setValue(true);

                (menuList.controls['childrenData'] as FormArray).controls.map((childrenList: any) => {
                    childrenList.get('isView').setValue(true);
                })
            })
        }
        else {
            (this.userwisemenuForm.controls['menuList'] as FormArray).controls.map((menuList: any) => {
                menuList.get('isView').setValue(false);

                (menuList.controls['childrenData'] as FormArray).controls.map((childrenList: any) => {
                    childrenList.get('isView').setValue(false);
                })
            })
        }
    }
    isDeletedAllSelectchildrenData(boolean: any) {
        if (boolean === true) {
            (this.userwisemenuForm.controls['menuList'] as FormArray).controls.map((menuList: any) => {
                menuList.get('isDeleted').setValue(true);

                (menuList.controls['childrenData'] as FormArray).controls.map((childrenList: any) => {
                    childrenList.get('isDeleted').setValue(true);
                })
            })
        }
        else {
            (this.userwisemenuForm.controls['menuList'] as FormArray).controls.map((menuList: any) => {
                menuList.get('isDeleted').setValue(false);

                (menuList.controls['childrenData'] as FormArray).controls.map((childrenList: any) => {
                    childrenList.get('isDeleted').setValue(false);
                })
            })
        }
    }

    saveUserwisemenu() {


        if (this.userwisemenuForm.invalid) {
            this.submittedMenuData = true;
            return;
        }


        let savemenuList = []

        this.userwisemenuForm.value.menuList.forEach(obj => {
            var customObj = {
                'menuId': obj.menuId,
                'isCreated': obj.isCreated,
                'isView': obj.isView,
                'isUpdated': obj.isUpdated,
                'isDeleted': obj.isDeleted,
            }
            savemenuList.push(customObj)
            if (obj.childrenData.length > 0) {
                obj.childrenData.forEach(obj1 => {
                    var customObj1 = {
                        'menuId': obj1.menuId,
                        'isCreated': obj1.isCreated,
                        'isView': obj1.isView,
                        'isUpdated': obj1.isUpdated,
                        'isDeleted': obj1.isDeleted,
                    }
                    savemenuList.push(customObj1)
                });
            }


        });
        let userwisemenuModelObj = {
            'roleId': this.selectedRole,
            "userId": this.selectedUser,
            "userwisemenu": savemenuList
        };

        this.adminLayoutService.SaveuserwiseMenu(userwisemenuModelObj).subscribe((Response: any) => {

            if (Response.meta.code == 200) {
                this.submittedMenuData = false;
                this.selectedRole = null;
                this.selectedUser = null;
                this.isCreatedAllSelect = false;
                this.isViewAllSelect = false;
                this.isUpdatedAllSelect = false;
                this.isDeletedAllSelect = false;
                //this.defaultselectForm();
                this.menuList.clear();
                //this.onRoleChange();
                this.commonService.notifier.notify('success', Response.meta.message);
            }
            else {
                this.commonService.notifier.notify('error', Response.meta.message);
            }
        }, (error) => {
            console.log(error);
        });
    }

    isCreatedAllchildrenData(paramsObj) {

        let menuIndex = paramsObj.index
        let checked = paramsObj.checked

        if (checked == true) {

            (((this.userwisemenuForm.controls['menuList'] as FormArray)
                .controls[menuIndex] as FormGroup).controls['childrenData'] as FormArray).controls.map(value => {
                    value.get('isCreated').setValue(true);
                });

        } else {
            (((this.userwisemenuForm.controls['menuList'] as FormArray)
                .controls[menuIndex] as FormGroup).controls['childrenData'] as FormArray).controls.map(value => {
                    value.get('isCreated').setValue(false);
                });

        }
        var totalCreatedSelected = 0;
        (this.userwisemenuForm.controls['menuList'] as FormArray).controls.map((menuList: any) => {
            if (menuList.value.isCreated == false) {
                totalCreatedSelected++;
            }
            else {
                (menuList.controls['childrenData'] as FormArray).controls.map((childrenList: any) => {
                    if (childrenList.value.isCreated == false) {
                        totalCreatedSelected++;
                    }
                })
            }
        });
        if (totalCreatedSelected > 0) {
            this.isCreatedAllSelect = false
        } else {
            this.isCreatedAllSelect = true
        }
    }
    isViewAllchildrenData(paramsObj) {

        let menuIndex = paramsObj.index
        let checked = paramsObj.checked

        if (checked == true) {
            (<FormArray>(<FormGroup>(<FormArray>this.userwisemenuForm.controls['menuList'])
                .controls[menuIndex]).controls['childrenData']).controls.map(value => value.get('isView').setValue(true));
        } else {
            (<FormArray>(<FormGroup>(<FormArray>this.userwisemenuForm.controls['menuList'])
                .controls[menuIndex]).controls['childrenData']).controls.map(value => value.get('isView').setValue(false));
        }

        var totalViewSelected = 0;
        (this.userwisemenuForm.controls['menuList'] as FormArray).controls.map((menuList: any) => {
            if (menuList.value.isView == false) {
                totalViewSelected++;
            }
            else {
                (menuList.controls['childrenData'] as FormArray).controls.map((childrenList: any) => {
                    if (childrenList.value.isView == false) {
                        totalViewSelected++;
                    }
                })
            }
        });
        if (totalViewSelected > 0) {
            this.isViewAllSelect = false
        } else {
            this.isViewAllSelect = true
        }

    }
    isUpdatedchildrenData(paramsObj) {

        let menuIndex = paramsObj.index
        let checked = paramsObj.checked

        if (checked == true) {
            (<FormArray>(<FormGroup>(<FormArray>this.userwisemenuForm.controls['menuList'])
                .controls[menuIndex]).controls['childrenData']).controls.map(value => value.get('isUpdated').setValue(true));
        } else {
            (<FormArray>(<FormGroup>(<FormArray>this.userwisemenuForm.controls['menuList'])
                .controls[menuIndex]).controls['childrenData']).controls.map(value => value.get('isUpdated').setValue(false));
        }

        var totalUpdatedSelected = 0;
        (this.userwisemenuForm.controls['menuList'] as FormArray).controls.map((menuList: any) => {
            if (menuList.value.isUpdated == false) {
                totalUpdatedSelected++;
            }
            else {
                (menuList.controls['childrenData'] as FormArray).controls.map((childrenList: any) => {
                    if (childrenList.value.isUpdated == false) {
                        totalUpdatedSelected++;
                    }
                })
            }
        });
        if (totalUpdatedSelected > 0) {
            this.isUpdatedAllSelect = false
        } else {
            this.isUpdatedAllSelect = true
        }

    }
    isDeletedchildrenData(paramsObj) {

        let menuIndex = paramsObj.index
        let checked = paramsObj.checked

        if (checked == true) {
            (<FormArray>(<FormGroup>(<FormArray>this.userwisemenuForm.controls['menuList'])
                .controls[menuIndex]).controls['childrenData']).controls.map(value => value.get('isDeleted').setValue(true));
        } else {
            (<FormArray>(<FormGroup>(<FormArray>this.userwisemenuForm.controls['menuList'])
                .controls[menuIndex]).controls['childrenData']).controls.map(value => value.get('isDeleted').setValue(false));
        }

        var totalDeletedSelected = 0;
        (this.userwisemenuForm.controls['menuList'] as FormArray).controls.map((menuList: any) => {
            if (menuList.value.isDeleted == false) {
                totalDeletedSelected++;
            }
            else {
                (menuList.controls['childrenData'] as FormArray).controls.map((childrenList: any) => {
                    if (childrenList.value.isDeleted == false) {
                        totalDeletedSelected++;
                    }
                })
            }
        });
        if (totalDeletedSelected > 0) {
            this.isDeletedAllSelect = false
        } else {
            this.isDeletedAllSelect = true
        }

    }

    isCreatedmenuData(paramsObj) {

        let menuIndex = paramsObj.menuIndex
        var totalSelected = 0;

        (<FormArray>(<FormGroup>(<FormArray>this.userwisemenuForm.controls['menuList'])
            .controls[menuIndex]).controls['childrenData']).controls.forEach(value => {

                if (value.value.isCreated == true) {
                    totalSelected++;
                }

            });
        if (totalSelected > 0) {
            (<FormArray>this.userwisemenuForm.get('menuList'))
                .controls[menuIndex].get('isCreated').setValue(true);
        } else {
            (<FormArray>this.userwisemenuForm.get('menuList'))
                .controls[menuIndex].get('isCreated').setValue(false);
        }

        var totalCreatedSelected = 0;
        (this.userwisemenuForm.controls['menuList'] as FormArray).controls.map((menuList: any) => {
            if (menuList.value.isCreated == false) {
                totalCreatedSelected++;
            }
            else {
                (menuList.controls['childrenData'] as FormArray).controls.map((childrenList: any) => {
                    if (childrenList.value.isCreated == false) {
                        totalCreatedSelected++;
                    }
                })
            }
        });
        if (totalCreatedSelected > 0) {
            this.isCreatedAllSelect = false
        } else {
            this.isCreatedAllSelect = true
        }

    }
    isViewmenuData(paramsObj) {

        let menuIndex = paramsObj.menuIndex
        var totalSelected = 0;
        (<FormArray>(<FormGroup>(<FormArray>this.userwisemenuForm.controls['menuList'])
            .controls[menuIndex]).controls['childrenData']).controls.forEach(value => {

                if (value.value.isView == true) {
                    totalSelected++;
                }

            });
        if (totalSelected > 0) {
            (<FormArray>this.userwisemenuForm.get('menuList'))
                .controls[menuIndex].get('isView').setValue(true);
        } else {
            (<FormArray>this.userwisemenuForm.get('menuList'))
                .controls[menuIndex].get('isView').setValue(false);
        }

        var totalViewSelected = 0;
        (this.userwisemenuForm.controls['menuList'] as FormArray).controls.map((menuList: any) => {
            if (menuList.value.isView == false) {
                totalViewSelected++;
            }
            else {
                (menuList.controls['childrenData'] as FormArray).controls.map((childrenList: any) => {
                    if (childrenList.value.isView == false) {
                        totalViewSelected++;
                    }
                })
            }
        });
        if (totalViewSelected > 0) {
            this.isViewAllSelect = false
        } else {
            this.isViewAllSelect = true
        }

    }
    isUpdatedmenuData(paramsObj) {

        let menuIndex = paramsObj.menuIndex
        var totalSelected = 0;
        (<FormArray>(<FormGroup>(<FormArray>this.userwisemenuForm.controls['menuList'])
            .controls[menuIndex]).controls['childrenData']).controls.forEach(value => {

                if (value.value.isUpdated == true) {
                    totalSelected++;
                }

            });
        if (totalSelected > 0) {
            (<FormArray>this.userwisemenuForm.get('menuList'))
                .controls[menuIndex].get('isUpdated').setValue(true);
        } else {
            (<FormArray>this.userwisemenuForm.get('menuList'))
                .controls[menuIndex].get('isUpdated').setValue(false);
        }

        var totalUpdatedSelected = 0;
        (this.userwisemenuForm.controls['menuList'] as FormArray).controls.map((menuList: any) => {
            if (menuList.value.isUpdated == false) {
                totalUpdatedSelected++;
            }
            else {
                (menuList.controls['childrenData'] as FormArray).controls.map((childrenList: any) => {
                    if (childrenList.value.isUpdated == false) {
                        totalUpdatedSelected++;
                    }
                })
            }
        });
        if (totalUpdatedSelected > 0) {
            this.isUpdatedAllSelect = false
        } else {
            this.isUpdatedAllSelect = true
        }

    }
    isDeletedmenuData(paramsObj) {

        let menuIndex = paramsObj.menuIndex
        var totalSelected = 0;
        (<FormArray>(<FormGroup>(<FormArray>this.userwisemenuForm.controls['menuList'])
            .controls[menuIndex]).controls['childrenData']).controls.forEach(value => {

                if (value.value.isDeleted == true) {
                    totalSelected++;
                }

            });
        if (totalSelected > 0) {
            (<FormArray>this.userwisemenuForm.get('menuList'))
                .controls[menuIndex].get('isDeleted').setValue(true);
        } else {
            (<FormArray>this.userwisemenuForm.get('menuList'))
                .controls[menuIndex].get('isDeleted').setValue(false);
        }

        var totalDeletedSelected = 0;
        (this.userwisemenuForm.controls['menuList'] as FormArray).controls.map((menuList: any) => {
            if (menuList.value.isDeleted == false) {
                totalDeletedSelected++;
            }
            else {
                (menuList.controls['childrenData'] as FormArray).controls.map((childrenList: any) => {
                    if (childrenList.value.isDeleted == false) {
                        totalDeletedSelected++;
                    }
                })
            }
        });
        if (totalDeletedSelected > 0) {
            this.isDeletedAllSelect = false
        } else {
            this.isDeletedAllSelect = true
        }

    }

    showHideMenuList(params) {

        if (params !== undefined && params.index !== undefined) {
            if ((<FormArray>this.userwisemenuForm.get('menuList')).controls[params.index].value.isShowChildrenList == false) {
                (<FormArray>this.userwisemenuForm.get('menuList')).controls[params.index].get('isShowChildrenList').setValue(true);
            } else {
                (<FormArray>this.userwisemenuForm.get('menuList')).controls[params.index].get('isShowChildrenList').setValue(false);
            }

        }
        //isShowChildrenList
    }
}
