import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import localePl from '@angular/common/locales/pl';
registerLocaleData(localePl, 'pl');

import { MatRippleModule } from '@angular/material/core';
// import { MomentDateModule } from '@angular/material-moment-adapter';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_DATE_FORMATS } from '../my-date-formats';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { MainComponent } from './layouts/components/main/main.component';
import { HeaderComponent } from './layouts/components/header/header/header.component';
import { FooterComponent } from './layouts/components/footer/footer/footer.component';
import { RegisterListComponent } from './components/register/components/register-list/register-list.component';
import { RegisterFormComponent } from './components/register/components/register-form/register-form.component';
import { AttachmentListComponent } from './components/register/components/attachment-list/attachment-list.component';
import { LoginComponent } from './components/auth/components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,

    MainComponent,
    HeaderComponent,
    FooterComponent,
    RegisterListComponent,
    RegisterFormComponent,
    AttachmentListComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
