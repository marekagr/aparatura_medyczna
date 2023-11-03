import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import {User} from "../../../auth/models/User"
import {GrantMenu} from "../../../auth/models/GrantMenu"
import {GrantDirectory} from "../../../auth/models/GrantDirectory"
import { AuthService } from "../../../auth/services/auth.service";

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users:User[]=[];
  grantMenu:GrantMenu[]=[];
  grantDirectory:GrantDirectory[]=[];
  private users$?: Subscription;
  isFirstGet={users:true,grantMenu:true,grantDirectory:true}
  constructor(public authService: AuthService) {
    if(this.users.length==0 && this.isFirstGet.users){
      this.isFirstGet.users=false;
      this.authService.getUsers();
    }
    // this.users$ = this.authService.getUsers$()
    //   .subscribe((data: User[]) => {
    //     this.users = data;
    // })

    this.authService.user$.subscribe(x => this.users = x);

    if(this.grantMenu.length==0 && this.isFirstGet.grantMenu){
      this.isFirstGet.grantMenu=false;
      this.authService.getGrantMenu();
    }
    this.authService.grantMenu$.subscribe(x => this.grantMenu = x);

    if(this.grantDirectory.length==0 && this.isFirstGet.grantDirectory){
      this.isFirstGet.grantDirectory=false;
      this.authService.getGrantDirectory();
    }
    this.authService.grantDirectory$.subscribe(x => this.grantDirectory = x);
   }

  ngOnInit(): void {
  }

  checkIfGrant(id:string,grants:[]){
    let result=false;
    if(typeof grants!="undefined" && grants!=null)
      result=grants.some(x=>{return x['grantMenuId']['_id']==id})
    return result;
  }
}
