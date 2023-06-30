import { Component, OnInit,ViewChild,ElementRef,ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogRef,MatDialogConfig } from '@angular/material/dialog';
import {ActivatedRoute,  Router} from "@angular/router";
import { MatButton } from '@angular/material/button';

import { Subscription,Observable,fromEvent } from 'rxjs';
import { take,map,tap,first, finalize } from 'rxjs/operators';

import { RegisterService } from "../../../components/register/services/register.service";
import { AttachmentService } from "../../../components/register/services/attachment.service";
 import {RegisterFormComponent} from "../../../components/register/components/register-form/register-form.component"

import {AuthService} from "../../../../components/auth/services/auth.service"
import {CurrentUser} from "../../../../components/auth/models/CurrentUser"
import {UtilityService} from "../../../../common/services/utility.service"


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

}
