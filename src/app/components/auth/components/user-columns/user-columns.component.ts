import { Component, OnInit,Input ,AfterViewInit} from '@angular/core';
import {FormControl,FormGroup,Validators,AbstractControl,FormGroupDirective,NgForm} from '@angular/forms';

import { AuthService } from "../../../auth/services/auth.service";
import { RegisterService } from "../../../../components/register/services/register.service";
import {User} from "../../../auth/models/User"
import {CurrentUser} from "../../../auth/models/CurrentUser"
import {Column} from "../../../auth/models/Column"
import { switchMap } from 'rxjs';


@Component({
  selector: 'user-columns',
  templateUrl: './user-columns.component.html',
  styleUrls: ['./user-columns.component.scss']
})
export class UserColumnsComponent implements OnInit,AfterViewInit {
  @Input() user?:User|CurrentUser|null;
  @Input() column?:Column[];
  @Input() showHeader?:boolean=false;
  @Input() showFooter?:boolean=false;

  public  columnList: Column[]=[];
  localUser:any
  userForm:FormGroup= new FormGroup({
    // name: new FormControl('', [Validators.required]),

    column:new FormControl(),
    
    _id:new FormControl(),
    __v:new FormControl(),
  });
  constructor(public authService: AuthService,public registerService: RegisterService) { }
  ngOnInit(): void {
    // this.localUser=JSON.parse(JSON.stringify(this.user));
    // delete this.localUser.user;
    // delete this.localUser.password;
    // if(this.user?.column)this.localUser.grantMenu=this.localUser.grantMenu.map((x:any)=>{return x.grantMenuId._id})
    // if(this.user?.grantDirectory)this.localUser.grantDirectory=this.localUser.grantDirectory.map((x:any)=>{return x.grantDirectoryId._id})

    // this.userForm.setValue(this.localUser);
  }

  ngAfterViewInit() {

    this.localUser=JSON.parse(JSON.stringify(this.user));
    delete this.localUser.user;
    delete this.localUser.password;
    // if(this.user?.column){
    //     this.authService.setcolumnListByUser(this.user as User,this.column as Column[])
    // //   this.localUser.column=this.localUser.column.map((x:any)=>{return x.columnId._id})
    //  }
    setTimeout(() => {
     if(this.columnList.length==0 && this.authService.getColumn$().length==0){      
      this.authService.getColumn();
    }
    this.authService.column$.subscribe(x => {
      this.columnList = x
      if(this.localUser && typeof this.localUser.column !='undefined')this.authService.setcolumnListByUser(this.localUser as User,this.columnList);
      this.registerService.setcolumnList$(this.columnList);
      this.userForm.patchValue(this.localUser)
      this.userForm.get('column')?.setValue(this.columnList.filter(item=>item.activated))
    });


    //this.userForm.patchValue(this.localUser);
    })
    }

  onSubmit({ value, valid }: { value: User, valid: boolean }) {
    console.log(value, valid);
    value.column=value.column.map((x:any)=>{return {columnId:x._id}})
    // value.grantDirectory=value.grantDirectory.map((x:any)=>{return {grantDirectoryId:x}})
    this.authService.updateUser(value._id,value).pipe(
      switchMap(data=>this.authService.getUserById(data._id))
    )
    .subscribe(user=>{
      console.log('user after submit columns',user)
      this.authService.saveCurrentUserSubjectByUser(user.user)
      localStorage.setItem("currentUser", JSON.stringify(this.authService.currentUserValue));
    
    })
    
  //   subscribe(data=>{
  //     console.log('onSubmit',data)
  //     this.authService.getUserById(data._id).subscribe(user=>{
  //       this.authService.saveCurrentUserSubjectByUser(data)
  //     localStorage.setItem("currentUser", JSON.stringify(this.authService.currentUserValue));
  //     })
      
  // })
}
}
