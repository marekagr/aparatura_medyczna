import { Component, OnInit,ViewChild,ElementRef,ChangeDetectionStrategy } from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgFor} from '@angular/common';
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
import {Column} from "../../../../components/auth/models/Column"
import { User } from 'src/app/components/auth/models/User';

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
  toppings = new FormControl('');
  public  columnList: Column[]=[];
  // columnList: any[] = 
  //   [{id:'name',viewValue:'Nazwa Urządzenia',activated:true}, {id:'type',viewValue:'Typ',activated:true},{id:'sn',viewValue:'Numer fabryczny',activated:true},{id:'producer',viewValue:'Producent',activated:true},
  //   {id:'year_production',viewValue:'Rok',activated:true},{id:'deal_service',viewValue:'Serwis',activated:true},{id:'number_of_deal',viewValue:'Nr umowy',activated:true},
  //   {id:'deal_old_service',viewValue:'Stary serwis',activated:false},{id:'opk',viewValue:'Oddział',activated:true},{id:'date_of_last_inspection',viewValue:'Data przeglądu',activated:true}
  //   ,{id:'date_of_next_inspection',viewValue:'Data następnęgo przeglądu',activated:true},
  //   {id:'inventory_number',viewValue:'Numer inwentarzowy',activated:true},{id:'end_of_quarantee',viewValue:'Koniec gwarancji',activated:true},{id:'inspection_period',viewValue:'Przegląd okres',activated:true},
  //   {id:'do',viewValue:'Wykonaj',activated:true}
  //   ]
  private selectedColums: any[] = [];
  
  constructor(public utilityService:UtilityService,public authService:AuthService,public attachmentService: AttachmentService,public registerService: RegisterService,private activeRoute: ActivatedRoute,private router: Router,private dialog: MatDialog) {
    this.authService.currentUser$.subscribe(x => {
      this.currentUser = x!
      console.log('header user',this.currentUser)
      if(this.currentUser && typeof this.currentUser.column !='undefined' && typeof this.columnList !='undefined'){
        this.authService.setcolumnListByUser(this.currentUser as User,this.columnList);
        this.registerService.setcolumnList$(this.columnList);
      }
    });
    if(this.columnList.length==0 && this.authService.getColumn$().length==0){      
      this.authService.getColumn();
    }
    this.authService.column$.subscribe(x => {
      this.columnList = x
      if(this.currentUser && typeof this.currentUser.column !='undefined')this.authService.setcolumnListByUser(this.currentUser as User,this.columnList);
      this.registerService.setcolumnList$(this.columnList);
    });
    
    
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
              if(this.cvsSource=='Producenci')
                this.registerService.addProducerFromCSV(wynik)
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


  // public onMenuKeyDown(event: KeyboardEvent, index: number) {
  //   switch (event.key) {
  //     case 'ArrowUp':
  //       if (index > 0) {
  //         this.setCheckboxFocus(index - 1);
  //       } else {
  //         this.menuItemsRef.last.focus();
  //       }
  //       break;
  //     case 'ArrowDown':
  //       if (index !== this.menuItemsRef.length - 1) {
  //         this.setCheckboxFocus(index + 1);
  //       } else {
  //         this.setFocusOnFirstItem();
  //       }
  //       break;
  //      case 'Enter':
  //       event.preventDefault();
  //       this.premiumAutomobilesList[index].activated
  //         = !this.premiumAutomobilesList[index].activated;
  //       this.onVehicleSelect();
  //       setTimeout(() => this.matMenuTriggerRef.closeMenu(), 200);
  //       break; 
  //   }
  // }

   onColumnSelect(ischecked:any,column:any){
    const index=this.columnList.findIndex((col)=>{return col.id===column.id})
    this.columnList[index]["activated"]=ischecked
    this.selectedColums = this.columnList
    .filter(menuitem => menuitem.activated)
    //.map(menuitem => menuitem.id);
    console.log('selected columns',this.selectedColums,ischecked,column)
    this.registerService.setcolumnList$(this.selectedColums)
  }

  // setcolumnListByUser(){
  //   this.columnList.forEach(column=>column.activated=false)
  //   this.currentUser?.column?.forEach(column=>{
  //     const index=this.columnList.findIndex(item=>item.id==column)
  //     if(index>-1)this.columnList[index]["activated"]=true;
  //   })
  // }
  
}
