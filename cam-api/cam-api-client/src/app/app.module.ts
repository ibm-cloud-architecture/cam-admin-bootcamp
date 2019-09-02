import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { DeployTemplateComponent } from './deploy-template/deploy-template.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CarbonModule } from './carbon/carbon.module';

import { fakeBackendProvider } from './_helpers';


import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    DeployTemplateComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CarbonModule,
    ReactiveFormsModule,
    routing
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    // comment out before deploying to serverng 
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
