import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { GlobalVariable } from '../../../../global';
import { Subject,BehaviorSubject,forkJoin } from "rxjs";
import { Observable,of,from,tap,take,finalize } from 'rxjs';

import { UtilityService } from '../../../common/services/utility.service';
import {Deal} from '../models/Deal'
const httpOptions={headers :new HttpHeaders({'Content-Type':'application/json'})};
const httpOptionsText={headers:new HttpHeaders({'Content-Type':  'text/plain'})};
const httpOptionsform = {headers: new HttpHeaders({   'Content-Type': 'application/x-www-form-urlencoded'})}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  globalUrl=GlobalVariable.BASE_API_URL;

  private registerItems$ = new BehaviorSubject<any[]>([]);
  private currentDeal$ = new BehaviorSubject<any>({});

  constructor(private utilityService: UtilityService,private http:HttpClient) {
   }

   addDeal(item:any):Observable<any>{
    const url = `${this.globalUrl}/rejestr`;
    console.log('addDeal',item)
   // return this.http.post<{ msg: string; petrol: Petrol }>(url,petrol,httpOptionsText);

   return this.http.post<any>( url,item,httpOptionsText)
     // )
     // .subscribe(responseData => {
     //   this.router.navigate(["/"]);
     // });
  }

  /**
   * update event type
   * @param id _id of ServiceOrder
   * @param ServiceOrder ServiceOrder
   */
   updateDeal(id:string,data:any):Observable<Deal>{
    return this.http.put<Deal>(`${this.globalUrl}/rejestr/${id}`,data,httpOptionsText);
  }

  deleteDeal(id:string):Observable<any>{
    return this.http.delete(`${this.globalUrl}/rejestr/${id}`)
  }


     /**
   * http get all opks
  *
   */
  getregisterItems() {
    let url=`${this.globalUrl}/rejestr`;
    return this.http.get<any[]>(url)
    .subscribe((data) => {
      console.log('getregisterItems',data)
    this.registerItems$.next([...data]);
    });
  }
  // getHTTPregisterItems():Observable<any> {
  //   let url=`${this.globalUrl}/rejestr`;
  //   return this.http.get<any[]>(url);
  // }

  setregisterItems$(data:any[]){
    this.registerItems$.next([...data]);
  }

  getregisterItems$() {
    return this.registerItems$.asObservable();
  }

  getregisterItemsValue() {
    return this.registerItems$.getValue()
  }

  getDeal(id:string) {
    this.http.get<Deal>(`${this.globalUrl}/pojazd/${id}`)
      .subscribe((data) => {
        //this.car = data;
        console.log('getCar');
        this.currentDeal$.next(data);
      });
  }

  getDealByFilter(filtr:any[string]):Observable<any> {

      const date_of_deal_start=typeof filtr['date_of_deal_start'] == 'undefined' ||  filtr['date_of_deal_start'] ==null ?null:this.utilityService.getParseUTCDate(filtr['date_of_deal_start']);
      const date_of_deal_stop=typeof filtr['date_of_deal_stop'] == 'undefined' ||  filtr['date_of_deal_stop'] ==null ?null:this.utilityService.getParseUTCDate(filtr['date_of_deal_stop']);
      if(date_of_deal_start)filtr['date_of_deal_start']=date_of_deal_start
      if(date_of_deal_stop)filtr['date_of_deal_stop']=date_of_deal_stop

      let url=`${this.globalUrl}/rejestr/filtruj`;
      // return this.http.post<any>( url,filtr,httpOptionsText).subscribe((data) => {
      //   console.log('getregisterItems',data)
      //   this.registerItems$.next([...data]);
      // });
      return this.http.post<any>( url,filtr,httpOptionsText).
      pipe(
        tap((data:any)=>{
          this.registerItems$.next([...data]);
          return data
        })
      )

      // subscribe((data) => {
      //   console.log('getregisterItems',data)
      //   this.registerItems$.next([...data]);
      // });

  }


  setcurrentDealListener(data:any){
    this.currentDeal$.next(data);
  }

  getcurrentDealListener(){
    return this.currentDeal$.asObservable();
  }

  setNewDeal(item:null|Deal=null):Observable<any>{
    console.log('setNewDeal');
    if(item==null)
      return of(this.currentDeal$.next({_id:null,__v:null, own_number_of_deal:null, number_of_deal:'',type_of_deal:'',deal_name: '',
      date_of_sign:new Date(),place_of_sign: 'Tarnobrzeg', date_of_deal_start:new Date(), date_of_deal_stop:new Date(), issue_of_deal:"", status:'',
      value_of_deal:0,date_of_registration:new Date(), registration_business_unit: '',registration_person: '', part1_of_deal: 'Wojewódzki Szpital im. Zofii z Zamoyskich Tarnowskiej w Tarnobrzegu',
      part2_of_deal: '', representative1_of_deal:[],representative2_of_deal:[],cofinancing:[],changeDeal:[],terminationWithDeal:[],terminationRest:[],
    }))
    else
      return of(this.currentDeal$.next(item))

  //   return of(this.currentDeal$.next({_id:null,__v:null, own_number_of_deal:null, number_of_deal:'zew1',type_of_deal:'typ umowy',deal_name: 'Umowa',
  //   date_of_sign:new Date(),place_of_sign: 'Tarnobrzeg', date_of_deal_start:new Date(), date_of_deal_stop:new Date(), issue_of_deal:"przedmiot umowy", status:'oczekująca',
  //   value_of_deal:123000,date_of_registration:new Date(), registration_business_unit: 'Dział Organizacyjny',registration_person: 'Marek', part1_of_deal: 'Szpital Tarnobrzeg',
  //   part2_of_deal: 'Jakaś Jednostka', representative1_of_deal:[],representative2_of_deal:[],cofinancing:[],changeDeal:[],terminationWithDeal:[],terminationRest:[],
  // }));

  }

  addDealFromCVS(dealArray:any[]):Observable<any>{
    let getUrls:any[]=[];
    const url = `${this.globalUrl}/rejestr`;
   // getUrls.push(this.http.post<any>(url,{pairs:element.pairs,description:'',categoryid:`${element.category._id['$oid']}`,bracketsid:null},httpOptionsText));
   dealArray.forEach(item=>{
      getUrls.push(this.http.post<{any:any}>( url,item,httpOptionsText))
    })
    let data:any=new Observable(observer=>{
      forkJoin(getUrls).subscribe({
        next: value => {console.log(value);observer.next(true)},
        complete: () => {console.log('This is how it ends!');observer.next(false)},
    })
   }).pipe(
     take(2),
     finalize(() => {console.log('addPersonsFromCVS complete'); return data;})
   )
   return data;
   }

   addDealsFromCSVOrganizacyjny(result:any[]){
    let dealArray:any[]=[];
     result.forEach(x=>{
       const dealArray:any[]=[]
       if(typeof x[0]!=undefined && x[0]!='' && x[0]!=null){
        const deal={
          // _id:null as null,__v:null as null, own_number_of_deal:x[0], number_of_deal:x[2],type_of_deal:'',deal_name: 'umowa',
          // date_of_sign:this.utilityService.getDateFromString(x[3],/(\d+)\.(\d+).(\d+)/,"$2/$1/$3"),place_of_sign: 'Tarnobrzeg', date_of_deal_start:this.utilityService.getDateFromString(x[3],/(\d+)\.(\d+).(\d+)/,"$2/$1/$3"), date_of_deal_stop:null as null,
          // issue_of_deal:x[4], status:'obowiązująca',value_of_deal:0,date_of_registration:this.utilityService.getDateFromString(x[5],/(\d+)\.(\d+).(\d+)/,"$2/$1/$3"), registration_business_unit: x[6],registration_person: x[7].match(/([A-Za-ząśżźćńłóęĄŻŚŹĆŃŁÓĘ]|\s){1,}/gu)[0],
          // part1_of_deal: 'Wojewódzki Szpital im. Zofii z Zamoyskich Tarnowskiej w Tarnobrzegu',
          // part2_of_deal: x[1], representative1_of_deal:[] as any[],representative2_of_deal:[] as any[],cofinancing:[] as any[],changeDeal:[] as any[],terminationWithDeal:[] as any[],terminationRest:[] as any[]}
          _id:null as null,__v:null as null, name:x[0], type:x[1],sn:x[2],vendor: x[3],year_prduction:x[4],deal_service:x[5],opk:x[6],number_of_deal:x[7],deal_old_service:x[8],
          date_of_last_inspection:this.utilityService.getDateFromString(x[9],/(\d+)\.(\d+).(\d+)/,"$2/$1/$3"),
          inventory_number:x[10],comments:[] as any[],end_of_quarantee:null,inspection_period:null}
          for(let i=11;i<=12;i++)
            if(typeof x[i]!=undefined && x[i]!='' && x[i]!=null)deal.comments.push({comment:x[i]})          
          
          console.log('deal',deal)
          dealArray.push(deal)
        }
        this.addDealFromCVS(dealArray).subscribe(items=>
           {console.log('from csv',items)}
           )
    })
  }

  addDealsFromCSVZamowienia(result:any[]){
    let dealArray:any[]=[];
     result.forEach(x=>{
       const dealArray:any[]=[]
       if(typeof x[0]!=undefined && x[0]!='' && x[0]!=null){
        const deal={
          _id:null as null,__v:null as null, own_number_of_deal:null as null, number_of_deal:x[0],type_of_deal:'',deal_name: x[8],
          date_of_sign:this.utilityService.getDateFromString(x[2],/(\d+)\.(\d+).(\d+)/,"$2/$1/$3"),place_of_sign: 'Tarnobrzeg', date_of_deal_start:this.utilityService.getDateFromString(x[3],/(\d+)\.(\d+).(\d+)/,"$2/$1/$3"), date_of_deal_stop:this.utilityService.getDateFromString(x[4],/(\d+)\.(\d+).(\d+)/,"$2/$1/$3"),
          issue_of_deal:x[7], status:'obowiązująca',value_of_deal:(x[6].replace(/\s/g,"")).replace(",","."),date_of_registration:this.utilityService.getDateFromString(x[5],/(\d+)\.(\d+).(\d+)/,"$2/$1/$3"), registration_business_unit: 'Sekcja Zamówień Publicznych',registration_person: 'Sylwia Sapielak-Majchrowska',
          part1_of_deal: 'Wojewódzki Szpital im. Zofii z Zamoyskich Tarnowskiej w Tarnobrzegu',
          part2_of_deal: x[1], representative1_of_deal:[] as any[],representative2_of_deal:[] as any[],cofinancing:[] as any[],changeDeal:[] as any[],terminationWithDeal:[] as any[],terminationRest:[] as any[]}
          console.log('deal',deal)
          dealArray.push(deal)
        }
        this.addDealFromCVS(dealArray).subscribe(items=>
          {console.log('from csv',items)}
          )
    })
  }


  findMissingDealsFromCSV(result:any[]){
    let dealArray:any[]=[];
    let deals=this.getregisterItemsValue();
     result.forEach(x=>{
      //  const dealArray:any[]=[]
       const myKey: string = 'number_of_deal';
       if(typeof x!=undefined && x!='' && x!=null && deals.findIndex(item=>item[myKey as keyof Deal]==x)==-1){
        // console.log('missing nr umowy',x)
        // const deal={
        //   _id:null as null,__v:null as null, own_number_of_deal:null as null, number_of_deal:x[0],type_of_deal:'',deal_name: x[8],
        //   date_of_sign:this.utilityService.getDateFromString(x[2],/(\d+)\.(\d+).(\d+)/,"$2/$1/$3"),place_of_sign: 'Tarnobrzeg', date_of_deal_start:this.utilityService.getDateFromString(x[3],/(\d+)\.(\d+).(\d+)/,"$2/$1/$3"), date_of_deal_stop:this.utilityService.getDateFromString(x[4],/(\d+)\.(\d+).(\d+)/,"$2/$1/$3"),
        //   issue_of_deal:x[7], status:'obowiązująca',value_of_deal:(x[6].replace(/\s/g,"")).replace(",","."),date_of_registration:this.utilityService.getDateFromString(x[5],/(\d+)\.(\d+).(\d+)/,"$2/$1/$3"), registration_business_unit: 'Sekcja Zamówień Publicznych',registration_person: 'Sylwia Sapielak-Majchrowska',
        //   part1_of_deal: 'Wojewódzki Szpital im. Zofii z Zamoyskich Tarnowskiej w Tarnobrzegu',
        //   part2_of_deal: x[1], representative1_of_deal:[] as any[],representative2_of_deal:[] as any[],cofinancing:[] as any[],changeDeal:[] as any[],terminationWithDeal:[] as any[],terminationRest:[] as any[]
        // }
        // console.log('deal',deal)
        dealArray.push(x)
      }
        
    })
    console.log('missing nr umowy',dealArray)
  }
}

