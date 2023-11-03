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
import {debounceTime,tap,finalize,switchMap,mapTo, filter} from 'rxjs/operators'

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
  public columnList$: Subscription=new Subscription();
  public columnList:any[]=[];
  public currentUser: CurrentUser|null=null;
  displayedColumns = ['left','name', 'type','sn','producer','year_production','deal_service','number_of_deal','deal_old_service','opk','date_of_last_inspection','date_of_next_inspection','inventory_number','end_of_quarantee','inspection_period','do'];
  dataSource = new MatTableDataSource();
  dialogRegisterFormRef: MatDialogRef<RegisterFormComponent> | undefined
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild('chooseDateButton',{ read: ElementRef }) chooseDateBtn!: ElementRef;
  filterDateForm:FormGroup= new FormGroup({
    date_of_next_inspection_start:new FormControl(),
    date_of_next_inspection_stop:new FormControl(),
    name:new FormControl(),
  })
  expandedElement:any;
  isLoading = false;
  isLoadingResults = false;
  sortState={active:'',direction:''}
  today=new Date();
  selectedDay=30
  alertUrgentDate:Date=new Date();
  alertWarnDate:Date=new Date()
  alertUrgentMR=0;
  alertWarnMR=0;
  alertClass={};
  searchLabel=''
  // firstPageLabel = $localize`First page`;
  // itemsPerPageLabel = $localize`Items per page:`;
  // lastPageLabel = $localize`Last page`;


  constructor(public authService:AuthService,public attachmentService:AttachmentService,public downloadService:DownloadService,public global_utilities: UtilityService,public registerService: RegisterService,private ref: ChangeDetectorRef,private dialog: MatDialog,public matPaginatorIntl: MatPaginatorIntl) {
    this.authService.currentUser$.subscribe(x => {
      this.currentUser = x!
    });
   }


  ngOnInit(): void {
    this.registerService.getregisterItems()
    this.registerItems$=this.registerService.getregisterItems$().subscribe(items=>{
      console.log('registerItems',this.registerItems);
      this.registerItems=this.registerService.getregisterItemsValue()
      this.dataSource.sort=this.sort;
      this.dataSource.data=this.registerItems;
      // this.chooseDateRange()
      this.ref.detectChanges();
    })

    this.columnList$=this.registerService.getcolumnList$().subscribe(items=>{
      this.displayedColumns = items
    .filter(menuitem => menuitem.activated)
    .map(menuitem => menuitem.id);
      this.columnList=this.registerService.getcolumnListValue()
      console.log('columnList',this.columnList);
      // this.chooseDateRange()
      this.ref.detectChanges();
    })


    this.sort.sortChange.subscribe(()=>{
      console.log('sortchange',this.sort.active,this.sort.direction);
      this.sortState={active:this.sort.active,direction:this.sort.direction}
      this.searchLabel=this.authService.getColumnValueByField('id',this.sort.active)
    })

    this.matPaginatorIntl.firstPageLabel="pierwsza strona"
    this.matPaginatorIntl.itemsPerPageLabel="ilość na stronie"
    this.matPaginatorIntl.lastPageLabel = 'ostatnia strona';
    this.matPaginatorIntl.nextPageLabel = 'następna strona';
    this.matPaginatorIntl.previousPageLabel = 'poprzednia strona'
    this.matPaginatorIntl.getRangeLabel = dutchRangeLabel

    this.alertUrgentDate.setDate(new Date().getDate()+Math.floor(this.selectedDay/2));
    this.alertWarnDate.setDate(new Date().getDate()+this.selectedDay);
    this.searchLabel=this.authService.getColumnValueByField('id',this.sort.active)

  }


  edit(item:any,index:Number){
    // this.serviceOrderService.setServiceOrderParts(item.parts);
    // this.serviceOrderService.setServiceOrderActivities(item.activities);
    // item.log_book_items.length=0;
    delete item['isExpanded']
    // delete item['files']
    delete item['createdAt']
    delete item['updatedAt']
    if(item['inspection_period']==null || item['inspection_period']=='')item['inspection_period']="00:03:00"

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
  console.log(this.filterDateForm.get('date_of_next_inspection_start')?.value)
  console.log(this.filterDateForm.get('date_of_next_inspection_stop')?.value)
  this.registerService.getDealByFilter(this.getFilterObject()).subscribe(
    console.log,
    console.error,
    () => console.log('http2$ completed')
  )
}
addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
  console.log(`${type}: ${event.value},${this.filterDateForm.get('date_of_next_inspection_start')?.value},${this.filterDateForm.get('date_of_next_inspection_stop')?.value},${this.filterDateForm.controls['date_of_next_inspection_start'].errors}`);
  if(this.filterDateForm.controls['date_of_next_inspection_start'].errors==null && this.filterDateForm.controls['date_of_next_inspection_stop'].errors==null)this.chooseDateRange()
}


findInName(){
  return this.filterDateForm.get('name')?.valueChanges
  .pipe(
    debounceTime(300),
    filter(ciag=>{return ciag.length>2 || ciag.length==0}),
    tap(() => {this.isLoading = true;this.isLoadingResults = true;console.log('this.isLoadingResults',this.isLoadingResults)}),

    // switchMap(value => iif(()=>`${value}`.length>=3,this.appService.search({name: value}, 1))
    // switchMap(value => iif(()=>`${value}`.length>=3,of(['43233','34324234','333333','33334232']),of([]))
    switchMap(value => iif(()=>{ const 
      r=`${value}`.length>=1?true:false;
      return r},
      this.registerService.getDealByFilter(this.getFilterObject(),this.sort.active),
      this.registerService.getDealByFilter({}))
    .pipe(
      debounceTime(2000),
      finalize(() =>{this.isLoading = false;this.isLoadingResults = false;console.log('this.isLoadingResults',this.isLoadingResults)}),
      )
    )
  )
  .subscribe(items => this.registerService.setregisterItems$(items));
}

getFilterObject(){
  return {date_of_next_inspection_start:this.filterDateForm.get('date_of_next_inspection_start')?.value,date_of_next_inspection_stop:this.filterDateForm.get('date_of_next_inspection_stop')?.value,name:this.filterDateForm.get('name')?.value}
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

