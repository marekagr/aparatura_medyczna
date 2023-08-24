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
        number_of_deal:new FormControl(),
        deal_old_service:new FormControl(),

        date_of_last_inspection:new FormControl(),
        inspection_period: new FormControl(),
        end_of_quarantee: new FormControl(),       

        opk:new FormControl(),
        inventory_number:new FormControl(),
        
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
  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    console.log(value, valid);
    const DateArray=['date_of_deal_start','date_of_deal_stop','date_of_sign','date_of_registration']
    const DateArrArr=['changeDeal','terminationWithDeal','terminationRest']
    // if(this.logBookForm.get('meter_reading_end').value-this.logBookForm.get('meter_reading_start').value-this.totalKm !=0){
    //   alert(`Błąd, ilość km nieprawidłowa. Ilość km ze strony 1 (${this.logBookForm.get('meter_reading_end').value-this.logBookForm.get('meter_reading_start').value}km) niezgodna z sumą km ze strony 2 (${this.totalKm}km)`);
    //   return;
    // }
    if(valid){
  
        // if(! this.data.isEdit){
        //   this.petrolService.addPetrol(value).subscribe(data=>{
        //     this.commonService.tellSomethingToParent(`Nowe paliwo ${value.name} zostało dopisane`);
        //     this.dialogRef.close(data.petrolId);
        //   })
        // }
        // else{
        let dateOfBirth: Moment = moment(value.date_of_deal_start);
        console.log('dateOfBirth',dateOfBirth.toObject().years)
        DateArray.forEach(item=>{if(value[item]!=null) value[item]=this.utilityService.getParseUTCDate(value[item])})
        DateArrArr.forEach(key=>{
          console.log('key',key)
          value[key].map((item:any)=>{
            console.log('item',item,item['date'])
            // value[item['date']]=this.utilityService.getParseUTCDate(value[item['date']])}
            if(item['date']!=null)item['date']=this.utilityService.getParseUTCDate(item['date'])}
        )})
  
  
  
  
        // value.date_of_deal_start=this.utilityService.getParseUTCDate(value.date_of_deal_start);
        // value.date_of_deal_stop =this.utilityService.getParseUTCDate(value.date_of_deal_stop);
        if(typeof this.getCurrentId()=='undefined' || this.getCurrentId()==null)
        {
          this.registerService.addDeal(value).subscribe(data=>{
            this.registerService.getregisterItems();
            console.log(data)
            this.registerService.setcurrentDealListener(data)
            this.currentDeal=data
            this.dealForm.get('own_number_of_deal')?.setValue(data.own_number_of_deal)
             this.ref.detectChanges();
            // this.commonService.tellSomethingToParent(`Zmiany dla ${value.name} zapisano`);
            this.dialogRef.close(value);
          })
        }
          else
            this.registerService.updateDeal(this.getCurrentId(),value).subscribe(
              data=>{
            // this.commonService.tellSomethingToParent(`Zmiany zapisano`);
             value['files']=this.attachments;
             this.dialogRef.close(value);
            // this.dialogRef.close({todo:'edit',value:value});
              },
              error=>{console.log('error save register',error);this.utilityService.openSnackBar(error.error,'zamknij',10000)}
              )
  
        // }
      // }
  
  
      // this.serviceorderService.getServiceOrderPartsListener().subscribe(items=>value['parts']=items);
      // this.serviceorderService.getServiceOrderActivitiesListener().subscribe(items=>value['activities']=items);
      // value.date=this.commonService.getParseUTCDate(value.date);
      // value.date_term=typeof value.date_term=='undefined'?value['date_term']=value.date:this.commonService.getParseUTCDate(value.date_term);
      // value['carId']=this.currentCar._id;
  
      //  if(! this.data.isEdit){
  
      //   this.serviceorderService.addServiceOrder(value).subscribe(data=>{
      //     console.log('onSubmit logBook',value,data);
      //     this.commonService.tellSomethingToParent(`Nowa karta pojazdu została dopisana`);
      //     this.dialogRef.close(data._id);
      //   })
      //  }
      //  else{
      //   const chosenCar:Car=this.cars.find(x=>x._id==value.carId);
      //   const chosenEmployee:Employee=this.employees.find(x=>x._id==value.employeeId);
      //   this.serviceorderService.updateServiceOrder(value._id,value).subscribe(data=>{
      //     this.commonService.tellSomethingToParent(`Zmiany zapisano`);
      //     value.employeeId=chosenEmployee;
      //     value.carId=chosenCar;
      //     // this.dialogRef.close(value);
      //     this.dialogRef.close({todo:'edit',value:value});
      //   })
      //  }
    }
    else alert('Uwaga błędy w formularzu. Dane nie zapisane');
  }
  
}
