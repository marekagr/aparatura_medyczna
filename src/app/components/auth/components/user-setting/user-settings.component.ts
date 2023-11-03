import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {CurrentUser} from "../../models/CurrentUser"
import {User} from "../../models/User"
import {Column} from "../../models/Column"
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  public  currentUser: User|CurrentUser|null=null;
  public  column: Column[]=[];
  isFirstGet={column:true}
  constructor(public authService: AuthService) {
    this.authService.currentUser$.subscribe(x => {if(x)this.currentUser = x!});
    if(this.column.length==0 && this.isFirstGet.column && this.authService.getColumn$().length==0){
      this.isFirstGet.column=false;
      this.authService.getColumn();
    }
    this.authService.column$.subscribe(x => this.column = x);
  }

  ngOnInit(): void {
  }

}
