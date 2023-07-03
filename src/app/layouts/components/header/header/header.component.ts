import { Component, OnInit,ViewChild,ElementRef,ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogRef,MatDialogConfig } from '@angular/material/dialog';
import {ActivatedRoute,  Router} from "@angular/router";
import { MatButton } from '@angular/material/button';

import { Subscription,Observable,fromEvent } from 'rxjs';
import { take,map,tap,first, finalize } from 'rxjs/operators';

import { RegisterService } from "../../../../components/register/services/register.service";

 import {RegisterFormComponent} from "../../../../components/register/components/register-form/register-form.component"

import {AuthService} from "../../../../components/auth/services/auth.service"
import {CurrentUser} from "../../../../components/auth/models/CurrentUser"
import {UtilityService} from "../../../../common/services/utility.service"
import { AttachmentService } from "../../../../common/services/attachment.service";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public  currentUser: CurrentUser|null=null;
  cvsSource:string=""
  checked = true;
  labelPosition: 'before' | 'after' = 'before'
  dialogRegisterFormRef: MatDialogRef<RegisterFormComponent> | undefined

  constructor(public utilityService:UtilityService,public authService:AuthService,public attachmentService: AttachmentService,public registerService: RegisterService,private activeRoute: ActivatedRoute,private router: Router,private dialog: MatDialog) {
    this.authService.currentUser$.subscribe(x => this.currentUser = x!);
   }

   newDeal(){

    this.registerService.setNewDeal();
    this.attachmentService.setBlobsListener(null);
    this.dialogRegisterFormRef= this.dialog.open(RegisterFormComponent,{
      width:"98%",
      maxWidth:'95vw',
      height:"90%",
      disableClose:true,
      autoFocus:true,

    });
    this.dialogRegisterFormRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`,result);
      if(typeof result!="undefined" && result!=null && result!=""){
        // this.registerService.getregisterItems();
        // this.dataSource._updateChangeSubscription();
      }
    });
  }

  goto(data:string){
    // this.dictionary.nativeElement.className='focus__item';
    // console.log('pokaz',this.dictionary._elementRef.nativeElement.className+=" focus__item");
    const tab=data.split(',')
    this.router.navigate(tab);
  }

  logout() {

    this.authService.logout();


 }

 onFileSelect(event: Event ) {
  const input=event.target as HTMLInputElement
  console.log('onFileSelect',input.files)
  try{
    let wynik:any[]=[];

        const reader = new FileReader();
        let previewURL: Observable<any>;
        const files = input.files;
        if (files && files.length) {
          const fileToRead = files[0];
          previewURL = fromEvent(reader, 'load').pipe(take(1), map(
            e => {
              wynik=this.utilityService.onFileLoad(reader.result);
              // this.addDealsFromCSV(wynik);
              if(this.cvsSource=='Organizacyjny')
                this.registerService.addDealsFromCSVOrganizacyjny(wynik)
              else
              if(this.cvsSource=='Zamowienia')
                this.registerService.addDealsFromCSVZamowienia(wynik)
              if(this.cvsSource=='Znajdź brakujace')
                this.registerService.findMissingDealsFromCSV(wynik)
              console.log('wynik',wynik);
            }),
            finalize(()=>input.value="")
          )
          reader.readAsText(fileToRead, "UTF-8");
          const sub=previewURL.subscribe();
        }

      }
  catch(e){
    alert(e)
  }
}

  
   checkGrant(item:string,grant="grantMenu"){
    // return true
     return this.authService.checkGrant(item,grant);
  }
  checkClick($event:Event){
    console.log('checkClick')
    // $event.preventDefault()
    $event.stopPropagation()
  }

  setCvsSourceFun(name:string):string{
    console.log('cvsSourceFun',name)
    return this.cvsSource=name
  }

}
