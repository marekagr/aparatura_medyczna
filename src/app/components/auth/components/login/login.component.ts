import { Component, OnInit } from '@angular/core';
import { NgForm ,FormControl, FormGroup, Validators} from "@angular/forms";
// import {MatSnackBar } from '@angular/material/snack-bar';

import {UtilityService} from "../../../../common/services/utility.service"
import { AuthService } from "../../services/auth.service";
// import {AlertService} from "../../../../components/alert/services/alert.service"
import { timer } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  callTimer = timer(1000)
  isLoading = false;
  form = new FormGroup({
    userCtrl: new FormControl(null, Validators.compose([Validators.required])),
    passwordCtrl: new FormControl(null,Validators.compose([Validators.required])),
  });
  get userCtrl(): any { return this.form.get('userCtrl'); }
  get passwordCtrl(): any { return this.form.get('passwordCtrl'); }

  constructor(public utilityService: UtilityService,public authService: AuthService) { }

  ngOnInit(): void {
    this.form.get('userCtrl')!.setValue(null);
    const subscribe = this.callTimer.subscribe(val => {
      console.log(val)
      this.form.get('userCtrl')!.setValue(null);
      this.form.get('passwordCtrl')!.setValue(null);
    });
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.user, form.value.password);
    // this.authService.createUser(form.value.user, form.value.password);
  }

  login(){
    if(this.form.invalid)return;


      this.isLoading = true;
      this.authService.login(this.form.controls['userCtrl'].value!,this.form.controls['passwordCtrl'].value!).subscribe(response=>{
        this.authService.saveUserStorage(response)

      },
        err => {console.log(err,err.error);
              //  this.openSnackBar(err.error.message,'zamknij',4000)
               this.utilityService.openSnackBar(err.error.message,'zamknij',4000)
               this.isLoading=false
               this.form.get('userCtrl')!.setValue(null);
               this.form.get('passwordCtrl')!.setValue(null);
              },
           () => {this.isLoading=false}
      );



    //   this.userService.login(this.tournamentName,this.firstFormGroup.controls.userCtrl.value,this.firstFormGroup.controls.passwordCtrl.value)
    //   .subscribe(user=>{
    //     console.log(user);
    //     this.userService.saveUserStorage(this.tournamentName,'userInfo',user) ;
    //     this.router.navigate(['turniej','rejestracja',this.tournamentName]);
    //   },
    //   err => {console.log(err,err.error);
    //     this.openSnackBar(err.error,'zamknij',15000)
    //     this.showSpinner=false
    //    },
    //   () => {this.showSpinner=false}
    //   );
    // }
   }

  //  openSnackBar(message: string, action: string,duration:number) {
  //   this.snackBar.open(message, action, {
  //     duration: duration,
  //     verticalPosition : 'top',
  //     horizontalPosition :'center'
  //   });
  // }

}
