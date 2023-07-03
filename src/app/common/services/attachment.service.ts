import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Subject,BehaviorSubject } from "rxjs";
import { Observable,of,from } from 'rxjs';
import { GlobalVariable } from '../../../global';


import { take } from 'rxjs/operators';
import {Deal} from '../../components/register/models/Deal'
const httpOptions={headers :new HttpHeaders({'Content-Type':'application/json'})};
const httpOptionsText={headers:new HttpHeaders({'Content-Type':  'text/plain'})};
const httpOptionsform = {headers: new HttpHeaders({   'Content-Type': 'application/x-www-form-urlencoded'})}


@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  globalUrl=GlobalVariable.BASE_API_URL;
  private files: File[] = [];
  private files$ = new Subject<File[]>();
  private blobs:any[] = [];
  private blobs$ = new BehaviorSubject<any[]>([]); //new Subject<any[]>();

  constructor(private http:HttpClient) { }


  setFilesListener(files:File[]){
    this.files$.next(files);
  }

  getFilesListener() {
    return this.files$.asObservable();
  }


  setBlobsListener(items:any){
    this.blobs$.next(items);
  }

  addBlob(item:any){
    this.getBlobsListener().pipe(take(1)).subscribe(items=>{
       console.log('addBlob')
       let itemsH=[...items]
       itemsH.push(item)
       this.setBlobsListener(itemsH)
    })
  }

  getBlobsListener() {
    return this.blobs$.asObservable();
  }


/**
 * delete attachment file from deal
 * @param id
 * @param fileId
 * @returns Deal
 */
   deleteAttachment(id:string,fileId:string,filename:string):Observable<Deal>{
      return this.http.put<Deal>(`${this.globalUrl}/rejestr/pliki/${id}/${fileId}/${filename}`,{},httpOptionsText);
    }
}
