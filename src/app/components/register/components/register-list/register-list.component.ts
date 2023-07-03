import { Component, OnInit,OnDestroy,AfterViewInit, ChangeDetectorRef,ViewChild,ElementRef } from '@angular/core';
// import {} from '@angular/localize'
import {FormControl,FormGroup,Validators} from '@angular/forms';
import {RegisterFormComponent} from "../../../../components/register/components/register-form/register-form.component"
import { MatDialog, MatDialogRef,MatDialogConfig } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {MatPaginator,MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { Subscription,iif,of,pipe, Observable,merge,fromEvent } from 'rxjs';
import {debounceTime,tap,finalize,switchMap,mapTo} from 'rxjs/operators'

import { RegisterService } from "../../services/register.service";
import { AttachmentService } from "../../../../common/services/attachment.service";
import { DownloadService } from "../../../../common/services/download.service";
import { UtilityService } from '../../../../common/services/utility.service';
import {AuthService} from "../../../../components/auth/services/auth.service"
import {CurrentUser} from "../../../../components/auth/models/CurrentUser"
import { Deal } from "../../models/Deal";

const dutchRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { return `0 van ${length}`; }
  length = Math.max(length, 0);
  const startIndex = page * pageSize;
  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
  return `${startIndex + 1} - ${endIndex} z ${length}`;
}

@Component({
  selector: 'register-list',
  templateUrl: './register-list.component.html',
  styleUrls: ['./register-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RegisterListComponent implements OnInit,OnDestroy,AfterViewInit {
  public registerItems$: Subscription=new Subscription();
  public registerItems:any[]=[];
  public currentUser: CurrentUser|null=null;
  displayedColumns = ['own_number_of_deal', 'number_of_deal','part2_of_deal','type_of_deal','issue_of_deal','value_of_deal','date_of_sign','date_of_deal','do'];
  dataSource = new MatTableDataSource();
  dialogRegisterFormRef: MatDialogRef<RegisterFormComponent> | undefined
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild('chooseDateButton',{ read: ElementRef }) chooseDateBtn!: ElementRef;
  filterDateForm:FormGroup= new FormGroup({
    date_of_deal_start:new FormControl(),
    date_of_deal_stop:new FormControl(),
    number_of_deal:new FormControl(),
  })
  expandedElement:any;
  isLoading = false;
  isLoadingResults = false;
  sortState={active:'',direction:''}
  // firstPageLabel = $localize`First page`;
  // itemsPerPageLabel = $localize`Items per page:`;
  // lastPageLabel = $localize`Last page`;


  constructor(public authService:AuthService,public attachmentService:AttachmentService,public downloadService:DownloadService,private global_utilities: UtilityService,public registerService: RegisterService,private ref: ChangeDetectorRef,private dialog: MatDialog,public matPaginatorIntl: MatPaginatorIntl) {
    this.authService.currentUser$.subscribe(x => {
      this.currentUser = x!
    });
   }


  ngOnInit(): void {
    this.registerItems$=this.registerService.getregisterItems$().subscribe(items=>{
      console.log('registerItems',this.registerItems);
      this.registerItems=this.registerService.getregisterItemsValue()
      this.dataSource.sort=this.sort;
      this.dataSource.data=this.registerItems;
      // this.chooseDateRange()
      this.ref.detectChanges();
    })
    this.sort.sortChange.subscribe(()=>{console.log('sortchange',this.sort.active,this.sort.direction);this.sortState={active:this.sort.active,direction:this.sort.direction}})

    this.matPaginatorIntl.firstPageLabel="pierwsza strona"
    this.matPaginatorIntl.itemsPerPageLabel="ilość na stronie"
    this.matPaginatorIntl.lastPageLabel = 'ostatnia strona';
    this.matPaginatorIntl.nextPageLabel = 'następna strona';
    this.matPaginatorIntl.previousPageLabel = 'poprzednia strona'
    this.matPaginatorIntl.getRangeLabel = dutchRangeLabel
  }


  edit(item:any,index:Number){
    // this.serviceOrderService.setServiceOrderParts(item.parts);
    // this.serviceOrderService.setServiceOrderActivities(item.activities);
    // item.log_book_items.length=0;
    delete item['isExpanded']
    // delete item['files']
    delete item['createdAt']
    delete item['updatedAt']

    // delete item['representative1_of_deal']
    // delete item['representative2_of_deal']
    // delete item['cofinancing']
    // delete item['changeDeal']
    // delete item['terminationWithDeal']
    // delete item['terminationRest']
    this.registerService.setcurrentDealListener(item)
    this.attachmentService.setBlobsListener(item['files']);

    this.dialogRegisterFormRef = this.dialog.open(RegisterFormComponent,{
      width:"98%",
      maxWidth:'95vw',
      height:"90%",
      disableClose:true,
      autoFocus:true,
      data: {
        currentDeal: item,
        isEdit : true,
      }
    });
    this.dialogRegisterFormRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`,result);
      if(typeof result!="undefined" && result!=null && result!=""){
          this.global_utilities.updateCollection(this.registerItems,result,'_id')
          const updatedDeals=[...this.registerItems];
          const oldDealIndex=updatedDeals.findIndex(p=>p._id===result._id)

          updatedDeals[oldDealIndex]=result;
          this.registerItems=updatedDeals;
          this.dataSource.data=this.registerItems;
          // this.logBookService.getLogBooks();
          this.dataSource._updateChangeSubscription();
          this.registerService.setregisterItems$(this.registerItems);
          this.chooseDateRange();
      }
    });
}


  delete(item:Deal,index?:Number){
    if(confirm('Usunąć umowę ?')) {
       this.registerService.deleteDeal(item._id).subscribe(() => {
        let ind=this.dataSource.data.findIndex((x:any)=>x["_id"]==item._id);
        this.dataSource.data.splice(ind, 1);
        this.dataSource._updateChangeSubscription();
        this.registerService.getregisterItems();

        // this.logBookService.getLogBooks();
       });
    }
  }

returnBlob(res:any,ext:string):Blob{
  const blob=new Blob([res]);
  console.log('blob',blob.type,blob.size);
  switch(ext){
    case 'jpg': return new Blob([res],{type:'image/jpeg'});
      break;
    case 'jpeg': return new Blob([res],{type:'image/jpeg'});
      break;
    case 'pdf': return new Blob([res],{type:'application/pdf'});
      break;
  }
  return new Blob([res],{type:'image/jpeg'})
}

download(filename:string,_id:string){
  // filename="plik.jpg"
  const ext=filename.split('.').pop();
  this.downloadService.downloadFile(filename,_id).subscribe(res=>{
    if(res){
      const url=window.URL.createObjectURL(this.returnBlob(res,ext!));
      window.open(url)
    }
  })
}

chooseDateRange(){
  console.log(this.filterDateForm.get('date_of_deal_start')?.value)
  console.log(this.filterDateForm.get('date_of_deal_stop')?.value)
  this.registerService.getDealByFilter(this.getFilterObject()).subscribe(
    console.log,
    console.error,
    () => console.log('http2$ completed')
  )
}
addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
  console.log(`${type}: ${event.value},${this.filterDateForm.get('date_of_deal_start')?.value},${this.filterDateForm.get('date_of_deal_stop')?.value},${this.filterDateForm.controls['date_of_deal_start'].errors}`);
  if(this.filterDateForm.controls['date_of_deal_start'].errors==null && this.filterDateForm.controls['date_of_deal_stop'].errors==null)this.chooseDateRange()
}


findInName(){
  return this.filterDateForm.get('number_of_deal')?.valueChanges
  .pipe(
    debounceTime(300),
    tap(() => {this.isLoading = true;this.isLoadingResults = true;console.log('this.isLoadingResults',this.isLoadingResults)}),

    // switchMap(value => iif(()=>`${value}`.length>=3,this.appService.search({name: value}, 1))
    // switchMap(value => iif(()=>`${value}`.length>=3,of(['43233','34324234','333333','33334232']),of([]))
    switchMap(value => iif(()=>{ const r=`${value}`.length>=1?true:false;return r},this.registerService.getDealByFilter(this.getFilterObject()),this.registerService.getDealByFilter({}))
    .pipe(
      debounceTime(2000),
      finalize(() =>{this.isLoading = false;this.isLoadingResults = false;console.log('this.isLoadingResults',this.isLoadingResults)}),
      )
    )
  )
  .subscribe(items => this.registerService.setregisterItems$(items));
}

getFilterObject(){
  return {date_of_deal_start:this.filterDateForm.get('date_of_deal_start')?.value,date_of_deal_stop:this.filterDateForm.get('date_of_deal_stop')?.value,number_of_deal:this.filterDateForm.get('number_of_deal')?.value}
}


displayFn(deal: any) {
  if (deal) { return deal.deal_name; }
  else return ''
}

ngAfterViewInit() {

  this.dataSource.paginator = this.paginator;
  this.findInName()

  }

  ngOnDestroy() {

    this.registerItems$.unsubscribe();
  }
}

