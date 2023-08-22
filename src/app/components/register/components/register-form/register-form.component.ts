import { Component, OnInit,Inject,ChangeDetectorRef } from '@angular/core';
import {FormArray, FormControl,FormGroup,Validators,FormBuilder, Form} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog } from '@angular/material/dialog';
import { Subscription,Observable,startWith,pipe,map, } from 'rxjs';
import * as _moment from 'moment';
import { Moment } from 'moment';
const moment = _moment;

import { RegisterService } from "../../services/register.service";
import { UtilityService } from '../../../../common/services/utility.service';
import { AttachmentService } from "../../services/attachment.service";
// import { EmployeeService } from "../../../employee/services/employee.service";
import { Deal } from "../../models/Deal";
// import { Employee } from "../../../employee/models/Employee";

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit{
  private currentDeal$?: Subscription;
  private currentDeal!:Deal;
  private attachments$?: Subscription;
  attachments!:any[];
  dealForm!:FormGroup;
  public producers:string[]=[];
  public producersAll:string[]=[];
  get comments(): FormArray {
    return this.dealForm.get('comments') as FormArray;
  }
  getCurrentId():string{return this.currentDeal?._id}

  file_upload_config = {
    API: `${this.utilityService.getAPI('file_upload')}/rejestr/pliki/`,
    MIME_types_accepted: "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,image/jpeg",
    is_multiple_selection_allowed: true,
    data: ''
  };

  constructor(public attachmentService: AttachmentService,private utilityService: UtilityService,private ref: ChangeDetectorRef,private formBuilder: FormBuilder,public registerService: RegisterService,private dialog: MatDialog,private dialogRef: MatDialogRef<RegisterFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any) {
      // this.getData()
      console.log('data',data)
      this.dealForm= this.formBuilder.group({
        
        name:new FormControl(null,[Validators.required]),
        type:new FormControl(),
        sn: new FormControl(),

        producer:new FormControl(),
        year_production: new FormControl(),
        deal_service:new FormControl(),
        opk:new FormControl(),

        number_of_deal:new FormControl(),
        deal_old_service:new FormControl(),
        date_of_last_inspection:new FormControl(),

        inventory_number:new FormControl(),
        end_of_quarantee: new FormControl(),
        inspection_period: new FormControl(),

        endate_of_last_inspectiond_of_quarantee:new FormControl(),
        comments:new FormArray([]),


        _id:new FormControl(),
        __v:new FormControl(),
      })
    }


  ngOnInit(): void {
    this.currentDeal$=this.registerService.getcurrentDealListener().subscribe(deal=>{
      console.log('current deal:',deal)
      this.currentDeal=deal
      this.dealForm.get('own_number_of_deal')?.setValue(deal.own_number_of_deal)
      //this.ref.detectChanges();
    });
    this.attachments$=this.attachmentService.getBlobsListener().subscribe(items=>{
      console.log('current deal:',items)
      this.attachments=items
      //this.ref.detectChanges();
    });
   

    this.dealForm?.get('producer')!.valueChanges.pipe(
      startWith(''),
      map(value =>  this.utilityService.filterAutocomplete(value,this.producersAll))
      // this._registration_business_unit_filter(value)),
    ).subscribe(items=>this.producers=items);

   
    this.dealForm.patchValue(this.currentDeal);
    this.addToFormArray()
    // [{name:'Krzysztof',surname:'Stolarski'},{name:'ggg',surname:'huhuhu'}].forEach(item => {
    //   (<FormArray>(this.dealForm.get('representative1_of_deal'))).push(this.createRepresentative(item))
    //  });
    //  [{name:'23213kk',surname:'hhssa3h'},{name:'gggddd',surname:'gggg'}].forEach(item => {
    //   (<FormArray>(this.dealForm.get('representative2_of_deal'))).push(this.createRepresentative(item))
    //  });
    //  [{source:'23213kk',value:1222},{source:'gggddd',value:4444}].forEach(item => {
    //   (<FormArray>(this.dealForm.get('cofinancing'))).push(this.createCofinancing(item))
    //  });
    //  [{info:'informacja 1',date:new Date()},{info:'informacja 1',date:new Date()}].forEach(item => {
    //   (<FormArray>(this.dealForm.get('changeDeal'))).push(this.createChangeDeal(item))
    //  });
    //  [{info:'informacja 1',date:new Date()},{info:'informacja 1',date:new Date()}].forEach(item => {
    //   (<FormArray>(this.dealForm.get('terminationWithDeal'))).push(this.createTerminationWithDeal(item))
    //  });

    //  [{info:'informacja 1',date:new Date()},{info:'informacja 1',date:new Date()}].forEach(item => {
    //   (<FormArray>(this.dealForm.get('terminationRest'))).push(this.createTerminationRest(item))
    //  });
    //  this.dealForm.patchValue(this.currentDeal);
  }


  
/**  change info fields common */
/*--------- terminationRest-------------------*/
createInfo(item:any): FormGroup {
  const pom={...item}
  if(typeof pom['_id'] !=undefined) delete pom['_id']
  if(typeof pom['createdAt'] !=undefined) delete pom['createdAt']
  if(typeof pom['updatedAt'] !=undefined) delete pom['updatedAt']


  const h=Object.entries(pom).reduce((next:any,dane)=>{
    const field=dane[0]
    return {...next,[field]:[dane[1],Validators.required]}
  return
  },{})


  return this.formBuilder.group(h);
}
  addToFormArray(){
    if(! this.currentDeal._id){
        [{name:'Krzysztof',surname:'Stolarski'}].forEach(item => {
        (<FormArray>(this.dealForm.get('representative1_of_deal'))).push(this.createInfo(item))
       });
      //  [{name:'23213kk',surname:'hhssa3h'},{name:'gggddd',surname:'gggg'}].forEach(item => {
      //   (<FormArray>(this.dealForm.get('representative2_of_deal'))).push(this.createInfo(item))
      //  });
      //  [{source:'23213kk',value:1222},{source:'gggddd',value:4444}].forEach(item => {
      //   (<FormArray>(this.dealForm.get('cofinancing'))).push(this.createInfo(item))
      //  });
      //  [{info:'informacja 1',date:new Date()},{info:'informacja 1',date:new Date()}].forEach(item => {
      //   (<FormArray>(this.dealForm.get('changeDeal'))).push(this.createInfo(item))
      //  });
      //  [{info:'informacja 1',date:new Date()},{info:'informacja 1',date:new Date()}].forEach(item => {
      //   (<FormArray>(this.dealForm.get('terminationWithDeal'))).push(this.createInfo(item))
      //  });
  
      //  [{info:'informacja 1',date:new Date()},{info:'informacja 1',date:new Date()}].forEach(item => {
      //   (<FormArray>(this.dealForm.get('terminationRest'))).push(this.createInfo(item))
      //  });
    }
    else
    {
      const fields1=new Array('comments')
      // fields1.forEach((field:string)=>{
      //   let pom:any=this.currentDeal[field as keyof Deal]
      //   pom.forEach((item:any) => {
      //     (<FormArray>(this.dealForm.get(field))).push(this.createRepresentative(item))
      //   })
      //   // console.log(this.currentDeal[field as keyof Deal])
      // })
  
  
      fields1.forEach((field:string)=>{
        let pom:any=this.currentDeal[field as keyof Deal]
        pom.forEach((item:any) => {
          (<FormArray>(this.dealForm.get(field))).push(this.createInfo(item))
        })
        // console.log(this.currentDeal[field as keyof Deal])
      })
        // [{info:'informacja 1',date:new Date()},{info:'informacja 1',date:new Date()}].forEach(item => {
        //   (<FormArray>(this.dealForm.get('terminationRest'))).push(this.createTerminationRest(item))
  
  
    }
  }

}
