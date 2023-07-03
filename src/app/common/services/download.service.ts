import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from "@angular/common/http";
import {Observable,throwError } from 'rxjs';
import {catchError,retry} from 'rxjs/operators'

import { GlobalVariable } from '../../../global';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  globalUrl=GlobalVariable.BASE_API_URL;
  constructor(private http:HttpClient) { }

  downloadFile(plik:string,_id:string):Observable<any>{
    let param = new HttpParams().append('filename',plik).append('id',_id)
    console.log('params',param.getAll('id'),param.getAll('filename'))
    const options = {params:param}
    return this.http.get(`${this.globalUrl}/rejestr/download`,{...options,responseType:'blob'});
  }
}