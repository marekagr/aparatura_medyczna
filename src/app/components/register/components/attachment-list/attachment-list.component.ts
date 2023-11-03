import { Component,OnInit,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { AttachmentService } from "../../../register/services/attachment.service";
import { RegisterService } from "../../services/register.service";
import { Deal } from "../../models/Deal";

@Component({
  selector: 'attachment-list',
  templateUrl: './attachment-list.component.html',
  styleUrls: ['./attachment-list.component.scss']
})
export class AttachmentListComponent implements OnInit{
  private currentDeal$?: Subscription;
  public currentDeal!:Deal;
  private attachments$?: Subscription;
  attachments!:any[];
  displayedColumns = ['filename','do'];
  // displayedColumns = ['filename'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort, {static: true}) sort!: MatSort;

  constructor( public registerService: RegisterService,public attachmentService:AttachmentService) { }
  ngOnInit(): void {

    this.attachments$=this.attachmentService.getBlobsListener().subscribe(items=>{
      console.log('current deal:',items)
      this.attachments=items
      this.dataSource.sort=this.sort;
      this.dataSource.data=this.attachments;
      //this.ref.detectChanges();
    });
    this.currentDeal$=this.registerService.getcurrentDealListener().subscribe(deal=>{
      // console.log('current deal:',deal)
      this.currentDeal=deal

      //this.ref.detectChanges();
    });
  }

  delete(item:any,index?:Number){
    if(confirm('Usunąć załącznik ?')) {
      console.log('delete',item,index,this.currentDeal._id)
      this.attachmentService.deleteAttachment(this.currentDeal._id,item._id,item.filename).subscribe(() => {
        let ind=this.dataSource.data.findIndex((x:any)=>x["_id"]==item._id);
        this.dataSource.data.splice(ind, 1);
        this.dataSource._updateChangeSubscription();
        // this.registerService.getregisterItems();
       });
    }
  }

}
