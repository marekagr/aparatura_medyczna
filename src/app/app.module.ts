import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import localePl from '@angular/common/locales/pl';
registerLocaleData(localePl, 'pl');

import { MatRippleModule } from '@angular/material/core';
// import { MomentDateModule } from '@angular/material-moment-adapter';
// import { MatNativeDateModule } from '@angular/material/core';
import { MomentDateModule } from '@angular/material-moment-adapter';
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
import { DragAndDropDirective } from './common/directives/drag-and-drop.directive';
import { FileuploadComponent } from './components/fileupload/fileupload.component';
import { AttachmentListComponent } from './components/register/components/attachment-list/attachment-list.component';
import { LoginComponent } from './components/auth/components/login/login.component';
import { ProducerComponent } from './components/directory/producer/components/producer/producer.component';
import { OpkComponent } from './components/directory/opk/components/opk/opk.component';
import { InspectionPeriodDirective } from './common/directives/inspection-period.directive';
import { GetAlertClassPipe } from './common/pipes/get-alert-class.pipe';
import { UserFormComponent } from './components/auth/components/user-form/user-form.component';
import { UserPasswordComponent } from './components/auth/components/user-password/user-password.component';
import { UserListComponent } from './components/auth/components/user-list/user-list.component';
import { UserSettingsComponent } from './components/auth/components/user-setting/user-settings.component';
import { UserColumnsComponent } from './components/auth/components/user-columns/user-columns.component';
import { IngredientComponent } from './components/register/components/ingredient/ingredient.component';

@NgModule({
  declarations: [
    AppComponent,

    MainComponent,
    HeaderComponent,
    FooterComponent,
    RegisterListComponent,
    RegisterFormComponent,
    AttachmentListComponent,
    LoginComponent,
    ProducerComponent,
    OpkComponent,
    InspectionPeriodDirective,
    GetAlertClassPipe,
    UserFormComponent,
    UserPasswordComponent,
    UserListComponent,
    UserSettingsComponent,
    UserColumnsComponent,
    DragAndDropDirective,
    FileuploadComponent,
    IngredientComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    // MatNativeDateModule,
    MomentDateModule
  ],
  providers: [RegisterFormComponent ,{provide: LOCALE_ID, useValue: 'pl-PL' },{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
  bootstrap: [AppComponent]
})
export class AppModule { }
