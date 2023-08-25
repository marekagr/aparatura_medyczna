import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";

import { GlobalVariable } from '../../../../../global';
import { Subject,BehaviorSubject } from "rxjs";
import { Observable,of,from } from 'rxjs';

import {Opk} from "../models/Opk"

const httpOptions={headers :new HttpHeaders({'Content-Type':'application/json'})};
const httpOptionsText={headers:new HttpHeaders({'Content-Type':  'text/plain'})};
const httpOptionsform = {headers: new HttpHeaders({   'Content-Type': 'application/x-www-form-urlencoded'})}


@Injectable({
  providedIn: 'root'
})
export class OpkService {
  globalUrl=GlobalVariable.BASE_API_URL;

  private opks$ = new BehaviorSubject<Opk[]>([]);

  constructor(private http:HttpClient) {}

    /**
   * http get all opks
   *
   */
  getOpks() {
    let url=`${this.globalUrl}/opk`;
    this.http.get<Opk[]>(url)
      .subscribe((data) => {
        this.opks$.next([...data]);
      });
  }

  getOpks$() {
    return this.opks$.asObservable();
  }
}