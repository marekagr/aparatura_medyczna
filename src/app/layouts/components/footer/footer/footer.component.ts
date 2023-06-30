import { Component,OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {AuthService} from "../../../../components/auth/services/auth.service"
import {CurrentUser} from "../../../../components/auth/models/CurrentUser"

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit,OnDestroy {
  private global$: Subscription=new Subscription();
  public  currentUser?: CurrentUser;

  // constructor(public globalService: GlobalService,public authService:AuthService) {
  constructor(public authService:AuthService,) {
    // this.global$=this.globalService.getGlobal$().subscribe(item=>{
    //   if(typeof item=='undefined' || item==null) this.globalService.getGlobal()
    //   this.global=item
    // });
    this.authService.currentUser$.subscribe(x => this.currentUser = x!);
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.global$.unsubscribe();
  }

}
