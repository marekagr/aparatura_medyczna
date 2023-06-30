import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { GlobalVariable } from '../../../../global';
import { Subject,BehaviorSubject,Observable } from "rxjs";

import { User } from "../models/User";
import { CurrentUser } from "../models/CurrentUser";
import { GrantMenu } from "../models/GrantMenu";
import { GrantDirectory } from "../models/GrantDirectory";
// import {AlertService} from "../../../components/alert/services/alert.service"
const httpOptionsText={headers:new HttpHeaders({'Content-Type':  'text/plain'})};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject$ = new BehaviorSubject<CurrentUser|null>(JSON.parse(localStorage.getItem('currentUser')!));
    this.currentUser$ = this.currentUserSubject$.asObservable();
  }

  public get currentUserValue(): CurrentUser {
    return this.currentUserSubject$.value!;
}


  globalUrl=GlobalVariable.BASE_API_URL;
  private token:string|null=null;
  private isAuthenticated = false;
  private tokenTimer: any;
  private expiresInDuration: number=0;
  private authStatusListener = new Subject<boolean>();
  private currentUserSubject$: BehaviorSubject<CurrentUser|null>;
  public currentUser$: Observable<CurrentUser|null>;
  public user$ = new BehaviorSubject<User[]>([]);
  public grantMenu$ = new BehaviorSubject<GrantMenu[]>([]);
  public grantDirectory$ = new BehaviorSubject<GrantDirectory[]>([]);

  createUser(user: string, password: string) {
    const url = `${this.globalUrl}/uzytkownik/dodaj`;
    const userData = { user: user, password: password };
    this.http.post(url, userData,httpOptionsText)
      .subscribe(response => {
        console.log(response);
      });
  }


  getUsers() {
    const url = `${this.globalUrl}/uzytkownik`;
   this.http.get<User[]>(url).subscribe(data=>this.user$.next([...data]))
  }

  getUsers$(){
    return this.user$.value
  }

  getGrantMenu() {
    const url = `${this.globalUrl}/uprawnienia/menu`;
   this.http.get<GrantMenu[]>(url).subscribe(data=>this.grantMenu$.next([...data]))
  }

  getGrantDirectory() {
    const url = `${this.globalUrl}/uprawnienia/slowniki`;
   this.http.get<GrantDirectory[]>(url).subscribe(data=>this.grantDirectory$.next([...data]))
  }

  updateUser(id:string,user:User):Observable<User>{
    return this.http.put<User>(`${this.globalUrl}/uzytkownik/${id}`,user,httpOptionsText);
  }

  changePassword(id:string,password:string):Observable<User>{
    return this.http.put<User>(`${this.globalUrl}/uzytkownik/zmiana-hasla/${id}`,{password:password},httpOptionsText);
  }

  login(user: string, password: string):Observable<any> {
    const userData = { user: user, password: password };
    const url = `${this.globalUrl}/uzytkownik/login`;
    return this.http.post<any>(url,userData)
    //.shareReplay();
      // .subscribe(response => {
      //   const token = response.token;
      //   this.token = token;
      //   if (token) {
      //     const expiresInDuration = response.expiresIn;
      //     this.setAuthTimer(expiresInDuration);
      //     this.isAuthenticated = true;
      //     this.authStatusListener.next(true);
      //     const now = new Date();
      //     const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
      //     console.log(expirationDate);
      //     const grantMenu:any[]=this.getGrants(response.user.grantMenu,'grantMenuId')
      //     const currentUser:CurrentUser={user:response.user.user,token:token,expirationDate:expirationDate,grantMenu:this.getGrants(response.user.grantMenu,'grantMenuId')}
      //     this.currentUserSubject$.next(currentUser);

      //     this.saveAuthData(token, expirationDate,grantMenu,currentUser);
      //     this.router.navigate(["/"]);
      //   }
      // });
  }

  saveUserStorage(response:any){

    const token = response.token;
    this.token = token;
    if (token) {
      const expiresInDuration = response.expiresIn;
      this.expiresInDuration=expiresInDuration;
      this.setAuthTimer(expiresInDuration);
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      const now = new Date();
      const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
      console.log(expirationDate);
      const grantMenu:any[]=this.getGrants(response.user.grantMenu,'grantMenuId')
      const grantDirectory:any[]=this.getGrants(response.user.grantDirectory,'grantDirectoryId')
      const currentUser:CurrentUser={user:response.user.user,_id:response.user._id,token:token,expirationDate:expirationDate,grantMenu:grantMenu,grantDirectory:grantDirectory}
      this.currentUserSubject$.next(currentUser);
      this.saveAuthData(token, expirationDate,grantMenu,currentUser);
      this.router.navigate(["/"]);
    }
  }

  logout() {
    console.log('logout')
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.currentUserSubject$.next(null);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    // this.alertService.getShowAlertListener().subscribe(x=>
    //   this.alertService.setShowAlertListener$(true)
    // )
    this.router.navigate(["/"]);
  }

  getToken() {
    return this.token;
  }


  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    // localStorage.removeItem("grantMenu");
    // localStorage.removeItem("grantDirectory");
    localStorage.removeItem("currentUser");
  }

  private saveAuthData(token: string, expirationDate: Date,grantMenu:any[],currentUser:CurrentUser) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    // localStorage.setItem("grantMenu", JSON.stringify(grantMenu));
    // localStorage.setItem("grantDirectory", JSON.stringify(grantDirectory));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  public refreshTimer(){
    clearTimeout(this.tokenTimer);
    this.setAuthTimer(this.expiresInDuration)
  }

  private getGrants(arr:[],field:string):any[]{
    const result=arr.map(x=>x[field]['name'])
    return result
  }

  public checkGrant(item:string,grant:string="grantMenu"):boolean{
    let isFound:boolean=false
    if(this.currentUserValue){
      const userGrant:string[]=this.currentUserValue[grant as keyof CurrentUser] as string[];
      // userGrant.some(x=>{x==item})
      isFound=userGrant.some(x=>x==item)
    }

    return isFound
    // console.log('checkGrant',this.currentUser$)
  }
}
