import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';


const routes: Routes = [
    {
        path: '',
        redirectTo: 'admin/admin-login',
        pathMatch: 'full',
    }, {
        path: '',
        component: AdminLayoutComponent,
        children: [{
            path: '',
            loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
        }]
    }, {
        path: '',
        component: LoginLayoutComponent,
        children: [{
            path: '',
            loadChildren: './layouts/login-layout/login-layout.module#LoginLayoutModule'
        }]
    }

];

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes, {
            //useHash: true
        })
    ],
    exports: [
    ],
})
export class AppRoutingModule { }
