import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonService } from './shared/common.service';
import { CookieService } from 'ngx-cookie-service';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { NotifierModule } from 'angular-notifier';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppComponent } from './app.component';

import {
    AgmCoreModule
} from '@agm/core';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoaderService } from './Providers/core-interceptor/loader.service';
import { InterceptorService } from './Providers/core-interceptor/core-interceptor.service';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgxSpinnerModule,
        ComponentsModule,
        RouterModule,
        AppRoutingModule,
        NgSelectModule,
        AgmCoreModule.forRoot({
            apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
        }),
        NotifierModule.withConfig({
            // Custom options in here
            position: {
                horizontal: {
                    position: 'middle',
                    //distance: 50,
                },
                vertical: {
                    position: 'bottom',
                    distance: 50,
                    gap: 10
                },
            },
            //behaviour: {
            //  autoHide: false
            //}
        }),
    ],
    declarations: [
        AppComponent,
        AdminLayoutComponent,
        LoginLayoutComponent,
    ],
    providers: [CommonService, CookieService, LoaderService,
        {
            provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
