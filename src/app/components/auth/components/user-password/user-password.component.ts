import { Component, OnInit,Input } from '@angular/core';
import {FormControl,FormGroup,Validators,AbstractControl,FormGroupDirective,NgForm} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from "../../../auth/services/auth.service";
import {User} from "../../../auth/models/User"
import {CurrentUser} from "../../../auth/models/CurrentUser"

export function passwordMatchValidator(c: AbstractControl) : { mismatch: true } | null {
  if (c.get('passwordCtrl')?.value !== c.get('confirmPasswordCtrl')?.value) {
    return {mismatch: true};
  }
  return null
  }

  export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const invalidCtrl = !!(control && control.invalid && control.parent?.dirty);
      const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

      return (invalidCtrl || invalidParent);
    }
  }

@Component({
  selector: 'user-password',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.scss']
})



export class UserPasswordComponent implements OnInit {
  @Input() user?:User|CurrentUser|null;
  @Input() showHeader?:boolean=false;
  @Input() showFooter?:boolean=false;
  matcher = new MyErrorStateMatcher();
  passwordFormGroup:FormGroup = new FormGroup({
    // nameCtrl: new FormControl(this.currentUser.name, Validators.compose([Validators.required])),
     passwordCtrl: new FormControl('', Validators.compose([Validators.required])),
     confirmPasswordCtrl: new FormControl('', Validators.compose([Validators.required])),
     },{validators: [passwordMatchValidator]} );
  constructor(public authService: AuthService) { }

  updatePaasword(){
      this.authService.changePassword(this.user!._id,this.passwordFormGroup.get('passwordCtrl')?.value).subscribe(data=>console.log('change password', data))
    //   this.currentUser={_id:null,name:this.firstFormGroup.get('nameCtrl').value,mail:this.firstFormGroup.get('emailCtrl').value,password:this.firstFormGroup.get('passwordCtrl').value};
      //  this.currentUser={_id:null,mail:this.firstFormGroup.get('emailCtrl').value,password:this.firstFormGroup.get('passwordCtrl').value};

      //  this.userService.addUser(this.data.tournamentName,this.currentUser).subscribe(result=>{
      //     this.openSnackBar('dodano nowego użytkownika','zamknij',5000);
      //     this.currentUser._id=result._id;
      //     this.userService.clearStorage(this.data.tournamentName);
      //     this.dialogRef.close(this.currentUser);
      //   },
      //   err => {console.log('error in component handler:',err.error.errors);
      //     if(err.error.errors.indexOf('duplicate key error collection'))
      //       this.openSnackBar("Błąd! podany email już istnieje",'zamknij',5000);
      //     else
      //     this.openSnackBar("Błąd! Prawdopodobnie brak połączenia z serwerem. Naciśnij F5.",'zamknij',15000)
      //    },);
      }

  ngOnInit(): void {
  }

}

