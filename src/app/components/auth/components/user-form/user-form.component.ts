import { Component, OnInit,Input } from '@angular/core';
import {FormControl,FormGroup,Validators} from '@angular/forms';

import {User} from "../../../auth/models/User"
import {GrantMenu} from "../../../auth/models/GrantMenu"
import {GrantDirectory} from "../../../auth/models/GrantDirectory"
import { AuthService } from "../../../auth/services/auth.service";

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  @Input() user?:User;
  @Input() grantMenu?:GrantMenu[];
  @Input() grantDirectory?:GrantDirectory[];
  localUser:any



  userForm:FormGroup= new FormGroup({
    // name: new FormControl('', [Validators.required]),

    grantMenu:new FormControl(),
    grantDirectory:new FormControl(),
    _id:new FormControl(),
    __v:new FormControl(),
  });

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.localUser=JSON.parse(JSON.stringify(this.user));
    delete this.localUser.user;
    delete this.localUser.password;
    if(this.user?.grantMenu)this.localUser.grantMenu=this.localUser.grantMenu.map((x:any)=>{return x.grantMenuId._id})
    if(this.user?.grantDirectory)this.localUser.grantDirectory=this.localUser.grantDirectory.map((x:any)=>{return x.grantDirectoryId._id})

    this.userForm.setValue(this.localUser);
  }



  checkIfGrant(id:string,grants:[]){
    let result=false;
    if(typeof grants!="undefined" && grants!=null)
      result=grants.some(x=>{return x['grantMenuId']['_id']==id})
    return result;
  }

  onSubmit({ value, valid }: { value: User, valid: boolean }) {
    console.log(value, valid);
    value.grantMenu=value.grantMenu.map((x:any)=>{return {grantMenuId:x}})
    value.grantDirectory=value.grantDirectory.map((x:any)=>{return {grantDirectoryId:x}})
    this.authService.updateUser(value._id,value).subscribe(data=>{
      console.log('onSubmit',value)
  })

    // if(! this.data.isEdit){
    //   this.categoryService.addCategory(value).subscribe(data=>{
    //     this.commonService.tellSomethingToParent(`Nowy typ rachunku "${value.name}" został dopisany`);
    //     this.dialogRef.close(data._id);
    //   })
    // }
    // else{
    //   this.categoryService.updateCategory(value._id,value).subscribe(data=>{
    //     this.commonService.tellSomethingToParent(`Zmiany dla ${value.name} zapisano`);
    //     this.dialogRef.close(value);
    //   })
    // }
  }

}
