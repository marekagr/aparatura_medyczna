import { Component,ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { RegisterService } from "../../services/register.service";
import { Deal } from "../../models/Deal";
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss']
})
export class IngredientComponent {
  displayedColumns = ['select','name', 'type','sn','opk'];
  private currentDeal$?: Subscription;
  private currentDeal!:Deal;
  dataSource = new MatTableDataSource();
  dataSourceTarget = new MatTableDataSource();
  public registerItems$: Subscription=new Subscription();
  public registerItems:any[]=[];
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  sortState={active:'',direction:''}
  selection = new SelectionModel<Element>(true, []);
  constructor(public registerService: RegisterService) {}

  ngOnInit(): void {
    this.currentDeal$=this.registerService.getcurrentDealListener().subscribe(deal=>{
      console.log('current deal:',deal)
      this.currentDeal=deal
      // this.dealForm.get('own_number_of_deal')?.setValue(deal.own_number_of_deal)
      //this.ref.detectChanges();
    });
    this
    this.registerService.getregisterItems()
    this.registerItems$=this.registerService.getregisterItems$().subscribe(items=>{
      console.log('registerItems',this.registerItems);
      this.registerItems=this.registerService.getregisterItemsValue().filter(item=>{
        if(this.currentDeal && item._id!=this.currentDeal._id)return true;
        else return false
      })
      this.dataSource.sort=this.sort;
      this.dataSource.data=this.registerItems;
      // this.chooseDateRange()
      
    })

    

    this.sort.sortChange.subscribe(()=>{
      console.log('sortchange',this.sort.active,this.sort.direction);
      this.sortState={active:this.sort.active,direction:this.sort.direction}
    })


 
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }


     /** Selects all rows if they are not all selected; otherwise clear selection. */
     masterToggle() {
      // this.isAllSelected() ?
      //   this.selection.clear() :
      //   this.dataSource.data.forEach(row => this.selection.select(row));
      // console.log(this.data);
    }
  

}
